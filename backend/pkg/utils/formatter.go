package utils

import (
	"fmt"
	"math/big"
	"strings"
	"time"
)

// FormatCurrency formats a big float to standard string representation
func FormatCurrency(amount float64, currency string) string {
	return fmt.Sprintf("%.2f %s", amount, strings.ToUpper(currency))
}

// FormatVND formats decimal numbers into Vietnamese Currency standard
func FormatVND(amount float64) string {
	b := big.NewInt(int64(amount))
	return fmt.Sprintf("%s ₫", b.String())
}

// GetTimestampISO returns ISO-8601 formatted timestamp string
func GetTimestampISO() string {
	return time.Now().UTC().Format(time.RFC3339)
}
