package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

const (
	CampaignStatusActive = "active"
	CampaignStatusClosed = "closed"
)

// Fixed category tags — must match the values the frontend UI actually
// sends (new-campaign form + campaign category filter), not the stale
// README list.
var ValidCategories = map[string]bool{
	"education":       true,
	"healthcare":      true,
	"environment":     true,
	"disaster-relief": true,
}

type Campaign struct {
	ID               uuid.UUID `gorm:"type:uuid;primaryKey"`
	CreatorID        uuid.UUID `gorm:"type:uuid;not null;index"`
	Creator          User      `gorm:"foreignKey:CreatorID"`
	Title            string    `gorm:"not null"`
	Description      string    `gorm:"not null"`
	HeaderImage      string    `gorm:"not null"`
	Story            string    `gorm:"type:text;not null"`
	Goal             float64   `gorm:"type:numeric(14,2);not null"`
	Deadline         *time.Time
	Category         pq.StringArray `gorm:"type:text[]"`
	SocialMediaLinks pq.StringArray `gorm:"type:text[]"`
	Status           string         `gorm:"not null;default:active"`
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

func (c *Campaign) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	if c.Status == "" {
		c.Status = CampaignStatusActive
	}
	return nil
}
