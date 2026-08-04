package campaign

import (
	"context"
	"errors"
	"time"

	"github.com/CodeEnthusiast09/fund-me-backend/internal/models"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

var (
	ErrCampaignNotFound = errors.New("campaign not found")
	ErrNotOwner         = errors.New("you do not own this campaign")
	ErrInvalidDeadline  = errors.New("invalid deadline format")
)

type Service struct {
	db *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{db: db}
}

type ListFilter struct {
	Page     int
	Limit    int
	Search   string
	Category string
	Sort     string
}

type campaignAggregate struct {
	CampaignID   uuid.UUID
	AmountRaised float64
	DonorCount   int64
}

func (s *Service) List(ctx context.Context, filter ListFilter) ([]models.Campaign, map[uuid.UUID]campaignAggregate, int64, error) {
	query := s.db.WithContext(ctx).Model(&models.Campaign{})

	if filter.Search != "" {
		like := "%" + filter.Search + "%"
		query = query.Where("title ILIKE ? OR description ILIKE ?", like, like)
	}
	if filter.Category != "" {
		query = query.Where("? = ANY(category)", filter.Category)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, nil, 0, err
	}

	switch filter.Sort {
	case "trending":
		query = query.Order("(SELECT COALESCE(SUM(amount),0) FROM donations WHERE donations.campaign_id = campaigns.id AND donations.status = 'confirmed') DESC")
	default:
		query = query.Order("created_at DESC")
	}

	offset := (filter.Page - 1) * filter.Limit
	var campaigns []models.Campaign
	if err := query.Preload("Creator").Limit(filter.Limit).Offset(offset).Find(&campaigns).Error; err != nil {
		return nil, nil, 0, err
	}

	ids := make([]uuid.UUID, 0, len(campaigns))
	for _, c := range campaigns {
		ids = append(ids, c.ID)
	}

	aggregates, err := s.aggregatesFor(ctx, ids)
	if err != nil {
		return nil, nil, 0, err
	}

	return campaigns, aggregates, total, nil
}

func (s *Service) Get(ctx context.Context, id uuid.UUID) (*models.Campaign, campaignAggregate, error) {
	var campaign models.Campaign
	if err := s.db.WithContext(ctx).Preload("Creator").First(&campaign, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, campaignAggregate{}, ErrCampaignNotFound
		}
		return nil, campaignAggregate{}, err
	}

	aggregate, err := s.AggregateFor(ctx, id)
	if err != nil {
		return nil, campaignAggregate{}, err
	}

	return &campaign, aggregate, nil
}

func (s *Service) AggregateFor(ctx context.Context, id uuid.UUID) (campaignAggregate, error) {
	aggregates, err := s.aggregatesFor(ctx, []uuid.UUID{id})
	if err != nil {
		return campaignAggregate{}, err
	}
	return aggregates[id], nil
}

func (s *Service) aggregatesFor(ctx context.Context, campaignIDs []uuid.UUID) (map[uuid.UUID]campaignAggregate, error) {
	result := make(map[uuid.UUID]campaignAggregate)
	if len(campaignIDs) == 0 {
		return result, nil
	}

	var rows []campaignAggregate
	err := s.db.WithContext(ctx).
		Model(&models.Donation{}).
		Select("campaign_id, COALESCE(SUM(amount),0) as amount_raised, COUNT(*) as donor_count").
		Where("campaign_id IN ? AND status = ?", campaignIDs, models.DonationStatusConfirmed).
		Group("campaign_id").
		Scan(&rows).Error
	if err != nil {
		return nil, err
	}

	for _, row := range rows {
		result[row.CampaignID] = row
	}
	return result, nil
}

func (s *Service) Create(ctx context.Context, creatorID uuid.UUID, req CreateCampaignRequest) (*models.Campaign, error) {
	campaignRecord := &models.Campaign{
		CreatorID:   creatorID,
		Title:       req.Title,
		Description: req.Description,
		HeaderImage: req.HeaderImage,
		Story:       req.Story,
		Goal:        req.Goal,
		Category:    pq.StringArray(req.Category),
	}

	if req.Deadline != nil && *req.Deadline != "" {
		parsed, err := parseDeadline(*req.Deadline)
		if err != nil {
			return nil, ErrInvalidDeadline
		}
		campaignRecord.Deadline = &parsed
	}

	if err := s.db.WithContext(ctx).Create(campaignRecord).Error; err != nil {
		return nil, err
	}
	if err := s.db.WithContext(ctx).Preload("Creator").First(campaignRecord, "id = ?", campaignRecord.ID).Error; err != nil {
		return nil, err
	}

	return campaignRecord, nil
}

func (s *Service) Update(ctx context.Context, id uuid.UUID, userID uuid.UUID, req UpdateCampaignRequest) (*models.Campaign, error) {
	var campaignRecord models.Campaign
	if err := s.db.WithContext(ctx).First(&campaignRecord, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrCampaignNotFound
		}
		return nil, err
	}

	if campaignRecord.CreatorID != userID {
		return nil, ErrNotOwner
	}

	updates := map[string]any{}
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	if req.HeaderImage != nil {
		updates["header_image"] = *req.HeaderImage
	}
	if req.Story != nil {
		updates["story"] = *req.Story
	}
	if req.Goal != nil {
		updates["goal"] = *req.Goal
	}
	if req.Category != nil {
		updates["category"] = pq.StringArray(req.Category)
	}
	if req.Deadline != nil {
		if *req.Deadline == "" {
			updates["deadline"] = nil
		} else {
			parsed, err := parseDeadline(*req.Deadline)
			if err != nil {
				return nil, ErrInvalidDeadline
			}
			updates["deadline"] = parsed
		}
	}

	if len(updates) > 0 {
		if err := s.db.WithContext(ctx).Model(&campaignRecord).Updates(updates).Error; err != nil {
			return nil, err
		}
	}

	if err := s.db.WithContext(ctx).Preload("Creator").First(&campaignRecord, "id = ?", id).Error; err != nil {
		return nil, err
	}

	return &campaignRecord, nil
}

func (s *Service) Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	var campaignRecord models.Campaign
	if err := s.db.WithContext(ctx).First(&campaignRecord, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrCampaignNotFound
		}
		return err
	}

	if campaignRecord.CreatorID != userID {
		return ErrNotOwner
	}

	return s.db.WithContext(ctx).Delete(&campaignRecord).Error
}

// parseDeadline tries every deadline format the frontend can actually send:
// RFC3339 (e.g. an API client), a date-only string, and HTML's
// datetime-local input format ("2024-06-15T14:30", no seconds, no
// timezone), which is what the new-campaign form's deadline field submits.
func parseDeadline(value string) (time.Time, error) {
	formats := []string{
		time.RFC3339,
		"2006-01-02T15:04",
		"2006-01-02",
	}

	var lastErr error
	for _, format := range formats {
		if parsed, err := time.Parse(format, value); err == nil {
			return parsed, nil
		} else {
			lastErr = err
		}
	}

	return time.Time{}, lastErr
}
