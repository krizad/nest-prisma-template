.PHONY: help install dev build start test clean
.PHONY: db-up db-down db-reset db-migrate db-seed db-studio
.PHONY: docker-up docker-down docker-logs docker-clean
.DEFAULT_GOAL := help

# Colors for output
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

##@ General

help: ## Display this help message
	@echo "$(CYAN)╔══════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║        NestJS + Prisma Template - Make Commands              ║$(RESET)"
	@echo "$(CYAN)╚══════════════════════════════════════════════════════════════╝$(RESET)"
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(CYAN)%-20s$(RESET) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(RESET)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Setup

setup: ## 🚀 First-time setup (install deps, start docker, setup database)
	@echo "$(GREEN)🚀 Starting first-time setup...$(RESET)"
	@echo "$(CYAN)📦 Installing dependencies...$(RESET)"
	@pnpm install
	@echo "$(CYAN)🐳 Starting Docker containers...$(RESET)"
	@docker-compose up -d
	@echo "$(YELLOW)⏳ Waiting for PostgreSQL to be ready...$(RESET)"
	@sleep 5
	@echo "$(CYAN)📊 Creating database schema...$(RESET)"
	@pnpm run migrate:dev
	@echo "$(CYAN)🌱 Seeding database...$(RESET)"
	@pnpm run seed
	@echo "$(GREEN)✅ Setup complete! Ready to start development.$(RESET)"
	@echo "$(YELLOW)📚 Run 'make dev' to start the development server$(RESET)"

install: ## 📦 Install dependencies
	@echo "$(CYAN)📦 Installing dependencies...$(RESET)"
	@pnpm install

##@ Development

dev: ## 🔥 Start development server
	@echo "$(GREEN)🔥 Starting development server...$(RESET)"
	@pnpm run start:dev

start: ## ▶️  Start production server
	@echo "$(GREEN)▶️  Starting production server...$(RESET)"
	@pnpm run start:prod

build: ## 🔨 Build the application
	@echo "$(CYAN)🔨 Building application...$(RESET)"
	@pnpm run build

lint: ## 🔍 Lint the code
	@echo "$(CYAN)🔍 Linting code...$(RESET)"
	@pnpm run lint

format: ## ✨ Format the code
	@echo "$(CYAN)✨ Formatting code...$(RESET)"
	@pnpm run format

##@ Testing

test: ## 🧪 Run unit tests
	@echo "$(CYAN)🧪 Running unit tests...$(RESET)"
	@pnpm run test

test-watch: ## 👀 Run tests in watch mode
	@echo "$(CYAN)👀 Running tests in watch mode...$(RESET)"
	@pnpm run test:watch

test-cov: ## 📊 Run tests with coverage
	@echo "$(CYAN)📊 Running tests with coverage...$(RESET)"
	@pnpm run test:cov

test-e2e: ## 🔄 Run e2e tests
	@echo "$(CYAN)🔄 Running e2e tests...$(RESET)"
	@pnpm run test:e2e

##@ Database

db-setup: docker-up ## 🗄️  Setup database from scratch
	@echo "$(YELLOW)⏳ Waiting for PostgreSQL to be ready...$(RESET)"
	@sleep 5
	@echo "$(CYAN)📊 Running migrations...$(RESET)"
	@pnpm run migrate:dev
	@echo "$(CYAN)🌱 Seeding database...$(RESET)"
	@pnpm run seed
	@echo "$(GREEN)✅ Database setup complete!$(RESET)"

db-reset: ## 🔄 Reset database (drop, create, migrate, seed)
	@echo "$(RED)⚠️  Resetting database... All data will be lost!$(RESET)"
	@echo "$(YELLOW)⏳ Stopping containers...$(RESET)"
	@docker-compose down
	@echo "$(YELLOW)🗑️  Removing volumes...$(RESET)"
	@docker volume rm nest-prisma-template_postgres_data 2>/dev/null || true
	@echo "$(CYAN)🐳 Starting containers...$(RESET)"
	@docker-compose up -d
	@echo "$(YELLOW)⏳ Waiting for PostgreSQL to be ready...$(RESET)"
	@sleep 5
	@echo "$(CYAN)📊 Running migrations...$(RESET)"
	@pnpm run migrate:dev
	@echo "$(CYAN)🌱 Seeding database...$(RESET)"
	@pnpm run seed
	@echo "$(GREEN)✅ Database reset complete!$(RESET)"

db-migrate: ## 📊 Run database migrations
	@echo "$(CYAN)📊 Running database migrations...$(RESET)"
	@pnpm run migrate:dev

db-migrate-deploy: ## 🚀 Deploy migrations (production)
	@echo "$(CYAN)🚀 Deploying migrations...$(RESET)"
	@pnpm run migrate:deploy

db-seed: ## 🌱 Seed the database
	@echo "$(CYAN)🌱 Seeding database...$(RESET)"
	@pnpm run seed

db-generate: ## 🔧 Generate Prisma client
	@echo "$(CYAN)🔧 Generating Prisma client...$(RESET)"
	@pnpm run generate

db-studio: ## 🎨 Open Prisma Studio
	@echo "$(CYAN)🎨 Opening Prisma Studio...$(RESET)"
	@pnpm exec prisma studio

db-clean-migrations: ## 🗑️  Delete all migration files
	@echo "$(RED)⚠️  Deleting all migration files...$(RESET)"
	@rm -rf prisma/migrations
	@echo "$(GREEN)✅ Migration files deleted$(RESET)"
	@echo "$(YELLOW)💡 Run 'make db-migrate' to create new migrations$(RESET)"

db-fresh: ## 🔄 Fresh database (clean migrations + reset)
	@echo "$(YELLOW)🔄 Creating fresh database...$(RESET)"
	@rm -rf prisma/migrations
	@docker-compose down
	@docker volume rm nest-prisma-template_postgres_data 2>/dev/null || true
	@docker-compose up -d
	@echo "$(YELLOW)⏳ Waiting for PostgreSQL to be ready...$(RESET)"
	@sleep 5
	@echo "$(CYAN)📊 Creating initial migration...$(RESET)"
	@pnpm run migrate:dev --name init
	@echo "$(CYAN)🌱 Seeding database...$(RESET)"
	@pnpm run seed
	@echo "$(GREEN)✅ Fresh database created!$(RESET)"

##@ Docker

docker-up: ## 🐳 Start Docker containers
	@echo "$(CYAN)🐳 Starting Docker containers...$(RESET)"
	@docker-compose up -d
	@echo "$(GREEN)✅ Docker containers started$(RESET)"

docker-down: ## 🛑 Stop Docker containers
	@echo "$(YELLOW)🛑 Stopping Docker containers...$(RESET)"
	@docker-compose down
	@echo "$(GREEN)✅ Docker containers stopped$(RESET)"

docker-logs: ## 📜 Show Docker logs
	@docker-compose logs -f

docker-clean: ## 🗑️  Clean Docker (containers, volumes, networks)
	@echo "$(RED)⚠️  Cleaning Docker resources...$(RESET)"
	@docker-compose down -v
	@docker volume prune -f
	@echo "$(GREEN)✅ Docker cleanup complete$(RESET)"

docker-restart: ## 🔄 Restart Docker containers
	@echo "$(YELLOW)🔄 Restarting Docker containers...$(RESET)"
	@docker-compose restart
	@echo "$(GREEN)✅ Docker containers restarted$(RESET)"

##@ Utilities

clean: ## 🧹 Clean build artifacts and dependencies
	@echo "$(YELLOW)🧹 Cleaning build artifacts...$(RESET)"
	@rm -rf dist node_modules .pnpm-store
	@echo "$(GREEN)✅ Cleanup complete$(RESET)"

clean-all: clean docker-clean ## 🗑️  Clean everything (build, deps, docker)
	@echo "$(GREEN)✅ Full cleanup complete$(RESET)"

check-env: ## 🔍 Check environment variables
	@echo "$(CYAN)🔍 Checking environment variables...$(RESET)"
	@if [ ! -f .env ]; then \
		echo "$(RED)❌ .env file not found!$(RESET)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✅ .env file exists$(RESET)"
	@echo "$(CYAN)Database URL: $$(grep DATABASE_URL .env | cut -d '=' -f2)$(RESET)"

health: ## 🏥 Check application and database health
	@echo "$(CYAN)🏥 Checking system health...$(RESET)"
	@echo "$(CYAN)📊 PostgreSQL status:$(RESET)"
	@docker-compose ps postgres
	@echo "$(CYAN)🌐 Application status:$(RESET)"
	@curl -s http://localhost:3000/api/health || echo "$(YELLOW)⚠️  Application not running$(RESET)"

logs: ## 📋 Show application logs
	@docker-compose logs -f

info: ## ℹ️  Show project information
	@echo "$(CYAN)╔══════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║              Project Information                             ║$(RESET)"
	@echo "$(CYAN)╚══════════════════════════════════════════════════════════════╝$(RESET)"
	@echo "$(GREEN)📦 Project:$(RESET) nest-prisma-template"
	@echo "$(GREEN)🔧 Node:$(RESET) $$(node -v 2>/dev/null || echo 'Not installed')"
	@echo "$(GREEN)📦 pnpm:$(RESET) $$(pnpm -v 2>/dev/null || echo 'Not installed')"
	@echo "$(GREEN)🐳 Docker:$(RESET) $$(docker -v 2>/dev/null | cut -d ' ' -f3 | tr -d ',' || echo 'Not installed')"
	@echo "$(GREEN)🌐 API:$(RESET) http://localhost:3000/api"
	@echo "$(GREEN)📚 Swagger:$(RESET) http://localhost:3000/api-docs"
	@echo "$(GREEN)🎨 Prisma Studio:$(RESET) run 'make db-studio'"
	@echo "$(GREEN)🗄️  PgAdmin:$(RESET) http://localhost:5050 (admin@admin.com / admin)"
