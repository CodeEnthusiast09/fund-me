package campaign

import (
	"time"

	"github.com/google/uuid"
)

// Request DTOs: snake_case json tags (see auth/dto.go for why).
type CreateCampaignRequest struct {
	Title       string   `json:"title" validate:"required"`
	Description string   `json:"description" validate:"required"`
	HeaderImage string   `json:"header_image" validate:"required,url"`
	Story       string   `json:"story" validate:"required"`
	Goal        float64  `json:"goal" validate:"required,gt=0"`
	Deadline    *string  `json:"deadline"`
	Category    []string `json:"category" validate:"dive,oneof=education healthcare environment disaster-relief"`
}

type UpdateCampaignRequest struct {
	Title       *string  `json:"title"`
	Description *string  `json:"description"`
	HeaderImage *string  `json:"header_image"`
	Story       *string  `json:"story"`
	Goal        *float64 `json:"goal"`
	Deadline    *string  `json:"deadline"`
	Category    []string `json:"category" validate:"dive,oneof=education healthcare environment disaster-relief"`
}

// Response DTOs: camelCase json tags (see auth/dto.go for why).
type CreatorResponse struct {
	ID        uuid.UUID `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
}

type CampaignResponse struct {
	ID               uuid.UUID       `json:"id"`
	Creator          CreatorResponse `json:"creator"`
	Title            string          `json:"title"`
	Description      string          `json:"description"`
	HeaderImage      string          `json:"headerImage"`
	Story            string          `json:"story"`
	Goal             float64         `json:"goal"`
	Deadline         *time.Time      `json:"deadline"`
	Category         []string        `json:"category"`
	SocialMediaLinks []string        `json:"socialMediaLinks"`
	Status           string          `json:"status"`
	AmountRaised     float64         `json:"amountRaised"`
	DonorCount       int64           `json:"donorCount"`
	CreatedAt        time.Time       `json:"createdAt"`
}
