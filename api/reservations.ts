/**
 * Vercel Serverless Function: POST /api/reservations
 *
 * Secure server-side handler for Monaco Restaurant table reservations.
 * Validates inputs, sanitizes data, generates a unique booking ID, and
 * securely forwards the reservation payload to the Zapier Catch Hook.
 */

// Simple in-memory rate limiting map for lightweight spam prevention
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // Max 10 requests per minute per IP

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
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
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
    const reservation_time = sanitize(body.reservation_time);
    const guests = parseInt(body.guests, 10);
    const special_requests = sanitize(body.special_requests || '');
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

    // 4. Generate unique luxury Booking ID: MON-YYYYMMDD-XXXX
    const dateStr = reservation_date.replace(/-/g, '');
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const booking_id = `MON-${dateStr}-${randomHex}`;
    const submitted_at = new Date().toISOString();

    // 5. Construct Zapier Webhook Payload (exact specification from contract)
    const zapierPayload = {
      booking_id,
      customer_name,
      customer_phone,
      customer_email,
      reservation_date,
      reservation_time,
      guests,
      special_requests: special_requests || 'None',
      occasion,
      restaurant_name: 'Monaco Restaurant',
      submitted_at,
      booking_status: 'Pending',
    };

    // 6. Forward to Zapier Catch Hook
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
          // Still log and return friendly error or proceed with backup log
        } else {
          console.log(`[Zapier Webhook Success] Booking ${booking_id} successfully sent to Zapier.`);
        }
      } catch (webhookErr: any) {
        console.error('[Zapier Forwarding Error]', webhookErr?.message || webhookErr);
        // We log the error securely on server side without leaking internal credentials to customer
      }
    } else {
      console.log(
        '[Development Notice] ZAPIER_RESERVATION_WEBHOOK_URL not configured. Running in simulation mode.'
      );
      console.log('[Simulated Zapier Payload]:', JSON.stringify(zapierPayload, null, 2));
    }

    // 7. Return Luxury Success Response to Client
    return res.status(200).json({
      success: true,
      booking_id,
      status: 'pending',
      message:
        'Thank you for choosing Monaco Restaurant. Your reservation request has been received. Our team will contact you to confirm your table.',
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
