package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

// Outside the 24-hour window, WhatsApp only delivers approved templates.
func main() {
	body, _ := json.Marshal(map[string]any{
		"to":      "+2376XXXXXXXX",
		"channel": "whatsapp",
		"template": map[string]any{
			"name": "otp", "language": "fr", "variables": []string{"4821"},
		},
		"fallback": "sms", // sent as an SMS if WhatsApp can't deliver
	})
	request, _ := http.NewRequest("POST", "https://api.fil.example/v1/messages", bytes.NewReader(body))
	request.Header.Set("Authorization", "Bearer "+os.Getenv("FIL_KEY"))
	request.Header.Set("Content-Type", "application/json")

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()

	var message struct{ Status string }
	json.NewDecoder(response.Body).Decode(&message)
	fmt.Println(message.Status) // queued
}
