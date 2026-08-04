package response

import (
	"encoding/json"
	"net/http"
)

type ApiResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
	Data    any    `json:"data,omitempty"`
}

type PaginationMeta struct {
	Total      int64 `json:"total"`
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	TotalPages int   `json:"totalPages"`
}

type PaginatedResponse struct {
	Success bool           `json:"success"`
	Message string         `json:"message"`
	Data    any            `json:"data,omitempty"`
	Meta    PaginationMeta `json:"meta"`
}

func JSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func Success(w http.ResponseWriter, status int, message string, data any) {
	JSON(w, status, ApiResponse{Success: true, Message: message, Data: data})
}

func Paginated(w http.ResponseWriter, status int, message string, data any, meta PaginationMeta) {
	JSON(w, status, PaginatedResponse{Success: true, Message: message, Data: data, Meta: meta})
}

func Fail(w http.ResponseWriter, status int, message string, errType string) {
	JSON(w, status, ApiResponse{Success: false, Message: message, Error: errType})
}

func FailMulti(w http.ResponseWriter, status int, messages []string, errType string) {
	JSON(w, status, struct {
		Success bool     `json:"success"`
		Message []string `json:"message"`
		Error   string   `json:"error,omitempty"`
	}{Success: false, Message: messages, Error: errType})
}
