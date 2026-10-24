import json
import os
from urllib.request import Request, urlopen

request = Request(
    "https://api.fil.example/v1/messages",
    data=json.dumps({
        "to": "+2376XXXXXXXX",
        "channel": "sms",
        "body": "Votre code Fil est 4821. Il expire dans 10 minutes.",
    }).encode(),
    headers={
        "Authorization": f"Bearer {os.environ['FIL_KEY']}",
        "Content-Type": "application/json",
    },
)

with urlopen(request) as response:
    message = json.load(response)
    print(message["id"], message["status"])  # msg_… queued
