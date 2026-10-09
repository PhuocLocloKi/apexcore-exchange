package auth

import (
	"encoding/json"
	"net/http"
)

// AuthHandler processes all authentication REST endpoints
type AuthHandler struct {
	service *AuthService
}

func NewAuthHandler(service *AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

// --- Request/Response DTOs ---

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	FullName string `json:"full_name"`
}

type GoogleAuthRequest struct {
	IDToken  string `json:"id_token"`
	Email    string `json:"email,omitempty"`
	FullName string `json:"full_name,omitempty"`
}

type AppleAuthRequest struct {
	IdentityToken string `json:"identity_token"`
}

type BiometricAuthRequest struct {
	UserID    string `json:"user_id"`
	Challenge string `json:"challenge"`
	Signature string `json:"signature"`
}

type Verify2FARequest struct {
	UserID   string `json:"user_id"`
	TOTPCode string `json:"totp_code"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  *User  `json:"user"`
}

// POST /api/v1/auth/register
func (h *AuthHandler) HandleRegister(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, "Invalid input payload", http.StatusBadRequest)
		return
	}

	user, err := h.service.Register(req.Email, req.Password, req.FullName)
	if err != nil {
		writeError(w, err.Error(), http.StatusBadRequest)
		return
	}

	token := generateJWT(user)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(AuthResponse{Token: token, User: user})
}

// POST /api/v1/auth/login
func (h *AuthHandler) HandleLogin(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, "Invalid input payload", http.StatusBadRequest)
		return
	}

	token, user, err := h.service.Login(req.Email, req.Password)
	if err != nil {
		writeError(w, err.Error(), http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(AuthResponse{Token: token, User: user})
}

// POST /api/v1/auth/google
func (h *AuthHandler) HandleGoogleAuth(w http.ResponseWriter, r *http.Request) {
	var req GoogleAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, "Invalid input payload", http.StatusBadRequest)
		return
	}

	token, user, err := h.service.LoginWithGoogle(req.IDToken, req.Email, req.FullName)
	if err != nil {
		writeError(w, err.Error(), http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(AuthResponse{Token: token, User: user})
}

// POST /api/v1/auth/apple
func (h *AuthHandler) HandleAppleAuth(w http.ResponseWriter, r *http.Request) {
	var req AppleAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, "Invalid input payload", http.StatusBadRequest)
		return
	}

	token, user, err := h.service.LoginWithApple(req.IdentityToken)
	if err != nil {
		writeError(w, err.Error(), http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(AuthResponse{Token: token, User: user})
}

// POST /api/v1/auth/biometric
func (h *AuthHandler) HandleBiometric(w http.ResponseWriter, r *http.Request) {
	var req BiometricAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, "Invalid input payload", http.StatusBadRequest)
		return
	}

	token, err := h.service.VerifyBiometric(req.UserID, req.Challenge, req.Signature)
	if err != nil {
		writeError(w, err.Error(), http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"token": token})
}

// POST /api/v1/auth/2fa/verify
func (h *AuthHandler) Handle2FAVerify(w http.ResponseWriter, r *http.Request) {
	var req Verify2FARequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, "Invalid input payload", http.StatusBadRequest)
		return
	}

	valid, err := h.service.Verify2FA(req.UserID, req.TOTPCode)
	if err != nil {
		writeError(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(map[string]bool{"verified": valid})
}

func writeError(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

// GET /api/v1/admin/users
func (h *AuthHandler) HandleAdminListUsers(w http.ResponseWriter, r *http.Request) {
	users := h.service.GetAllUsers()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// POST /api/v1/admin/users/{id}/ban
func (h *AuthHandler) HandleAdminBanUser(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.service.BanUser(id); err != nil {
		writeError(w, err.Error(), http.StatusNotFound)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "user_banned", "id": id})
}
