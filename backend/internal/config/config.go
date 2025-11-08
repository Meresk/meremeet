package config

import (
	"os"
)

type Config struct {
	Port             string
	DbURL            string
	JwtSecret        string
	AdminDefaultPass string
	AllowOrigins     string
	AllowMethods     string
	AllowHeaders     string

	LiveKitApiKey    string
	LiveKitApiSecret string
	LiveKitServerURL string
}

func Load() *Config {
	return &Config{
		Port:             getEnv("PORT", "8080"),
		DbURL:            getEnv("DB_URL", "host=127.0.0.1 port=5432 user=yakov password=admin dbname=meremeet sslmode=disable"),
		JwtSecret:        getEnv("JWT_SECRET", "hrqwoperyuoy32190437124yiqwuery210934y"),
		AdminDefaultPass: getEnv("ADMIN_DEFAULT_PASSWORD", "admin"),
		AllowOrigins:     getEnv("CORS_ALLOW_ORIGINS", "http://localhost:5173"),
		AllowMethods:     getEnv("CORS_ALLOW_METHODS", "GET,POST,PUT,DELETE,OPTIONS"),
		AllowHeaders:     getEnv("CORS_ALLOW_HEADERS", "Content-Type,Authorization"),

		LiveKitApiKey:    getEnv("LIVEKIT_API_KEY", "devkey"),
		LiveKitApiSecret: getEnv("LIVEKIT_API_SECRET", "secret"),
		LiveKitServerURL: getEnv("LIVEKIT_SERVER_URL", "http://localhost:7880"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
