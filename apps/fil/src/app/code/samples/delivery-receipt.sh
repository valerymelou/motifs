# Fil posts a receipt to your webhook each time a message changes status.
# Try your handler locally with the receipt Fil would send:
curl http://localhost:3000/webhooks/fil \
  -H "Content-Type: application/json" \
  -d '{
    "id": "msg_01",
    "status": "delivered",
    "channel": "sms",
    "to": "+2376XXXXXXXX",
    "parts": 1
  }'
