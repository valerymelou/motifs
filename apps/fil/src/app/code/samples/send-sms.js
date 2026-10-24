const response = await fetch('https://api.fil.example/v1/messages', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.FIL_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: '+2376XXXXXXXX',
    channel: 'sms',
    body: 'Votre code Fil est 4821. Il expire dans 10 minutes.',
  }),
});

const message = await response.json();
console.log(message.id, message.status); // msg_… queued
