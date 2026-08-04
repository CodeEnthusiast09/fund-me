package donation

import (
	"context"
	"errors"

	"github.com/CodeEnthusiast09/fund-me-backend/internal/models"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/payaza"
	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

var (
	ErrCampaignNotFound   = errors.New("campaign not found")
	ErrPaymentNotVerified = errors.New("payment could not be verified")
	ErrAmountMismatch     = errors.New("verified amount does not match submitted amount")
)

type Service struct {
	db     *gorm.DB
	payaza payaza.Verifier
}

func NewService(db *gorm.DB, payazaClient payaza.Verifier) *Service {
	return &Service{db: db, payaza: payazaClient}
}

func (s *Service) Create(ctx context.Context, donorID uuid.UUID, req CreateDonationRequest) (*models.Donation, error) {
	// Idempotency: a retried POST with the same transaction reference
	// returns the existing donation instead of erroring or double-recording.
	var existing models.Donation
	err := s.db.WithContext(ctx).Where("payaza_transaction_reference = ?", req.TransactionReference).First(&existing).Error
	if err == nil {
		return &existing, nil
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	var campaignRecord models.Campaign
	if err := s.db.WithContext(ctx).First(&campaignRecord, "id = ?", req.CampaignID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrCampaignNotFound
		}
		return nil, err
	}

	verification, err := s.payaza.VerifyTransaction(ctx, req.TransactionReference)
	if err != nil {
		return nil, err
	}
	if !verification.Successful {
		return nil, ErrPaymentNotVerified
	}
	if verification.Amount > 0 && verification.Amount != req.CheckoutAmount {
		return nil, ErrAmountMismatch
	}

	donationRecord := &models.Donation{
		CampaignID:                 campaignRecord.ID,
		DonorID:                    donorID,
		FirstName:                  req.FirstName,
		LastName:                   req.LastName,
		Email:                      req.EmailAddress,
		PhoneNumber:                req.PhoneNumber,
		CurrencyCode:               req.CurrencyCode,
		Amount:                     req.CheckoutAmount,
		Status:                     models.DonationStatusConfirmed,
		PayazaTransactionReference: req.TransactionReference,
		PayazaResponse:             datatypes.JSON(verification.Raw),
	}

	if err := s.db.WithContext(ctx).Create(donationRecord).Error; err != nil {
		return nil, err
	}

	return donationRecord, nil
}

func (s *Service) ListForCampaign(ctx context.Context, campaignID uuid.UUID, page, limit int) ([]models.Donation, int64, error) {
	query := s.db.WithContext(ctx).Model(&models.Donation{}).
		Where("campaign_id = ? AND status = ?", campaignID, models.DonationStatusConfirmed)

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	var donations []models.Donation
	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&donations).Error; err != nil {
		return nil, 0, err
	}

	return donations, total, nil
}

func (s *Service) ListMine(ctx context.Context, donorID uuid.UUID, page, limit int) ([]models.Donation, int64, error) {
	query := s.db.WithContext(ctx).Model(&models.Donation{}).
		Preload("Campaign").
		Where("donor_id = ?", donorID)

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	var donations []models.Donation
	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&donations).Error; err != nil {
		return nil, 0, err
	}

	return donations, total, nil
}
