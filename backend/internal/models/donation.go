package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

const (
	DonationStatusPending   = "pending"
	DonationStatusConfirmed = "confirmed"
	DonationStatusFailed    = "failed"
)

type Donation struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey"`
	CampaignID   uuid.UUID `gorm:"type:uuid;not null;index"`
	Campaign     Campaign  `gorm:"foreignKey:CampaignID"`
	DonorID      uuid.UUID `gorm:"type:uuid;not null;index"`
	Donor        User      `gorm:"foreignKey:DonorID"`
	FirstName    string    `gorm:"not null"`
	LastName     string    `gorm:"not null"`
	Email        string    `gorm:"not null"`
	PhoneNumber  string    `gorm:"not null"`
	CurrencyCode string    `gorm:"not null"`
	Amount       float64   `gorm:"type:numeric(14,2);not null"`
	Status       string    `gorm:"not null;default:pending;index"`

	PayazaTransactionReference string         `gorm:"uniqueIndex;not null"`
	PayazaResponse             datatypes.JSON `gorm:"type:jsonb"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (d *Donation) BeforeCreate(tx *gorm.DB) error {
	if d.ID == uuid.Nil {
		d.ID = uuid.New()
	}
	if d.Status == "" {
		d.Status = DonationStatusPending
	}
	return nil
}
