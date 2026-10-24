import { createServer } from 'node:http';

// Fil posts a receipt here each time a message changes status.
createServer(async (request, response) => {
  if (request.method === 'POST' && request.url === '/webhooks/fil') {
    let body = '';
    for await (const chunk of request) body += chunk;
    const receipt = JSON.parse(body);
    console.log(receipt.id, receipt.status); // msg_01 delivered
  }
  response.writeHead(204).end();
}).listen(3000);
