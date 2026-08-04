package middleware

import (
	"net/http"
	"time"

	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
)

// ClientIP resolves the real client IP from X-Forwarded-For. This backend
// is expected to run behind a reverse proxy (Railway/Render), so
// r.RemoteAddr alone would just be the proxy's address — every client
// would land in the same rate-limit bucket.
func ClientIP(next http.Handler) http.Handler {
	return chimw.ClientIPFromXFF()(next)
}

func RateLimit(requests int, window time.Duration) func(http.Handler) http.Handler {
	return httprate.LimitBy(requests, window, func(r *http.Request) (string, error) {
		ip := chimw.GetClientIP(r.Context())
		if ip == "" {
			ip = r.RemoteAddr
		}
		return httprate.CanonicalizeIP(ip), nil
	})
}
