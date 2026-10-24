# Outside the 24-hour window, WhatsApp only delivers approved templates.
curl https://api.fil.example/v1/messages \
  -H "Authorization: Bearer fil_test_xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+2376XXXXXXXX",
    "channel": "whatsapp",
    "template": { "name": "otp", "language": "fr", "variables": ["4821"] },
    "fallback": "sms"
  }'
