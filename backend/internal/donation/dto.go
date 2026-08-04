package donation

import (
	"time"

	"github.com/google/uuid"
)

// Request DTO field names deliberately mirror the frontend's existing
// donate-form field names (email_address, checkout_amount, etc. — from
// payoutValidationSchema) rather than being renamed to plain email/amount,
// so the existing donate form needs zero field-name changes. campaign_id
// and transaction_reference are the only new fields the frontend adds on
// top of the form's existing values.
type CreateDonationRequest struct {
	CampaignID           uuid.UUID `json:"campaign_id" validate:"required"`
	FirstName            string    `json:"first_name" validate:"required"`
	LastName             string    `json:"last_name" validate:"required"`
	EmailAddress         string    `json:"email_address" validate:"required,email"`
	PhoneNumber          string    `json:"phone_number" validate:"required"`
	CurrencyCode         string    `json:"currency_code" validate:"required"`
	CheckoutAmount       float64   `json:"checkout_amount" validate:"required,gt=0"`
	TransactionReference string    `json:"transaction_reference" validate:"required"`
}

// Response DTOs: camelCase json tags (see auth/dto.go for why).
type DonationResponse struct {
	ID           uuid.UUID `json:"id"`
	CampaignID   uuid.UUID `json:"campaignId"`
	FirstName    string    `json:"firstName"`
	LastName     string    `json:"lastName"`
	CurrencyCode string    `json:"currencyCode"`
	Amount       float64   `json:"amount"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"createdAt"`
}

type CampaignSummary struct {
	ID          uuid.UUID `json:"id"`
	Title       string    `json:"title"`
	HeaderImage string    `json:"headerImage"`
}

type MyDonationResponse struct {
	DonationResponse
	Campaign CampaignSummary `json:"campaign"`
}
