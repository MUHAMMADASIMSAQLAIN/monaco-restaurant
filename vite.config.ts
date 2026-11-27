import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

const DINNER_TIME_SLOTS = [
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
const MAX_TABLES_PER_SLOT = 2;
const devBookingsRegister = new Map<string, Map<string, number>>();

function getDevSlotCount(date: string, time: string): number {
  let dateMap = devBookingsRegister.get(date);
  if (!dateMap) {
    dateMap = new Map<string, number>();
    dateMap.set('19:00', MAX_TABLES_PER_SLOT);
    dateMap.set('20:00', MAX_TABLES_PER_SLOT);
    devBookingsRegister.set(date, dateMap);
  }
  return dateMap.get(time) || 0;
}

function recordDevBooking(date: string, time: string): void {
  let dateMap = devBookingsRegister.get(date);
  if (!dateMap) {
    dateMap = new Map<string, number>();
    devBookingsRegister.set(date, dateMap);
  }
  const cur = dateMap.get(time) || 0;
  dateMap.set(time, cur + 1);
}

function findDevNextAvailable(date: string, reqTime: string): string | null {
  const reqIdx = DINNER_TIME_SLOTS.indexOf(reqTime);
  if (reqIdx !== -1) {
    for (let i = reqIdx + 1; i < DINNER_TIME_SLOTS.length; i++) {
      if (getDevSlotCount(date, DINNER_TIME_SLOTS[i]) < MAX_TABLES_PER_SLOT) {
        return DINNER_TIME_SLOTS[i];
      }
    }
    for (let i = reqIdx - 1; i >= 0; i--) {
      if (getDevSlotCount(date, DINNER_TIME_SLOTS[i]) < MAX_TABLES_PER_SLOT) {
        return DINNER_TIME_SLOTS[i];
      }
    }
  }
  for (const slot of DINNER_TIME_SLOTS) {
    if (getDevSlotCount(date, slot) < MAX_TABLES_PER_SLOT) return slot;
  }
  return null;
}

// Vite Dev Server Middleware for local testing of /api/reservations
function reservationApiDevPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'reservation-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = new URL(req.url || '', 'http://localhost');

        if (parsedUrl.pathname === '/api/reservations' && req.method === 'GET') {
          const dateParam = parsedUrl.searchParams.get('date') || new Date().toISOString().split('T')[0];
          const slots = DINNER_TIME_SLOTS.map((slot) => {
            const booked = getDevSlotCount(dateParam, slot);
            const remaining = Math.max(0, MAX_TABLES_PER_SLOT - booked);
            let status = 'available';
            if (remaining === 0) status = 'booked';
            else if (remaining === 1) status = 'high_demand';
            return { time: slot, status, remainingTables: remaining };
          });
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, date: dateParam, slots }));
          return;
        }

        if (parsedUrl.pathname === '/api/reservations' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });

          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');

              // Honeypot check
              if (body.honeypot && String(body.honeypot).trim() !== '') {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, message: 'Invalid submission' }));
                return;
              }

              const {
                customer_name,
                customer_phone,
                customer_email,
                reservation_date,
                guests,
                occasion,
              } = body;
              let requested_time = (body.reservation_time || '').trim();
              let reservation_time = requested_time;
              let special_requests = (body.special_requests || '').trim();

              // Validate
              const errors: Record<string, string> = {};
              if (!customer_name || customer_name.trim().length < 2) {
                errors.customer_name = 'Name must be at least 2 characters.';
              }
              if (!customer_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
                errors.customer_email = 'Valid email is required.';
              }
              if (!customer_phone || customer_phone.replace(/\D/g, '').length < 7) {
                errors.customer_phone = 'Valid phone number is required.';
              }
              if (!reservation_date) {
                errors.reservation_date = 'Date is required.';
              }
              if (!reservation_time) {
                errors.reservation_time = 'Time is required.';
              }

              if (Object.keys(errors).length > 0) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: false,
                    message: 'Validation failed',
                    errors,
                  })
                );
                return;
              }

              // Slot Conflict Check
              let slot_adjusted = false;
              let adjustment_reason: string | undefined = undefined;
              const currentBooked = getDevSlotCount(reservation_date, requested_time);

              if (currentBooked >= MAX_TABLES_PER_SLOT) {
                const nextAvail = findDevNextAvailable(reservation_date, requested_time);
                if (nextAvail && nextAvail !== requested_time) {
                  slot_adjusted = true;
                  reservation_time = nextAvail;
                  adjustment_reason = `Requested seating at ${requested_time} was fully committed. Automatically accommodated at the closest premier slot (${nextAvail}).`;
                  special_requests = `[Slot Adjusted from ${requested_time} to ${nextAvail}]. ${special_requests}`.trim();
                  console.log(`[Dev Slot Adjusted] ${requested_time} -> ${nextAvail}`);
                }
              }

              recordDevBooking(reservation_date, reservation_time);

              // Generate booking ID: MON-YYYYMMDD-XXXX
              const datePart = (reservation_date || '').replace(/-/g, '');
              const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
              const booking_id = `MON-${datePart}-${randomHex}`;
              const submitted_at = new Date().toISOString();

              const zapierPayload = {
                booking_id,
                customer_name: (customer_name || '').trim(),
                customer_phone: (customer_phone || '').trim(),
                customer_email: (customer_email || '').trim(),
                reservation_date,
                reservation_time,
                requested_time: slot_adjusted ? requested_time : reservation_time,
                slot_adjusted,
                adjustment_reason,
                guests: parseInt(guests, 10) || 1,
                special_requests: special_requests || 'None',
                occasion: occasion || 'Casual Dining',
                restaurant_name: 'Monaco Restaurant',
                submitted_at,
                booking_status: 'Pending',
              };

              // Forward to Zapier from env file or process.env
              const zapierUrl =
                env.ZAPIER_RESERVATION_WEBHOOK_URL || process.env.ZAPIER_RESERVATION_WEBHOOK_URL;

              if (zapierUrl && zapierUrl.startsWith('http')) {
                try {
                  const zRes = await fetch(zapierUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(zapierPayload),
                  });
                  console.log(`[Vite Dev] Successfully dispatched to Zapier: HTTP ${zRes.status}`);
                } catch (zErr) {
                  console.error('[Vite Dev] Error dispatching to Zapier:', zErr);
                }
              } else {
                console.log('\n[Vite Dev] Reservation Received (Simulation Mode):');
                console.log(JSON.stringify(zapierPayload, null, 2));
              }

              const msg = slot_adjusted
                ? `Thank you for choosing Monaco Restaurant. Your requested ${requested_time} seating was fully committed for this evening. To guarantee your party an exceptional dining experience, we have professionally reserved our next premier table for you at ${reservation_time}.`
                : 'Thank you for choosing Monaco Restaurant. Your reservation request has been received. Our team will contact you to confirm your table.';

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  booking_id,
                  status: 'pending',
                  adjusted_slot: slot_adjusted,
                  original_time: slot_adjusted ? requested_time : undefined,
                  assigned_time: reservation_time,
                  message: msg,
                  details: zapierPayload,
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  message: 'Server error processing reservation',
                  error: err?.message,
                })
              );
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), reservationApiDevPlugin(env)],
    server: {
      port: 5173,
      host: true,
    },
  };
});
