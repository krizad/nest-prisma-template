# NestJS + Prisma Boilerplate 🚀

Production-ready NestJS and Prisma boilerplate template following **Clean Architecture** and **Domain-Driven Design (DDD)** principles.

[![NestJS](https://img.shields.io/badge/NestJS-11.0-red.svg)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.3-2D3748.svg)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Docker Setup](#-docker-setup)
- [Testing](#-testing)
- [Architecture](#-architecture)
- [Best Practices](#-best-practices)

## ✨ Features

- 🏗️ **Clean Architecture** - Separation of concerns with clear boundaries
- 🎯 **Domain-Driven Design** - Business logic organized by domain
- 🔐 **Security First** - JWT authentication, CORS, validation, security headers
- � **Prisma 7** - Latest ORM with TypedSQL, RelationJoins, and enhanced performance
- 🗑️ **Soft Delete** - Automatic soft delete with Prisma extensions
- 📊 **Query Monitoring** - Performance tracking and slow query logging
- 🌱 **Database Seeding** - Comprehensive seed script with sample data
- 🐳 **Docker Ready** - Multi-stage Dockerfile & docker-compose for PostgreSQL + pgAdmin
- 📝 **Auto-generated API Docs** - Swagger/OpenAPI documentation
- 🛡️ **Type Safety** - Full TypeScript with Prisma type generation
- 🔍 **Global Error Handling** - Standardized error responses
- 📊 **Logging & Monitoring** - Request/response logging interceptor
- ✅ **Validation** - Class-validator with DTO transformation
- 🧪 **Testing Ready** - Jest configuration for unit & e2e tests
- 🔄 **Hot Reload** - Fast development with watch mode
- 🎨 **Code Quality** - ESLint, Prettier, EditorConfig
- 🔎 **Pagination & Search** - Built-in pagination and search capabilities

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) v11 (LTS)
- **ORM**: [Prisma](https://www.prisma.io/) v7.3 with TypedSQL & Extensions
- **Database**: [PostgreSQL](https://www.postgresql.org/) v16
- **Language**: [TypeScript](https://www.typescriptlang.org/) v5.7
- **Testing**: [Jest](https://jestjs.io/) v30
- **Documentation**: [Swagger/OpenAPI](https://swagger.io/)
- **Validation**: [class-validator](https://github.com/typestack/class-validator)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📁 Project Structure

```
nest-prisma-template/
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   └── prisma.config.ts        # Prisma configuration
├── src/
│   ├── common/                 # Shared utilities
│   │   ├── decorators/         # Custom decorators
│   │   ├── filters/            # Exception filters
│   │   ├── guards/             # Authorization guards
│   │   └── interceptors/       # Request/response interceptors
│   ├── config/                 # Configuration modules
│   │   ├── app.config.ts       # App configuration
│   │   ├── database.config.ts  # Database configuration
│   │   ├── jwt.config.ts       # JWT configuration
│   │   └── swagger.config.ts   # Swagger configuration
│   ├── infra/                  # Infrastructure layer
│   │   └── database/
│   │       └── prisma/         # Prisma service & module
│   ├── modules/                # Feature modules (DDD)
│   │   └── users/              # User domain
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── entities/       # Domain entities
│   │       ├── users.controller.ts
│   │       ├── users.service.ts
│   │       └── users.module.ts
│   ├── app.module.ts           # Root module
│   └── main.ts                 # Application entry point
├── test/                       # E2E tests
├── .env.example                # Environment variables template
├── .editorconfig               # Editor configuration
├── .prettierrc                 # Prettier configuration
├── docker-compose.yml          # Docker services configuration
├── Dockerfile                  # Multi-stage Docker build
├── nest-cli.json               # NestJS CLI configuration
├── package.json                # Dependencies & scripts
└── tsconfig.json               # TypeScript configuration
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.x
- pnpm >= 8.x
- Docker & Docker Compose (optional, for containerized setup)
- Make (optional, for using Makefile commands)

### Quick Start (Using Makefile) ⚡

The easiest way to get started is using the Makefile commands:

1. **Clone the repository**
```bash
git clone <repository-url>
cd nest-prisma-template
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configurations
```

3. **Run first-time setup** (installs deps, starts Docker, sets up database)
```bash
make setup
```

4. **Start development server**
```bash
make dev
```

That's it! Your application is now running at `http://localhost:3000/api` 🎉

**Available Make commands:**
- `make help` - Show all available commands
- `make setup` - First-time setup (install deps, start docker, setup database)
- `make db-reset` - Reset database (drop, create, migrate, seed)
- `make dev` - Start development server
- `make test` - Run tests
- `make db-studio` - Open Prisma Studio
- See `make help` for all commands

### Manual Installation

If you prefer not to use Make, follow these steps:

1. **Clone the repository**
```bash
git clone <repository-url>
cd nest-prisma-template
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. **Start PostgreSQL with Docker** (recommended)
```bash
docker-compose up -d
```

Alternatively, use your local PostgreSQL and update `DATABASE_URL` in `.env`

5. **Generate Prisma Client**
```bash
pnpm run generate
```

6. **Run database migrations**
```bash
pnpm run migrate:dev
```

7. **Seed the database** (optional)
```bash
pnpm run seed
```

8. **Start the development server**
```bash
pnpm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`

> 📘 **Prisma 7 Migration**: This project uses Prisma 7. See [PRISMA7_MIGRATION.md](./PRISMA7_MIGRATION.md) for details on new features and breaking changes.

## 📜 Available Scripts

### Development
```bash
pnpm start:dev          # Start in watch mode
pnpm start:debug        # Start in debug mode
pnpm start:prod         # Start production build
```

### Building
```bash
pnpm build              # Build for production
```

### Code Quality
```bash
pnpm lint               # Lint and fix code
pnpm format             # Format code with Prettier
```

### Testing
```bash
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Generate coverage report
pnpm test:e2e           # Run e2e tests
```

### Prisma
```bash
pnpm prisma:generate    # Generate Prisma Client
pnpm prisma:migrate     # Run migrations
pnpm prisma:push        # Push schema to database
pnpm prisma:studio      # Open Prisma Studio (GUI)
```

### Docker
```bash
pnpm docker:up          # Start Docker services
pnpm docker:down        # Stop Docker services
pnpm docker:logs        # View Docker logs
```

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nest_prisma_db?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
JWT_REFRESH_EXPIRATION=30d

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH=api-docs

# Logging
LOG_LEVEL=debug
```

## 📚 API Documentation

When `SWAGGER_ENABLED=true`, interactive API documentation is available at:

```
http://localhost:3000/api-docs
```

### Example Endpoints

#### Health Check
```bash
GET /health
```

#### Users
```bash
POST   /api/v1/users          # Create user
GET    /api/v1/users          # List all users
GET    /api/v1/users/:id      # Get user by ID
PATCH  /api/v1/users/:id      # Update user
DELETE /api/v1/users/:id      # Delete user
```

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

Start all services (PostgreSQL + pgAdmin):
```bash
docker-compose up -d
```

Access services:
- **PostgreSQL**: `localhost:5432`
- **pgAdmin**: `http://localhost:5050`
  - Email: `admin@admin.com`
  - Password: `admin`

### Building Docker Image

```bash
# Build
docker build -t nest-prisma-app .

# Run
docker run -p 3000:3000 --env-file .env nest-prisma-app
```

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm test:e2e
```

### Coverage Report
```bash
pnpm test:cov
```

## 🏛️ Architecture

This boilerplate follows **Clean Architecture** and **Domain-Driven Design** principles:

- **Separation of Concerns**: Clear boundaries between layers
- **Dependency Rule**: Dependencies point inward
- **Independent of Frameworks**: Business logic is framework-agnostic
- **Testable**: Easy to test with mock dependencies
- **Independent of UI/Database**: Can swap implementations

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## ✅ Best Practices

### 🎯 DRY & Modular
- Modules are clearly separated and decoupled
- Shared utilities in `common/`
- Reusable decorators, filters, and interceptors

### 🔒 Security First
- Password hashing with bcrypt
- JWT authentication ready
- CORS configuration
- Global validation pipe
- Security headers (add helmet in production)

### 💻 Developer Experience
- **Plug & Play**: Docker setup works out of the box
- **Type Safe**: Prisma generates 100% type-safe database client
- **Hot Reload**: Instant feedback during development
- **Dev Tools**: ESLint, Prettier, EditorConfig pre-configured

### 📊 Production Ready
- Multi-stage Docker build (optimized size)
- Graceful shutdown handling
- Health check endpoints
- Structured logging
- Error tracking ready

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the UNLICENSED License.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [PostgreSQL](https://www.postgresql.org/) - The world's most advanced open source database

---

**Happy Coding! 🎉**

For questions or issues, please open an issue on GitHub.
