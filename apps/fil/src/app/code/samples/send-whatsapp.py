import json
import os
from urllib.request import Request, urlopen

# Outside the 24-hour window, WhatsApp only delivers approved templates.
request = Request(
    "https://api.fil.example/v1/messages",
    data=json.dumps({
        "to": "+2376XXXXXXXX",
        "channel": "whatsapp",
        "template": {"name": "otp", "language": "fr", "variables": ["4821"]},
        "fallback": "sms",  # sent as an SMS if WhatsApp can't deliver
    }).encode(),
    headers={
        "Authorization": f"Bearer {os.environ['FIL_KEY']}",
        "Content-Type": "application/json",
    },
)

with urlopen(request) as response:
    print(json.load(response)["status"])  # queued
