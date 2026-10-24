package main

import (
	"encoding/json"
	"log"
	"net/http"
)

// Fil posts a receipt here each time a message changes status.
func main() {
	http.HandleFunc("POST /webhooks/fil", func(w http.ResponseWriter, r *http.Request) {
		var receipt struct{ ID, Status string }
		json.NewDecoder(r.Body).Decode(&receipt)
		log.Println(receipt.ID, receipt.Status) // msg_01 delivered
		w.WriteHeader(http.StatusNoContent)
	})
	log.Fatal(http.ListenAndServe(":3000", nil))
}
