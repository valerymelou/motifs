package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func main() {
	body, _ := json.Marshal(map[string]string{
		"to":      "+2376XXXXXXXX",
		"channel": "sms",
		"body":    "Votre code Fil est 4821. Il expire dans 10 minutes.",
	})
	request, _ := http.NewRequest("POST", "https://api.fil.example/v1/messages", bytes.NewReader(body))
	request.Header.Set("Authorization", "Bearer "+os.Getenv("FIL_KEY"))
	request.Header.Set("Content-Type", "application/json")

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()

	var message struct{ ID, Status string }
	json.NewDecoder(response.Body).Decode(&message)
	fmt.Println(message.ID, message.Status) // msg_… queued
}
