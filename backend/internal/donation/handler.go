package donation

import (
	"encoding/json"
	"errors"
	"math"
	"net/http"
	"strconv"

	"github.com/CodeEnthusiast09/fund-me-backend/internal/middleware"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/models"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/response"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/validate"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	donorID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		response.Fail(w, http.StatusUnauthorized, "Not authenticated", "Unauthorized")
		return
	}

	var req CreateDonationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Fail(w, http.StatusBadRequest, "Invalid request body", "BadRequest")
		return
	}
	if err := validate.Struct(req); err != nil {
		response.Fail(w, http.StatusBadRequest, validate.Message(err), "ValidationError")
		return
	}

	donationRecord, err := h.service.Create(r.Context(), donorID, req)
	if err != nil {
		switch {
		case errors.Is(err, ErrCampaignNotFound):
			response.Fail(w, http.StatusNotFound, "Campaign not found", "NotFound")
		case errors.Is(err, ErrPaymentNotVerified):
			response.Fail(w, http.StatusPaymentRequired, "Payment could not be verified", "PaymentNotVerified")
		case errors.Is(err, ErrAmountMismatch):
			response.Fail(w, http.StatusBadRequest, "Verified amount does not match submitted amount", "ValidationError")
		default:
			response.Fail(w, http.StatusInternalServerError, "Could not record donation", "ServerError")
		}
		return
	}

	response.Success(w, http.StatusCreated, "Donation recorded", toDonationResponse(donationRecord))
}

func (h *Handler) ListForCampaign(w http.ResponseWriter, r *http.Request) {
	campaignID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Fail(w, http.StatusBadRequest, "Invalid campaign id", "BadRequest")
		return
	}

	page := parseIntParam(r.URL.Query().Get("page"), 1)
	limit := parseIntParam(r.URL.Query().Get("limit"), 10)

	donations, total, err := h.service.ListForCampaign(r.Context(), campaignID, page, limit)
	if err != nil {
		response.Fail(w, http.StatusInternalServerError, "Could not fetch supporters", "ServerError")
		return
	}

	items := make([]DonationResponse, 0, len(donations))
	for _, d := range donations {
		items = append(items, toDonationResponse(&d))
	}

	response.Paginated(w, http.StatusOK, "OK", items, response.PaginationMeta{
		Total: total, Page: page, Limit: limit, TotalPages: totalPages(total, limit),
	})
}

func (h *Handler) ListMine(w http.ResponseWriter, r *http.Request) {
	donorID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		response.Fail(w, http.StatusUnauthorized, "Not authenticated", "Unauthorized")
		return
	}

	page := parseIntParam(r.URL.Query().Get("page"), 1)
	limit := parseIntParam(r.URL.Query().Get("limit"), 10)

	donations, total, err := h.service.ListMine(r.Context(), donorID, page, limit)
	if err != nil {
		response.Fail(w, http.StatusInternalServerError, "Could not fetch donations", "ServerError")
		return
	}

	items := make([]MyDonationResponse, 0, len(donations))
	for _, d := range donations {
		items = append(items, MyDonationResponse{
			DonationResponse: toDonationResponse(&d),
			Campaign: CampaignSummary{
				ID:          d.Campaign.ID,
				Title:       d.Campaign.Title,
				HeaderImage: d.Campaign.HeaderImage,
			},
		})
	}

	response.Paginated(w, http.StatusOK, "OK", items, response.PaginationMeta{
		Total: total, Page: page, Limit: limit, TotalPages: totalPages(total, limit),
	})
}

func toDonationResponse(d *models.Donation) DonationResponse {
	return DonationResponse{
		ID:           d.ID,
		CampaignID:   d.CampaignID,
		FirstName:    d.FirstName,
		LastName:     d.LastName,
		CurrencyCode: d.CurrencyCode,
		Amount:       d.Amount,
		Status:       d.Status,
		CreatedAt:    d.CreatedAt,
	}
}

func totalPages(total int64, limit int) int {
	if limit <= 0 {
		return 0
	}
	return int(math.Ceil(float64(total) / float64(limit)))
}

func parseIntParam(value string, fallback int) int {
	if value == "" {
		return fallback
	}
	n, err := strconv.Atoi(value)
	if err != nil || n <= 0 {
		return fallback
	}
	return n
}
