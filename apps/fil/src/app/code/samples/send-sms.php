<?php
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
        'channel' => 'sms',
        'body' => 'Votre code Fil est 4821. Il expire dans 10 minutes.',
    ]),
]);

$message = json_decode(curl_exec($request), true);
echo $message['id'], ' ', $message['status']; // msg_… queued
