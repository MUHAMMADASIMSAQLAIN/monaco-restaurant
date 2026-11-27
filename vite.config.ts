import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

// Vite Dev Server Middleware for local testing of /api/reservations
function reservationApiDevPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'reservation-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/reservations' && req.method === 'POST') {
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
                reservation_time,
                guests,
                special_requests,
                occasion,
              } = body;

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
                guests: parseInt(guests, 10) || 1,
                special_requests: (special_requests || '').trim() || 'None',
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

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  booking_id,
                  status: 'pending',
                  message:
                    'Thank you for choosing Monaco Restaurant. Your reservation request has been received. Our team will contact you to confirm your table.',
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
