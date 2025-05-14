package main

import (
	"log"
	"net/http"
	"os"
	"database/sql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"your_project/handlers"
	"your_project/models"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	// Connect to the database
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Migrate the User model
	db.AutoMigrate(&models.User{})

	// Initialize router
	r := mux.NewRouter()
	handlers.InitRoutes(r, db)

	// Start the server
	port := os.Getenv("PORT")
	log.Printf("Server running on port %s", port)
	http.ListenAndServe(":"+port, r)
}
