package auth

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/CodeEnthusiast09/fund-me-backend/internal/middleware"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/models"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/response"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/validate"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Fail(w, http.StatusBadRequest, "Invalid request body", "BadRequest")
		return
	}
	if err := validate.Struct(req); err != nil {
		response.Fail(w, http.StatusBadRequest, validate.Message(err), "ValidationError")
		return
	}

	user, err := h.service.Register(r.Context(), req)
	if err != nil {
		if errors.Is(err, ErrEmailTaken) {
			response.Fail(w, http.StatusConflict, "Email is already registered", "Conflict")
			return
		}
		response.Fail(w, http.StatusInternalServerError, "Could not create account", "ServerError")
		return
	}

	response.Success(w, http.StatusCreated, "Account created", toUserResponse(user))
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Fail(w, http.StatusBadRequest, "Invalid request body", "BadRequest")
		return
	}
	if err := validate.Struct(req); err != nil {
		response.Fail(w, http.StatusBadRequest, validate.Message(err), "ValidationError")
		return
	}

	user, token, expiresAt, err := h.service.Login(r.Context(), req)
	if err != nil {
		if errors.Is(err, ErrInvalidCredentials) {
			response.Fail(w, http.StatusUnauthorized, "Invalid email or password", "Unauthorized")
			return
		}
		response.Fail(w, http.StatusInternalServerError, "Could not log in", "ServerError")
		return
	}

	response.Success(w, http.StatusOK, "Logged in", LoginResponse{
		AccessToken: token,
		ExpiresIn:   int64(time.Until(expiresAt).Seconds()),
		User:        toUserResponse(user),
	})
}

func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		response.Fail(w, http.StatusUnauthorized, "Not authenticated", "Unauthorized")
		return
	}

	user, err := h.service.Me(r.Context(), userID)
	if err != nil {
		response.Fail(w, http.StatusNotFound, "User not found", "NotFound")
		return
	}

	response.Success(w, http.StatusOK, "OK", toUserResponse(user))
}

func toUserResponse(u *models.User) UserResponse {
	return UserResponse{
		ID:        u.ID,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Gender:    u.Gender,
		Email:     u.Email,
		CreatedAt: u.CreatedAt,
	}
}
