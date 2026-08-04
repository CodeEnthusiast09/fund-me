package payaza

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
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
// business logic can be built and tested against a stub while the exact
// Payaza verify contract is confirmed.
type Verifier interface {
	VerifyTransaction(ctx context.Context, reference string) (*VerificationResult, error)
}

type Client struct {
	secretKey string
	baseURL   string
	http      *http.Client
}

func NewClient(cfg *config.Config) *Client {
	return &Client{
		secretKey: cfg.PayazaSecretKey,
		baseURL:   cfg.PayazaAPIBaseURL,
		http:      &http.Client{},
	}
}

// VerifyTransaction confirms a transaction reference directly with Payaza
// server-to-server before a donation is ever persisted — a client-supplied
// "payment succeeded" call can't be trusted on its own, since anyone could
// POST a fake reference without ever paying.
//
// FLAG: the exact verify endpoint path, auth header format, and response
// schema need confirming against Payaza's merchant/checkout API docs during
// implementation — this was not verified against live docs during planning.
// The shape below is a best-effort placeholder against Payaza's general
// "verify transaction by reference" pattern; adjust the URL, headers, and
// the payload struct below once confirmed.
func (c *Client) VerifyTransaction(ctx context.Context, reference string) (*VerificationResult, error) {
	url := fmt.Sprintf("%s/checkout/transaction/verify/%s", c.baseURL, reference)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.secretKey)
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
		Status   bool `json:"status"`
		Response struct {
			TransactionStatus string  `json:"transaction_status"`
			Amount            float64 `json:"amount"`
			CurrencyCode      string  `json:"currency_code"`
		} `json:"response"`
	}
	if err := json.Unmarshal(raw, &payload); err != nil {
		return nil, err
	}

	successful := payload.Status && strings.EqualFold(payload.Response.TransactionStatus, "successful")

	return &VerificationResult{
		Successful:   successful,
		Amount:       payload.Response.Amount,
		CurrencyCode: payload.Response.CurrencyCode,
		Raw:          raw,
	}, nil
}
