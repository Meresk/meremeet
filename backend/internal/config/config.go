package config

import (
	"os"
)

type Config struct {
	Port      string
	DbURL     string
	JwtSecret string
}

func Load() *Config {
	return &Config{
		Port:      getEnv("PORT", "3000"),
		DbURL:     getEnv("DB_URL", "host=127.0.0.1 port=5432 user=yakov password=admin dbname=meremeet sslmode=disable"),
		JwtSecret: getEnv("JWT_SECRET", "hrqwoperyuoy32190437124yiqwuery210934y"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
