import json
from http.server import BaseHTTPRequestHandler, HTTPServer


# Fil posts a receipt here each time a message changes status.
class Receipts(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/webhooks/fil":
            length = int(self.headers["Content-Length"])
            receipt = json.loads(self.rfile.read(length))
            print(receipt["id"], receipt["status"])  # msg_01 delivered
        self.send_response(204)
        self.end_headers()


HTTPServer(("", 3000), Receipts).serve_forever()
