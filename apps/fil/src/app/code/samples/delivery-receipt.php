<?php
// Fil posts a receipt here each time a message changes status.
// Serve this file at /webhooks/fil.
$receipt = json_decode(file_get_contents('php://input'), true);

error_log($receipt['id'] . ' ' . $receipt['status']); // msg_01 delivered

http_response_code(204);
