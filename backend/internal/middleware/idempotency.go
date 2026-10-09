package middleware

import (
	"encoding/json"
	"net/http"
	"sync"
	"time"
)

// IdempotencyMiddleware prevents duplicate financial operations when
// network lag causes users to click "Withdraw" or "Buy" multiple times.
//
// Protocol:
//   Frontend sends UUID in header: X-Idempotency-Key: <uuid>
//   Backend checks Redis (here: in-memory map) with 24h TTL
//   If key exists → return cached response, NEVER debit twice!
type IdempotencyMiddleware struct {
	mu    sync.RWMutex
	cache map[string]*cachedResponse
}

type cachedResponse struct {
	StatusCode int
	Body       []byte
	ExpiresAt  time.Time
}

const idempotencyTTL = 24 * time.Hour

func NewIdempotencyMiddleware() *IdempotencyMiddleware {
	m := &IdempotencyMiddleware{
		cache: make(map[string]*cachedResponse),
	}
	go m.cleanupLoop()
	return m
}

func (m *IdempotencyMiddleware) Wrap(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		key := r.Header.Get("X-Idempotency-Key")
		if key == "" {
			next(w, r)
			return
		}

		// Check for existing response
		m.mu.RLock()
		cached, exists := m.cache[key]
		m.mu.RUnlock()

		if exists && time.Now().Before(cached.ExpiresAt) {
			w.WriteHeader(cached.StatusCode)
			w.Write(cached.Body)
			return
		}

		// Capture response
		recorder := &responseRecorder{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}
		next(recorder, r)

		// Store in cache
		m.mu.Lock()
		m.cache[key] = &cachedResponse{
			StatusCode: recorder.statusCode,
			Body:       recorder.body,
			ExpiresAt:  time.Now().Add(idempotencyTTL),
		}
		m.mu.Unlock()
	}
}

func (m *IdempotencyMiddleware) cleanupLoop() {
	ticker := time.NewTicker(1 * time.Hour)
	for range ticker.C {
		m.mu.Lock()
		now := time.Now()
		for k, v := range m.cache {
			if now.After(v.ExpiresAt) {
				delete(m.cache, k)
			}
		}
		m.mu.Unlock()
	}
}

type responseRecorder struct {
	http.ResponseWriter
	statusCode int
	body       []byte
}

func (r *responseRecorder) WriteHeader(code int) {
	r.statusCode = code
	r.ResponseWriter.WriteHeader(code)
}

func (r *responseRecorder) Write(b []byte) (int, error) {
	r.body = append(r.body, b...)
	return r.ResponseWriter.Write(b)
}

// ErrorJSON is a helper to write standardized JSON error responses
func ErrorJSON(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}
