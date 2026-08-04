package payaza

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/CodeEnthusiast09/fund-me-backend/internal/config"
)

// VerificationResult is the normalized shape the donation feature needs,
// independent of Payaza's exact wire format.
type VerificationResult struct {
	Successful   bool
	Amount       float64
	CurrencyCode string
	Raw          json.RawMessage
}

// Verifier is implemented by Client. Kept as an interface so donation
// business logic can be built and tested against a stub independent of
// the live Payaza integration.
type Verifier interface {
	VerifyTransaction(ctx context.Context, reference string) (*VerificationResult, error)
}

type Client struct {
	publicKey string
	baseURL   string
	tenantID  string // "live" or "test", per Payaza's X-TenantID header
	http      *http.Client
}

func NewClient(cfg *config.Config) *Client {
	tenantID := "test"
	if cfg.Env == "production" {
		tenantID = "live"
	}

	return &Client{
		publicKey: cfg.PayazaPublicKey,
		baseURL:   strings.TrimSuffix(cfg.PayazaAPIBaseURL, "/"),
		tenantID:  tenantID,
		http:      &http.Client{},
	}
}

// VerifyTransaction confirms a merchant transaction reference directly with
// Payaza server-to-server before a donation is ever persisted -- a
// client-supplied "payment succeeded" call can't be trusted on its own.
//
// Matches Payaza's Transaction Status Query API:
// https://docs.payaza.africa/api-reference/check-transaction-statusmerchant-reference/check-transaction-statusmerchant-reference.md
func (c *Client) VerifyTransaction(ctx context.Context, reference string) (*VerificationResult, error) {
	endpoint := fmt.Sprintf(
		"%s/merchant-collection/transfer_notification_controller/merchant/transaction-query?merchant_reference=%s",
		c.baseURL,
		url.QueryEscape(reference),
	)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}
	// Payaza's custom auth scheme: "Payaza <base64(public key)>", not Bearer.
	req.Header.Set("Authorization", "Payaza "+base64.StdEncoding.EncodeToString([]byte(c.publicKey)))
	req.Header.Set("X-TenantID", c.tenantID)
	req.Header.Set("X-ProductID", "app")
	req.Header.Set("Accept", "application/json")

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return &VerificationResult{Successful: false, Raw: raw}, nil
	}

	var payload struct {
		Success bool   `json:"success"`
		Message string `json:"message"`
		Data    struct {
			TransactionStatus string  `json:"transaction_status"`
			AmountReceived    float64 `json:"amount_received"`
			Currency          string  `json:"currency"`
		} `json:"data"`
	}
	if err := json.Unmarshal(raw, &payload); err != nil {
		return nil, err
	}

	successful := payload.Success && strings.EqualFold(payload.Data.TransactionStatus, "Completed")

	return &VerificationResult{
		Successful:   successful,
		Amount:       payload.Data.AmountReceived,
		CurrencyCode: payload.Data.Currency,
		Raw:          raw,
	}, nil
}
