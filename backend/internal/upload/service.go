package upload

import (
	"context"
	"fmt"
	"mime/multipart"

	"github.com/CodeEnthusiast09/fund-me-backend/internal/config"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type Service struct {
	cld    *cloudinary.Cloudinary
	folder string
}

func NewService(cfg *config.Config) (*Service, error) {
	cld, err := cloudinary.NewFromParams(cfg.CloudinaryCloudName, cfg.CloudinaryAPIKey, cfg.CloudinaryAPISecret)
	if err != nil {
		return nil, fmt.Errorf("init cloudinary client: %w", err)
	}
	return &Service{cld: cld, folder: cfg.CloudinaryUploadFolder}, nil
}

type UploadedImage struct {
	URL      string
	PublicID string
}

func (s *Service) UploadImage(ctx context.Context, file multipart.File) (*UploadedImage, error) {
	result, err := s.cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder:       s.folder,
		ResourceType: "image",
	})
	if err != nil {
		return nil, err
	}

	return &UploadedImage{URL: result.SecureURL, PublicID: result.PublicID}, nil
}
