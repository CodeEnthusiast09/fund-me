package auth

import (
	"time"

	"github.com/google/uuid"
)

// Request DTOs use snake_case json tags: the frontend gateway
// unconditionally converts outgoing camelCase request bodies to
// snake_case before sending, so this is what actually arrives on the wire.
type RegisterRequest struct {
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
	Gender    string `json:"gender"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=8"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// Response DTOs use camelCase json tags, matching the CLAUDE.md Go
// envelope convention. The frontend's snake_case->camelCase response
// converter is a no-op on keys that are already camelCase.
type UserResponse struct {
	ID        uuid.UUID `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Gender    string    `json:"gender"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
}

type LoginResponse struct {
	AccessToken string       `json:"accessToken"`
	ExpiresIn   int64        `json:"expiresIn"`
	User        UserResponse `json:"user"`
}
