package campaign

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

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	filter := ListFilter{
		Page:     parseIntParam(q.Get("page"), 1),
		Limit:    parseIntParam(q.Get("limit"), 6),
		Search:   q.Get("search"),
		Category: q.Get("category"),
		Sort:     q.Get("sort"),
	}

	campaigns, aggregates, total, err := h.service.List(r.Context(), filter)
	if err != nil {
		response.Fail(w, http.StatusInternalServerError, "Could not fetch campaigns", "ServerError")
		return
	}

	items := make([]CampaignResponse, 0, len(campaigns))
	for _, c := range campaigns {
		items = append(items, toCampaignResponse(&c, aggregates[c.ID]))
	}

	totalPages := 0
	if filter.Limit > 0 {
		totalPages = int(math.Ceil(float64(total) / float64(filter.Limit)))
	}

	response.Paginated(w, http.StatusOK, "OK", items, response.PaginationMeta{
		Total:      total,
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalPages: totalPages,
	})
}

func (h *Handler) Get(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Fail(w, http.StatusBadRequest, "Invalid campaign id", "BadRequest")
		return
	}

	campaignRecord, aggregate, err := h.service.Get(r.Context(), id)
	if err != nil {
		if errors.Is(err, ErrCampaignNotFound) {
			response.Fail(w, http.StatusNotFound, "Campaign not found", "NotFound")
			return
		}
		response.Fail(w, http.StatusInternalServerError, "Could not fetch campaign", "ServerError")
		return
	}

	response.Success(w, http.StatusOK, "OK", toCampaignResponse(campaignRecord, aggregate))
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		response.Fail(w, http.StatusUnauthorized, "Not authenticated", "Unauthorized")
		return
	}

	var req CreateCampaignRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Fail(w, http.StatusBadRequest, "Invalid request body", "BadRequest")
		return
	}
	if err := validate.Struct(req); err != nil {
		response.Fail(w, http.StatusBadRequest, validate.Message(err), "ValidationError")
		return
	}

	campaignRecord, err := h.service.Create(r.Context(), userID, req)
	if err != nil {
		if errors.Is(err, ErrInvalidDeadline) {
			response.Fail(w, http.StatusBadRequest, "Invalid deadline format", "ValidationError")
			return
		}
		response.Fail(w, http.StatusInternalServerError, "Could not create campaign", "ServerError")
		return
	}

	response.Success(w, http.StatusCreated, "Campaign created", toCampaignResponse(campaignRecord, campaignAggregate{}))
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		response.Fail(w, http.StatusUnauthorized, "Not authenticated", "Unauthorized")
		return
	}

	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Fail(w, http.StatusBadRequest, "Invalid campaign id", "BadRequest")
		return
	}

	var req UpdateCampaignRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Fail(w, http.StatusBadRequest, "Invalid request body", "BadRequest")
		return
	}
	if err := validate.Struct(req); err != nil {
		response.Fail(w, http.StatusBadRequest, validate.Message(err), "ValidationError")
		return
	}

	campaignRecord, err := h.service.Update(r.Context(), id, userID, req)
	if err != nil {
		switch {
		case errors.Is(err, ErrCampaignNotFound):
			response.Fail(w, http.StatusNotFound, "Campaign not found", "NotFound")
		case errors.Is(err, ErrNotOwner):
			response.Fail(w, http.StatusForbidden, "You do not own this campaign", "Forbidden")
		case errors.Is(err, ErrInvalidDeadline):
			response.Fail(w, http.StatusBadRequest, "Invalid deadline format", "ValidationError")
		default:
			response.Fail(w, http.StatusInternalServerError, "Could not update campaign", "ServerError")
		}
		return
	}

	aggregate, err := h.service.AggregateFor(r.Context(), id)
	if err != nil {
		response.Fail(w, http.StatusInternalServerError, "Could not fetch campaign totals", "ServerError")
		return
	}

	response.Success(w, http.StatusOK, "Campaign updated", toCampaignResponse(campaignRecord, aggregate))
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		response.Fail(w, http.StatusUnauthorized, "Not authenticated", "Unauthorized")
		return
	}

	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Fail(w, http.StatusBadRequest, "Invalid campaign id", "BadRequest")
		return
	}

	if err := h.service.Delete(r.Context(), id, userID); err != nil {
		switch {
		case errors.Is(err, ErrCampaignNotFound):
			response.Fail(w, http.StatusNotFound, "Campaign not found", "NotFound")
		case errors.Is(err, ErrNotOwner):
			response.Fail(w, http.StatusForbidden, "You do not own this campaign", "Forbidden")
		default:
			response.Fail(w, http.StatusInternalServerError, "Could not delete campaign", "ServerError")
		}
		return
	}

	response.Success(w, http.StatusOK, "Campaign deleted", nil)
}

func toCampaignResponse(c *models.Campaign, agg campaignAggregate) CampaignResponse {
	return CampaignResponse{
		ID:               c.ID,
		Creator:          CreatorResponse{ID: c.Creator.ID, FirstName: c.Creator.FirstName, LastName: c.Creator.LastName},
		Title:            c.Title,
		Description:      c.Description,
		HeaderImage:      c.HeaderImage,
		Story:            c.Story,
		Goal:             c.Goal,
		Deadline:         c.Deadline,
		Category:         []string(c.Category),
		SocialMediaLinks: []string(c.SocialMediaLinks),
		Status:           c.Status,
		AmountRaised:     agg.AmountRaised,
		DonorCount:       agg.DonorCount,
		CreatedAt:        c.CreatedAt,
	}
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
