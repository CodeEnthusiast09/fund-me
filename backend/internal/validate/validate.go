package validate

import (
	"errors"

	"github.com/go-playground/validator/v10"
)

var v = validator.New()

func Struct(s any) error {
	return v.Struct(s)
}

// Message turns the first validation failure into a short, readable
// string suitable for the ApiResponse envelope's message field.
func Message(err error) string {
	var verrs validator.ValidationErrors
	if errors.As(err, &verrs) && len(verrs) > 0 {
		return verrs[0].Field() + " failed the '" + verrs[0].Tag() + "' check"
	}
	return "Invalid input"
}
