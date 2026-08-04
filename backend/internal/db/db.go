package db

import (
	"fmt"

	"github.com/CodeEnthusiast09/fund-me-backend/internal/config"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(cfg *config.Config) (*gorm.DB, error) {
	logLevel := logger.Silent
	if cfg.Env == "development" {
		logLevel = logger.Warn
	}

	database, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	})
	if err != nil {
		return nil, fmt.Errorf("connect to database: %w", err)
	}

	return database, nil
}

func AutoMigrate(database *gorm.DB) error {
	return database.AutoMigrate(
		&models.User{},
		&models.Campaign{},
		&models.Donation{},
	)
}
