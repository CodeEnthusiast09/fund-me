package donation

import (
	"context"
	"errors"
	"strings"

	"github.com/CodeEnthusiast09/fund-me-backend/internal/models"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/payaza"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

var (
	ErrCampaignNotFound          = errors.New("campaign not found")
	ErrPaymentNotVerified        = errors.New("payment could not be verified")
	ErrAmountMismatch            = errors.New("verified amount does not match submitted amount")
	ErrCurrencyMismatch          = errors.New("verified currency does not match submitted currency")
	ErrTransactionAlreadyClaimed = errors.New("this transaction has already been recorded")
)

type Service struct {
	db     *gorm.DB
	payaza payaza.Verifier
}

func NewService(db *gorm.DB, payazaClient payaza.Verifier) *Service {
	return &Service{db: db, payaza: payazaClient}
}

func (s *Service) Create(ctx context.Context, donorID uuid.UUID, req CreateDonationRequest) (*models.Donation, error) {
	// Idempotency is scoped to (reference, donor): a retried POST from the
	// same donor with the same reference returns their existing donation.
	// A reference is never looked up donor-agnostically here — otherwise a
	// guessed, replayed, or raced transaction reference (the frontend
	// generates these as TX_<timestamp>, which is predictable, not a
	// cryptographic nonce) would let a second caller either silently
	// receive a stranger's donation record or, on a genuinely new
	// reference, race to attribute someone else's real payment to
	// themselves.
	var existing models.Donation
	err := s.db.WithContext(ctx).
		Where("payaza_transaction_reference = ? AND donor_id = ?", req.TransactionReference, donorID).
		First(&existing).Error
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
	// A non-positive verified amount means there's nothing to trust as
	// "paid" regardless of what the client submitted -- reject it as
	// unverified rather than falling into the mismatch check below.
	if verification.Amount <= 0 {
		return nil, ErrPaymentNotVerified
	}
	// The submitted amount/currency only need to match closely enough to
	// confirm the client isn't confused about what it just paid; the
	// verified values from Payaza -- not the client-submitted ones -- are
	// what actually get persisted below, so a future gap in these checks
	// can't let a forged amount become the stored source of truth.
	if verification.Amount != req.CheckoutAmount {
		return nil, ErrAmountMismatch
	}
	if verification.CurrencyCode != "" && !strings.EqualFold(verification.CurrencyCode, req.CurrencyCode) {
		return nil, ErrCurrencyMismatch
	}

	currencyCode := req.CurrencyCode
	if verification.CurrencyCode != "" {
		currencyCode = verification.CurrencyCode
	}

	donationRecord := &models.Donation{
		CampaignID:                 campaignRecord.ID,
		DonorID:                    donorID,
		FirstName:                  req.FirstName,
		LastName:                   req.LastName,
		Email:                      req.EmailAddress,
		PhoneNumber:                req.PhoneNumber,
		CurrencyCode:               currencyCode,
		Amount:                     verification.Amount,
		Status:                     models.DonationStatusConfirmed,
		PayazaTransactionReference: req.TransactionReference,
		PayazaResponse:             datatypes.JSON(verification.Raw),
	}

	if err := s.db.WithContext(ctx).Create(donationRecord).Error; err != nil {
		if isUniqueViolation(err) {
			// Someone else already claimed this exact transaction
			// reference -- a concurrent retry, or an attempt to attribute
			// another donor's real payment to this account. Either way,
			// never fall through to a generic error that could mask what
			// actually happened.
			return nil, ErrTransactionAlreadyClaimed
		}
		return nil, err
	}

	return donationRecord, nil
}

func isUniqueViolation(err error) bool {
	pgErr, ok := errors.AsType[*pgconn.PgError](err)
	return ok && pgErr.Code == "23505"
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
