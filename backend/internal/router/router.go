package router

import (
	"net/http"

	"github.com/CodeEnthusiast09/fund-me-backend/internal/auth"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/campaign"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/config"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/donation"
	appmw "github.com/CodeEnthusiast09/fund-me-backend/internal/middleware"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/response"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/upload"
	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
)

type Handlers struct {
	Auth     *auth.Handler
	Campaign *campaign.Handler
	Donation *donation.Handler
	Upload   *upload.Handler
}

func New(cfg *config.Config, h *Handlers) http.Handler {
	r := chi.NewRouter()

	r.Use(chimw.Recoverer)
	r.Use(chimw.Logger)
	r.Use(appmw.ClientIP)
	r.Use(appmw.CORS(cfg.CORSAllowedOrigins))

	r.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		response.Success(w, http.StatusOK, "ok", nil)
	})

	authRequired := appmw.Auth(cfg.JWTSecret)
	authRateLimit := appmw.RateLimit(cfg.RateLimitAuthRequests, cfg.RateLimitAuthWindow)

	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Group(func(r chi.Router) {
				r.Use(authRateLimit)
				r.Post("/register", h.Auth.Register)
				r.Post("/login", h.Auth.Login)
			})
			r.With(authRequired).Get("/me", h.Auth.Me)
		})

		r.Route("/campaigns", func(r chi.Router) {
			r.Get("/", h.Campaign.List)
			r.Get("/{id}", h.Campaign.Get)
			r.Get("/{id}/donations", h.Donation.ListForCampaign)

			r.Group(func(r chi.Router) {
				r.Use(authRequired)
				r.Post("/", h.Campaign.Create)
				r.Patch("/{id}", h.Campaign.Update)
				r.Delete("/{id}", h.Campaign.Delete)
			})
		})

		r.Route("/donations", func(r chi.Router) {
			r.Use(authRequired)
			r.Post("/", h.Donation.Create)
			r.Get("/me", h.Donation.ListMine)
		})

		r.Route("/uploads", func(r chi.Router) {
			r.Use(authRequired)
			r.Post("/image", h.Upload.Image)
		})
	})

	return r
}
