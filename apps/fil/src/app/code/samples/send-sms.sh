curl https://api.fil.example/v1/messages \
  -H "Authorization: Bearer fil_test_xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+2376XXXXXXXX",
    "channel": "sms",
    "body": "Votre code Fil est 4821. Il expire dans 10 minutes."
  }'
