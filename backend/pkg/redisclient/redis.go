package redisclient

import (
	"apexcore-exchange/backend/pkg/logger"
)

type RedisClient struct {
	log *logger.Logger
}

func NewRedisClient(log *logger.Logger) *RedisClient {
	log.Info("Initializing Redis Pub/Sub client...")
	return &RedisClient{log: log}
}

func (r *RedisClient) Publish(channel string, message string) error {
	r.log.Info("Publishing to channel [%s]: %s", channel, message)
	return nil
}
