package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/jackc/pgx/v5/stdlib"
	"golang.org/x/crypto/bcrypt"
)

func NewPostgresDB(connStr string) (*sql.DB, error) {
	db, err := sql.Open("pgx", connStr)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		fmt.Printf("RAW ERROR: %q\n", err.Error())
		return nil, err
	}

	log.Println("(db) Successfully connected to Postgres database")

	if err := runMigrations(db); err != nil {
		return nil, err
	}

	if err := seed(db); err != nil {
		return nil, err
	}

	return db, nil
}

func runMigrations(db *sql.DB) error {
	var tableExists bool
	err := db.QueryRow(`
		SELECT EXISTS (
			SELECT FROM information_schema.tables 
			WHERE table_name = 'users'
		)
	`).Scan(&tableExists)

	if err != nil {
		return err
	}

	if !tableExists {
		log.Println("Creating users table...")
		_, err := db.Exec(`
			CREATE TABLE users (
				id SERIAL PRIMARY KEY,
				login VARCHAR(100) UNIQUE NOT NULL,
				password VARCHAR(255) NOT NULL
			)
		`)

		if err != nil {
			return err
		}

		log.Println("(migrations) Users table created successfully")
	} else {
		log.Println("(migrations) Users table already exists")
	}

	return nil
}

func seed(db *sql.DB) error {
	var adminExists bool
	err := db.QueryRow(`
		SELECT EXISTS (
			SELECT 1 FROM users WHERE login = 'admin'
		)
	`).Scan(&adminExists)

	if err != nil {
		return fmt.Errorf("(seeding) failed to check admin user: %w", err)
	}

	if adminExists {
		log.Println("(seeding) Admin user already exists")
		return nil
	}

	hashedPass, err := bcrypt.GenerateFromPassword([]byte("admin"), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("(seeding) failed to hash password for admin: %w", err)
	}

	_, err = db.Exec(`
		INSERT INTO users (login, password)
		VALUES($1, $2)
	`, "admin", string(hashedPass))
	if err != nil {
		return fmt.Errorf("(seeding) failed to create admin user: %w", err)
	}

	log.Println("(seeding) Admin user created successfully (login: admin, password: admin)")

	return nil
}
