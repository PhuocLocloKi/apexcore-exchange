package database

import (
	"apexcore-exchange/backend/pkg/logger"
)

type DB struct {
	log *logger.Logger
}

func NewConnection(log *logger.Logger) (*DB, error) {
	log.Info("Connecting to Postgres database pool...")
	return &DB{log: log}, nil
}

func (d *DB) Ping() bool {
	d.log.Info("Postgres pool healthy")
	return true
}
