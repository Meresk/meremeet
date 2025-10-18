package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/jackc/pgx/v5/stdlib"
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

	log.Println("Successfully connected to Postgres database")

	if err := runMigrations(db); err != nil {
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

		log.Println("Users table created successfully")
	} else {
		log.Println("Users table already exists")
	}

	return nil
}
