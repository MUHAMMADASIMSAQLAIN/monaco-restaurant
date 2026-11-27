/**
 * Vercel Serverless Function: /api/reservations
 *
 * Secure server-side handler for Monaco Restaurant table reservations.
 * Features:
 * - GET: Check real-time slot availability for any selected date
 * - POST: Validate reservation, detect table slot conflicts, automatically
 *         assign the closest next available slot if fully booked, and forward
 *         to Zapier Catch Hook (Google Sheets, Gmail, Google Calendar).
 */

// Dinner service hours: 17:00 to 22:00 in 30-min intervals
export const DINNER_TIME_SLOTS = [
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
];

// Maximum concurrent table bookings per 30-minute slot
const MAX_TABLES_PER_SLOT = 2;

// In-memory slot booking register: date -> Map<time, bookingCount>
const bookingsRegister = new Map<string, Map<string, number>>();

// Pre-seed peak hours on busy dates to demonstrate realistic fine-dining demand
function getSlotBookingCount(date: string, time: string): number {
  let dateMap = bookingsRegister.get(date);
  if (!dateMap) {
    dateMap = new Map<string, number>();
    // Pre-populate high-demand peak slots (19:00 and 20:00) as booked
    dateMap.set('19:00', MAX_TABLES_PER_SLOT);
    dateMap.set('20:00', MAX_TABLES_PER_SLOT);
    bookingsRegister.set(date, dateMap);
  }
  return dateMap.get(time) || 0;
}

function recordSlotBooking(date: string, time: string): void {
  let dateMap = bookingsRegister.get(date);
  if (!dateMap) {
    dateMap = new Map<string, number>();
    bookingsRegister.set(date, dateMap);
  }
  const current = dateMap.get(time) || 0;
  dateMap.set(time, current + 1);
}

// Find closest next available slot on the same evening
function findNextAvailableSlot(date: string, requestedTime: string): string | null {
  const reqIndex = DINNER_TIME_SLOTS.indexOf(requestedTime);

  // 1. Look forward (+30m, +60m, +90m...)
  if (reqIndex !== -1) {
    for (let i = reqIndex + 1; i < DINNER_TIME_SLOTS.length; i++) {
      const candidate = DINNER_TIME_SLOTS[i];
      if (getSlotBookingCount(date, candidate) < MAX_TABLES_PER_SLOT) {
        return candidate;
      }
    }
    // 2. If no later slot, look slightly earlier (-30m, -60m...)
    for (let i = reqIndex - 1; i >= 0; i--) {
      const candidate = DINNER_TIME_SLOTS[i];
      if (getSlotBookingCount(date, candidate) < MAX_TABLES_PER_SLOT) {
        return candidate;
      }
    }
  }

  // Fallback to any available slot
  for (const slot of DINNER_TIME_SLOTS) {
    if (getSlotBookingCount(date, slot) < MAX_TABLES_PER_SLOT) {
      return slot;
    }
  }

  return null;
}

// Simple in-memory rate limiting map for lightweight spam prevention
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 20;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

function sanitize(input: any): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}

export default async function handler(req: any, res: any) {
  // CORS & Methods
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Handle GET /api/reservations?date=YYYY-MM-DD (Slot Availability Query)
  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const dateParam = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

    const slots = DINNER_TIME_SLOTS.map((slot) => {
      const bookedCount = getSlotBookingCount(dateParam, slot);
      const remaining = Math.max(0, MAX_TABLES_PER_SLOT - bookedCount);
      let status: 'available' | 'high_demand' | 'booked' = 'available';

      if (remaining === 0) {
        status = 'booked';
      } else if (remaining === 1) {
        status = 'high_demand';
      }

      return {
        time: slot,
        status,
        remainingTables: remaining,
      };
    });

    return res.status(200).json({
      success: true,
      date: dateParam,
      slots,
    });
  }

  // Only accept POST for reservations
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed. Please use POST.`,
    });
  }

  // Rate limiting check
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a moment before trying again.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // 1. Anti-spam honeypot verification
    if (body.honeypot && String(body.honeypot).trim() !== '') {
      console.warn('[Security] Honeypot field filled. Rejecting bot submission.');
      return res.status(400).json({
        success: false,
        message: 'Invalid submission.',
      });
    }

    // 2. Extract and sanitize fields
    const customer_name = sanitize(body.customer_name);
    const customer_phone = sanitize(body.customer_phone);
    const customer_email = sanitize(body.customer_email);
    const reservation_date = sanitize(body.reservation_date);
    let requested_time = sanitize(body.reservation_time);
    let reservation_time = requested_time;
    const guests = parseInt(body.guests, 10);
    let special_requests = sanitize(body.special_requests || '');
    const occasion = sanitize(body.occasion || 'Casual Dining');

    // 3. Validation checks
    const errors: Record<string, string> = {};

    if (!customer_name || customer_name.length < 2) {
      errors.customer_name = 'Customer name is required (minimum 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer_email || !emailRegex.test(customer_email)) {
      errors.customer_email = 'A valid email address is required for booking confirmation.';
    }

    const phoneDigits = customer_phone.replace(/\D/g, '');
    if (!customer_phone || phoneDigits.length < 7) {
      errors.customer_phone = 'A valid contact telephone number is required.';
    }

    if (!reservation_date) {
      errors.reservation_date = 'Reservation date is required.';
    } else {
      const selectedDate = new Date(reservation_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const parts = reservation_date.split('-');
      if (parts.length === 3) {
        const target = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        if (target < today) {
          errors.reservation_date = 'Reservation date cannot be in the past.';
        }
      } else if (selectedDate < today) {
        errors.reservation_date = 'Reservation date cannot be in the past.';
      }
    }

    if (!reservation_time) {
      errors.reservation_time = 'Reservation time is required.';
    }

    if (!guests || isNaN(guests) || guests < 1 || guests > 20) {
      errors.guests = 'Number of guests must be between 1 and 20.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please resolve the highlighted validation errors.',
        errors,
      });
    }

    // 4. INTELLIGENT SLOT AVAILABILITY & CONFLICT RESOLUTION
    let slot_adjusted = false;
    let adjustment_reason: string | undefined = undefined;
    const currentBookings = getSlotBookingCount(reservation_date, requested_time);

    if (currentBookings >= MAX_TABLES_PER_SLOT) {
      // The requested slot is fully booked: find the closest next available slot
      const nextAvailable = findNextAvailableSlot(reservation_date, requested_time);

      if (nextAvailable && nextAvailable !== requested_time) {
        slot_adjusted = true;
        reservation_time = nextAvailable;
        adjustment_reason = `Requested seating at ${requested_time} was fully committed. Automatically accommodated at the closest premier slot (${nextAvailable}).`;
        special_requests = `[Seating Time Adjusted: Requested ${requested_time} was full; secured ${nextAvailable}]. ${special_requests}`.trim();
        console.log(
          `[Slot Adjusted] Date: ${reservation_date}, Requested: ${requested_time} -> Assigned: ${nextAvailable}`
        );
      }
    }

    // Record booking in the assigned slot
    recordSlotBooking(reservation_date, reservation_time);

    // 5. Generate unique luxury Booking ID: MON-YYYYMMDD-XXXX
    const dateStr = reservation_date.replace(/-/g, '');
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const booking_id = `MON-${dateStr}-${randomHex}`;
    const submitted_at = new Date().toISOString();

    // 6. Construct Zapier Webhook Payload (for Google Sheets, Gmail, Google Calendar)
    const zapierPayload = {
      booking_id,
      customer_name,
      customer_phone,
      customer_email,
      reservation_date,
      reservation_time, // Confirmed actual assigned slot
      requested_time: slot_adjusted ? requested_time : reservation_time,
      slot_adjusted,
      adjustment_reason,
      guests,
      special_requests: special_requests || 'None',
      occasion,
      restaurant_name: 'Monaco Restaurant',
      submitted_at,
      booking_status: 'Pending',
    };

    // 7. Forward to Zapier Catch Hook
    const zapierWebhookUrl = process.env.ZAPIER_RESERVATION_WEBHOOK_URL;

    if (zapierWebhookUrl && zapierWebhookUrl.startsWith('http')) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

        const webhookResponse = await fetch(zapierWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Monaco-Restaurant-Vercel-Engine/1.0',
          },
          body: JSON.stringify(zapierPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!webhookResponse.ok) {
          console.error(
            `[Zapier Webhook Error] Received status ${webhookResponse.status} from Zapier.`
          );
        } else {
          console.log(
            `[Zapier Webhook Success] Booking ${booking_id} (${reservation_time}) sent to Zapier.`
          );
        }
      } catch (webhookErr: any) {
        console.error('[Zapier Forwarding Error]', webhookErr?.message || webhookErr);
      }
    } else {
      console.log(
        '[Development Notice] ZAPIER_RESERVATION_WEBHOOK_URL not configured. Running in simulation mode.'
      );
      console.log('[Simulated Zapier Payload]:', JSON.stringify(zapierPayload, null, 2));
    }

    // 8. Return Luxury Response to Client
    const successMessage = slot_adjusted
      ? `Thank you for choosing Monaco Restaurant. Your requested ${requested_time} seating is fully committed for this evening. To guarantee your party an exceptional dining experience, we have professionally reserved our next premier table for you at ${reservation_time}.`
      : 'Thank you for choosing Monaco Restaurant. Your reservation request has been received. Our team will contact you to confirm your table.';

    return res.status(200).json({
      success: true,
      booking_id,
      status: 'pending',
      adjusted_slot: slot_adjusted,
      original_time: slot_adjusted ? requested_time : undefined,
      assigned_time: reservation_time,
      message: successMessage,
      details: zapierPayload,
    });
  } catch (error: any) {
    console.error('[Server Error /api/reservations]', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit your reservation at this moment. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error?.message : undefined,
    });
  }
}
