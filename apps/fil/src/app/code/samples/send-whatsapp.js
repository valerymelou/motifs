// Outside the 24-hour window, WhatsApp only delivers approved templates.
const response = await fetch('https://api.fil.example/v1/messages', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.FIL_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: '+2376XXXXXXXX',
    channel: 'whatsapp',
    template: { name: 'otp', language: 'fr', variables: ['4821'] },
    fallback: 'sms', // sent as an SMS if WhatsApp can't deliver
  }),
});

console.log((await response.json()).status); // queued
