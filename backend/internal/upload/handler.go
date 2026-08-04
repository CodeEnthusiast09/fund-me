package upload

import (
	"net/http"

	"github.com/CodeEnthusiast09/fund-me-backend/internal/response"
)

type Handler struct {
	service       *Service
	maxUploadSize int64 // bytes
}

func NewHandler(service *Service, maxUploadSizeMB int64) *Handler {
	return &Handler{service: service, maxUploadSize: maxUploadSizeMB * 1024 * 1024}
}

type imageUploadResponse struct {
	URL      string `json:"url"`
	PublicID string `json:"publicId"`
}

func (h *Handler) Image(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, h.maxUploadSize)

	if err := r.ParseMultipartForm(h.maxUploadSize); err != nil {
		response.Fail(w, http.StatusBadRequest, "File is too large or malformed", "BadRequest")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		response.Fail(w, http.StatusBadRequest, "Missing file field", "BadRequest")
		return
	}
	defer file.Close()

	if !isAllowedImageType(header.Header.Get("Content-Type")) {
		response.Fail(w, http.StatusBadRequest, "Only image files are allowed", "ValidationError")
		return
	}

	uploaded, err := h.service.UploadImage(r.Context(), file)
	if err != nil {
		response.Fail(w, http.StatusInternalServerError, "Could not upload image", "ServerError")
		return
	}

	response.Success(w, http.StatusCreated, "Image uploaded", imageUploadResponse{URL: uploaded.URL, PublicID: uploaded.PublicID})
}

func isAllowedImageType(contentType string) bool {
	switch contentType {
	case "image/jpeg", "image/png", "image/webp", "image/gif":
		return true
	default:
		return false
	}
}
