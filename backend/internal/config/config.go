package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	Port string
	Env  string

	DatabaseURL string

	JWTSecret string
	JWTExpiry time.Duration

	CORSAllowedOrigins []string

	RateLimitAuthRequests int
	RateLimitAuthWindow   time.Duration

	CloudinaryCloudName    string
	CloudinaryAPIKey       string
	CloudinaryAPISecret    string
	CloudinaryUploadFolder string
	MaxUploadSizeMB        int64

	PayazaSecretKey  string
	PayazaAPIBaseURL string
}

func Load() (*Config, error) {
	cfg := &Config{
		Port:                   getEnv("PORT", "8080"),
		Env:                    getEnv("ENV", "development"),
		CloudinaryUploadFolder: getEnv("CLOUDINARY_UPLOAD_FOLDER", "fundlynest/campaigns"),
	}

	required := map[string]*string{
		"DATABASE_URL":          &cfg.DatabaseURL,
		"JWT_SECRET":            &cfg.JWTSecret,
		"CLOUDINARY_CLOUD_NAME": &cfg.CloudinaryCloudName,
		"CLOUDINARY_API_KEY":    &cfg.CloudinaryAPIKey,
		"CLOUDINARY_API_SECRET": &cfg.CloudinaryAPISecret,
		"PAYAZA_SECRET_KEY":     &cfg.PayazaSecretKey,
		"PAYAZA_API_BASE_URL":   &cfg.PayazaAPIBaseURL,
		"CORS_ALLOWED_ORIGINS":  nil, // parsed separately below
	}

	var missing []string
	for key, target := range required {
		val := os.Getenv(key)
		if val == "" {
			missing = append(missing, key)
			continue
		}
		if target != nil {
			*target = val
		}
	}
	if len(missing) > 0 {
		return nil, fmt.Errorf("missing required environment variables: %s", strings.Join(missing, ", "))
	}

	cfg.CORSAllowedOrigins = strings.Split(os.Getenv("CORS_ALLOWED_ORIGINS"), ",")

	jwtExpiry, err := time.ParseDuration(getEnv("JWT_EXPIRY", "24h"))
	if err != nil {
		return nil, fmt.Errorf("invalid JWT_EXPIRY: %w", err)
	}
	cfg.JWTExpiry = jwtExpiry

	rateLimitRequests, err := strconv.Atoi(getEnv("RATE_LIMIT_AUTH_REQUESTS", "10"))
	if err != nil {
		return nil, fmt.Errorf("invalid RATE_LIMIT_AUTH_REQUESTS: %w", err)
	}
	cfg.RateLimitAuthRequests = rateLimitRequests

	rateLimitWindow, err := time.ParseDuration(getEnv("RATE_LIMIT_AUTH_WINDOW", "1m"))
	if err != nil {
		return nil, fmt.Errorf("invalid RATE_LIMIT_AUTH_WINDOW: %w", err)
	}
	cfg.RateLimitAuthWindow = rateLimitWindow

	maxUploadSizeMB, err := strconv.ParseInt(getEnv("MAX_UPLOAD_SIZE_MB", "5"), 10, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid MAX_UPLOAD_SIZE_MB: %w", err)
	}
	cfg.MaxUploadSizeMB = maxUploadSizeMB

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
