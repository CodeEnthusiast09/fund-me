package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/CodeEnthusiast09/fund-me-backend/internal/response"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type contextKey string

const userIDContextKey contextKey = "userID"

type Claims struct {
	UserID uuid.UUID `json:"sub"`
	jwt.RegisteredClaims
}

// Auth requires a valid JWT bearer token and injects the authenticated
// user's ID into the request context. Ownership checks (e.g. "is this
// user allowed to edit this campaign") are resource-specific and belong
// in the service layer, not here — this middleware only answers "who is
// this request from", not "are they allowed to do X".
func Auth(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")
			if header == "" || !strings.HasPrefix(header, "Bearer ") {
				response.Fail(w, http.StatusUnauthorized, "Missing or invalid authorization header", "Unauthorized")
				return
			}

			tokenString := strings.TrimPrefix(header, "Bearer ")

			claims := &Claims{}
			token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (any, error) {
				return []byte(secret), nil
			})
			if err != nil || !token.Valid {
				response.Fail(w, http.StatusUnauthorized, "Invalid or expired token", "Unauthorized")
				return
			}

			ctx := context.WithValue(r.Context(), userIDContextKey, claims.UserID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func UserIDFromContext(ctx context.Context) (uuid.UUID, bool) {
	id, ok := ctx.Value(userIDContextKey).(uuid.UUID)
	return id, ok
}
