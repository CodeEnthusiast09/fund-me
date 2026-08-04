package auth

import (
	"context"
	"errors"
	"time"

	"github.com/CodeEnthusiast09/fund-me-backend/internal/middleware"
	"github.com/CodeEnthusiast09/fund-me-backend/internal/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var (
	ErrEmailTaken         = errors.New("email already registered")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrUserNotFound       = errors.New("user not found")
)

type Service struct {
	db        *gorm.DB
	jwtSecret string
	jwtExpiry time.Duration
}

func NewService(db *gorm.DB, jwtSecret string, jwtExpiry time.Duration) *Service {
	return &Service{db: db, jwtSecret: jwtSecret, jwtExpiry: jwtExpiry}
}

func (s *Service) Register(ctx context.Context, req RegisterRequest) (*models.User, error) {
	var existing models.User
	err := s.db.WithContext(ctx).Where("email = ?", req.Email).First(&existing).Error
	if err == nil {
		return nil, ErrEmailTaken
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Gender:       req.Gender,
		Email:        req.Email,
		PasswordHash: string(hash),
	}

	if err := s.db.WithContext(ctx).Create(user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (s *Service) Login(ctx context.Context, req LoginRequest) (*models.User, string, time.Time, error) {
	var user models.User
	if err := s.db.WithContext(ctx).Where("email = ?", req.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, "", time.Time{}, ErrInvalidCredentials
		}
		return nil, "", time.Time{}, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, "", time.Time{}, ErrInvalidCredentials
	}

	expiresAt := time.Now().Add(s.jwtExpiry)
	token, err := s.issueToken(user.ID, expiresAt)
	if err != nil {
		return nil, "", time.Time{}, err
	}

	return &user, token, expiresAt, nil
}

func (s *Service) Me(ctx context.Context, userID uuid.UUID) (*models.User, error) {
	var user models.User
	if err := s.db.WithContext(ctx).First(&user, "id = ?", userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return &user, nil
}

func (s *Service) issueToken(userID uuid.UUID, expiresAt time.Time) (string, error) {
	claims := middleware.Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}
