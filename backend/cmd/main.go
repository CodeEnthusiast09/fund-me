package main

import (
	"log"
	"net/http"

	"github.com/CodeEnthusiast09/fund-me-backend/internal/auth"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/campaign"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/config"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/db"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/donation"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/payaza"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/router"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/upload"
	"github.com/joho/godotenv"
)

func main() {
	// Local dev convenience only — in production, env vars are provided by
	// the host (Railway/Render/etc.), and this is a no-op if .env is absent.
	_ = godotenv.Load()

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	database, err := db.Connect(cfg)
	if err != nil {
		log.Fatalf("database: %v", err)
	}

	if err := db.AutoMigrate(database); err != nil {
		log.Fatalf("migrate: %v", err)
	}

	uploadService, err := upload.NewService(cfg)
	if err != nil {
		log.Fatalf("upload service: %v", err)
	}

	payazaClient := payaza.NewClient(cfg)

	handlers := &router.Handlers{
		Auth:     auth.NewHandler(auth.NewService(database, cfg.JWTSecret, cfg.JWTExpiry)),
		Campaign: campaign.NewHandler(campaign.NewService(database)),
		Donation: donation.NewHandler(donation.NewService(database, payazaClient)),
		Upload:   upload.NewHandler(uploadService, cfg.MaxUploadSizeMB),
	}

	r := router.New(cfg, handlers)

	log.Printf("fund-me-backend listening on :%s (env=%s)", cfg.Port, cfg.Env)
	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Fatalf("server: %v", err)
	}
}
