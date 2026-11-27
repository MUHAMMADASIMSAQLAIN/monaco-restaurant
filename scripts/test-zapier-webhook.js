/**
 * Monaco Restaurant — Zapier Catch Hook Tester Script
 *
 * Usage:
 *   node scripts/test-zapier-webhook.js <ZAPIER_CATCH_HOOK_URL>
 *
 * Example:
 *   node scripts/test-zapier-webhook.js https://hooks.zapier.com/hooks/catch/123456/abcdef/
 */

const webhookUrl = process.argv[2] || process.env.ZAPIER_RESERVATION_WEBHOOK_URL;

if (!webhookUrl || !webhookUrl.startsWith('http')) {
  console.error('\n❌ Error: Please provide a valid Zapier Webhook Catch URL.');
  console.log('Usage: node scripts/test-zapier-webhook.js https://hooks.zapier.com/hooks/catch/XXXXXX/YYYYYY/\n');
  process.exit(1);
}

const mockBookingId = `MON-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-TEST`;

const samplePayload = {
  booking_id: mockBookingId,
  customer_name: 'Lady Eleanor Vance',
  customer_phone: '+377 98 06 20 00',
  customer_email: 'eleanor.vance@example.com',
  reservation_date: '2026-12-24',
  reservation_time: '20:00',
  guests: 4,
  special_requests: 'Window alcove table, celebrating anniversary with champagne',
  occasion: 'Wedding Anniversary',
  restaurant_name: 'Monaco Restaurant',
  submitted_at: new Date().toISOString(),
  booking_status: 'Pending',
};

console.log('\n🚀 Dispatching Test Reservation to Zapier Catch Hook...');
console.log('Target URL:', webhookUrl);
console.log('Payload Data:\n', JSON.stringify(samplePayload, null, 2));

fetch(webhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Monaco-Restaurant-Tester/1.0',
  },
  body: JSON.stringify(samplePayload),
})
  .then(async (res) => {
    const text = await res.text();
    console.log(`\n✅ Response Status: ${res.status} ${res.statusText}`);
    console.log('Response Body:', text);
    console.log('\n🎉 Zapier Catch Hook triggered successfully! Now check your Zap history in zapier.com.\n');
  })
  .catch((err) => {
    console.error('\n❌ Failed to dispatch webhook to Zapier:', err.message);
  });
