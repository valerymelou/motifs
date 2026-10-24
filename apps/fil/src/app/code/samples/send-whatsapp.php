<?php
// Outside the 24-hour window, WhatsApp only delivers approved templates.
$request = curl_init('https://api.fil.example/v1/messages');
curl_setopt_array($request, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . getenv('FIL_KEY'),
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'to' => '+2376XXXXXXXX',
        'channel' => 'whatsapp',
        'template' => ['name' => 'otp', 'language' => 'fr', 'variables' => ['4821']],
        'fallback' => 'sms', // sent as an SMS if WhatsApp can't deliver
    ]),
]);

echo json_decode(curl_exec($request), true)['status']; // queued
