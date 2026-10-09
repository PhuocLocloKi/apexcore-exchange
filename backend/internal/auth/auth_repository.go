package auth

import (
	"errors"
	"time"
)

// User model supporting Omni-Channel identity linking
// One email → One user → One wallet (never duplicated)
type User struct {
	ID              string    `json:"id"`
	Email           string    `json:"email"`
	PasswordHash    string    `json:"-"`
	GoogleID        string    `json:"google_id,omitempty"`
	AppleID         string    `json:"apple_id,omitempty"`
	FullName        string    `json:"full_name"`
	Role            string    `json:"role"`
	WalletID        string    `json:"wallet_id,omitempty"`
	BalanceUSDT     float64   `json:"balance_usdt"`
	TwoFactorSecret string    `json:"-"`
	Is2FAEnabled    bool      `json:"is_2fa_enabled"`
	BiometricPubKey string    `json:"-"`
	CreatedAt       time.Time `json:"created_at"`
}

// AuthRepository abstracts all user persistence operations
type AuthRepository interface {
	FindByEmail(email string) (*User, error)
	FindByID(id string) (*User, error)
	FindByGoogleID(googleID string) (*User, error)
	FindByAppleID(appleID string) (*User, error)
	CreateUser(user *User) error
	UpdateUser(user *User) error
	GetAllUsers() []*User
	BanUser(id string) error
}

// MemoryAuthRepo is an in-memory implementation for development
type MemoryAuthRepo struct {
	users map[string]*User
}

func NewAuthRepository() AuthRepository {
	repo := &MemoryAuthRepo{
		users: make(map[string]*User),
	}
	// Seed Founder & Owner: NGUYỄN PHƯỚC LỘC
	founder := &User{
		ID:           "founder-loc",
		Email:        "nguyenphuocloc010306@gmail.com",
		PasswordHash: "argon2id$salt$admin123",
		FullName:     "NGUYỄN PHƯỚC LỘC",
		Role:         "ADMIN",
		WalletID:     "W-APEX-LOC-01",
		BalanceUSDT:  12458.32,
		CreatedAt:    time.Now(),
	}
	repo.users[founder.ID] = founder
	return repo
}

func (r *MemoryAuthRepo) GetAllUsers() []*User {
	list := make([]*User, 0, len(r.users))
	for _, u := range r.users {
		list = append(list, u)
	}
	return list
}

func (r *MemoryAuthRepo) BanUser(id string) error {
	if u, ok := r.users[id]; ok {
		u.Role = "BANNED"
		return nil
	}
	return errors.New("user not found")
}

func (r *MemoryAuthRepo) FindByEmail(email string) (*User, error) {
	for _, u := range r.users {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, errors.New("user not found")
}

func (r *MemoryAuthRepo) FindByID(id string) (*User, error) {
	u, ok := r.users[id]
	if !ok {
		return nil, errors.New("user not found")
	}
	return u, nil
}

func (r *MemoryAuthRepo) FindByGoogleID(googleID string) (*User, error) {
	for _, u := range r.users {
		if u.GoogleID == googleID {
			return u, nil
		}
	}
	return nil, errors.New("user not found by google_id")
}

func (r *MemoryAuthRepo) FindByAppleID(appleID string) (*User, error) {
	for _, u := range r.users {
		if u.AppleID == appleID {
			return u, nil
		}
	}
	return nil, errors.New("user not found by apple_id")
}

func (r *MemoryAuthRepo) CreateUser(user *User) error {
	r.users[user.ID] = user
	return nil
}

func (r *MemoryAuthRepo) UpdateUser(user *User) error {
	r.users[user.ID] = user
	return nil
}
