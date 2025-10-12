package config

import "os"

type Config struct {
	Port  string
	DbURL string
}

func Load() *Config {
	return &Config{
		Port:  getEnv("PORT", "8080"),
		DbURL: getEnv("DB_URL", "postgres://user:pass@localhost:5432/mydb"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
