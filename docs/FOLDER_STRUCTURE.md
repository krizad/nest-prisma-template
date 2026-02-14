# 📂 Complete Folder Structure

## Full Project Tree

```text
nest-prisma-template/
│
├── 📦 prisma/
│   ├── schema.prisma              # Database schema with User & Post models
│   ├── seed.ts                    # Seed script
│   └── prisma.config.ts           # Prisma v7 configuration
│
├── 📁 src/
│   │
│   ├── 🔧 common/                 # Shared utilities & cross-cutting concerns
│   │   ├── decorators/
│   │   │   ├── api-standard-response.decorator.ts  # Swagger response decorator
│   │   │   ├── current-user.decorator.ts          # Extract current user
│   │   │   ├── roles.decorator.ts                 # Role-based access control
│   │   │   ├── public.decorator.ts                # Public routes
│   │   │   ├── skip-log.decorator.ts              # Skip logging
│   │   │   ├── skip-warp.decorator.ts             # Skip response wrapping
│   │   │   └── index.ts
│   │   ├── constant/
│   │   │   ├── app.constants.ts                   # App constants
│   │   │   ├── error.constants.ts                 # Error constants
│   │   │   └── index.ts
│   │   ├── exceptions/
│   │   │   ├── app-error.exception.ts             # App error exception
│   │   │   └── index.ts
│   │   ├── dto/
│   │   │   ├── pagination-query.dto.ts             # Shared pagination DTO
│   │   │   └── index.ts
│   │   ├── filters/
│   │   │   ├── unified-error.filter.ts            # Unified error + Prisma error mapping
│   │   │   └── index.ts
│   │   ├── guards/
│   │   │   ├── roles.guard.ts                     # Authorization guard
│   │   │   ├── jwt-auth.guard.ts                  # JWT auth guard
│   │   │   └── index.ts
│   │   ├── interceptors/
│   │   │   ├── api-response.interceptor.ts        # Standard API responses
│   │   │   ├── logging.interceptor.ts             # Request/response logging
│   │   │   └── index.ts
│   │   ├── middleware/
│   │   │   ├── request-id.middleware.ts            # x-request-id generation
│   │   │   └── index.ts
│   │   ├── model/
│   │   │   └── response/
│   │   │       ├── factories.ts                   # Response factories
│   │   │       ├── list-result.dto.ts             # List response DTO
│   │   │       ├── response-base.dto.ts           # Base response DTO
│   │   │       └── index.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts                    # JWT strategy
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── pagination.ts                      # Pagination types
│   │   └── index.ts
│   │
│   ├── ⚙️  config/                # Configuration modules
│   │   ├── interfaces/
│   │   │   └── config.interface.ts                # Config type definitions
│   │   ├── app.config.ts                          # App settings
│   │   ├── database.config.ts                     # Database settings
│   │   ├── jwt.config.ts                          # JWT settings
│   │   ├── swagger.config.ts                      # Swagger settings
│   │   ├── throttle.config.ts                     # Rate limiting settings
│   │   ├── env.validation.ts                      # Env validation with class-validator
│   │   └── index.ts
│   │
│   ├── 🏗️  infra/                 # Infrastructure layer
│   │   └── database/
│   │       └── prisma/
│   │           ├── extensions/
│   │           │   ├── logging.extension.ts       # Prisma logging extension
│   │           │   ├── soft-delete.extension.ts   # Soft delete extension
│   │           │   └── index.ts
│   │           ├── prisma.service.ts              # Prisma client wrapper
│   │           ├── prisma.module.ts               # Global Prisma module
│   │           └── index.ts
│   │
│   ├── 📦 modules/                # Feature modules (DDD domains)
│   │   ├── auth/                  # Auth domain
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts                    # Login validation
│   │   │   │   ├── login-response.dto.ts           # Login response DTO
│   │   │   │   ├── refresh-token.dto.ts            # Refresh token DTO
│   │   │   │   └── index.ts
│   │   │   ├── auth.controller.ts                  # Auth endpoints
│   │   │   ├── auth.service.ts                     # Auth business logic
│   │   │   ├── auth.service.spec.ts                # Auth unit tests
│   │   │   └── auth.module.ts                      # Auth module
│   │   └── users/                 # User domain example
│   │       ├── dto/
│   │       │   ├── create-user.dto.ts             # Create user validation
│   │       │   ├── update-user.dto.ts             # Update user validation
│   │       │   ├── user.dto.ts                     # User response DTO
│   │       │   └── index.ts
│   │       ├── entities/
│   │       │   ├── user.entity.ts                 # User entity (response)
│   │       │   └── index.ts
│   │       ├── users.controller.ts                # User endpoints
│   │       ├── users.service.ts                   # User business logic
│   │       ├── users.service.spec.ts              # User unit tests
│   │       └── users.module.ts                    # User module
│   │
│   ├── app.controller.spec.ts                     # App controller tests
│   ├── app.controller.ts                          # Root controller
│   ├── app.module.ts                              # Root module
│   ├── app.service.ts                             # Root service
│   └── main.ts                                    # Application entry point
│
├── 🧪 test/                       # E2E tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── 🧱 dist/                        # Build output

├── 🐳 Docker Files
│   ├── Dockerfile                                 # Multi-stage optimized build
│   ├── .dockerignore                              # Docker ignore rules
│   └── docker-compose.yml                         # PostgreSQL + pgAdmin
│
├── ⚙️  Configuration Files
│   ├── .editorconfig                              # Editor configuration
│   ├── .env                                       # Local environment
│   ├── .env.example                               # Environment template
│   ├── .gitignore                                 # Git ignore rules
│   ├── .nvmrc                                     # Node version (20)
│   ├── .prettierrc                                # Prettier config
│   ├── commitlint.config.mjs                      # Conventional commits
│   ├── eslint.config.mjs                          # ESLint config
│   ├── prisma.config.ts                           # Prisma config entry
│   ├── nest-cli.json                              # NestJS CLI config
│   ├── tsconfig.json                              # TypeScript config (strict)
│   └── tsconfig.build.json                        # Build TS config
│
├── 🔧 Git Hooks (Husky)
│   ├── .husky/pre-commit                          # lint-staged on commit
│   └── .husky/commit-msg                          # Commitlint check
│
├── 🚀 CI/CD
│   └── .github/workflows/ci.yml                   # GitHub Actions pipeline
│
├── 📦 Dependencies
│   ├── package.json                               # Dependencies & scripts
│   ├── pnpm-lock.yaml                             # Lock file
│   └── pnpm-workspace.yaml                        # Workspace settings
│
├── 🧰 Tooling
│   └── Makefile                                   # Task shortcuts
│
└── 📚 docs/                        # Documentation
    ├── SIMPLIFIED_README.md                        # Simplified guide
    ├── QUICKSTART.md                               # Quickstart steps
    ├── ARCHITECTURE.md                             # Architecture guide
    ├── JWT_CONFIGURATION.md                        # JWT setup details
    ├── PRISMA7_MIGRATION.md                        # Prisma v7 migration notes
    ├── ENHANCEMENTS.md                             # Enhancements backlog
    └── FOLDER_STRUCTURE.md                         # Folder structure guide
```

## Module Organization (DDD Pattern)

### Current Modules

- ✅ **Auth Module**: Login flow with DTOs and responses
- ✅ **Users Module**: Complete CRUD with validation, entities, and DTOs

### Template for New Modules

```text
src/modules/{domain}/
├── dto/                     # Data Transfer Objects
│   ├── create-{entity}.dto.ts
│   ├── update-{entity}.dto.ts
│   └── index.ts
├── entities/                # Domain entities
│   ├── {entity}.entity.ts
│   └── index.ts
├── {domain}.controller.ts   # HTTP endpoints
├── {domain}.service.ts      # Business logic
└── {domain}.module.ts       # Module definition
```

## Key Features Implemented

### ✅ Configuration Layer

- Modular configuration with @nestjs/config
- Type-safe config interfaces
- Environment-based settings

### ✅ Common Utilities

- **Filters**: Global exception handling with Prisma error mapping
- **Interceptors**: Logging and response transformation
- **Guards**: Role-based authorization
- **Decorators**: CurrentUser, Roles, API responses

### ✅ Infrastructure

- Prisma service with lifecycle hooks
- Connection management
- Database cleanup utility (for testing)

### ✅ API Features

- Global validation pipe
- Swagger/OpenAPI documentation
- CORS configuration
- API versioning
- Graceful shutdown

### ✅ Development Tools

- Docker Compose for local development
- Multi-stage Dockerfile for production
- ESLint + Prettier + EditorConfig
- Jest for testing
- Hot reload in development

## File Count by Layer

```text
📊 Statistics (approx):
├── Configuration Files:    12
├── Common Utilities:       26
├── Config Modules:         6
├── Infrastructure:         6
├── Domain Modules:         14 (Auth + Users)
├── Root Files:             8
├── Documentation:          8
└── Total Files:           ~80
```

## Next Steps

### To Add New Features

1. Create new module in `src/modules/{domain}`
2. Define Prisma schema in `prisma/schema.prisma`
3. Generate Prisma client: `pnpm prisma:generate`
4. Create DTOs, entities, service, and controller
5. Register module in `app.module.ts`

### To Deploy

1. Build Docker image: `docker build -t app .`
2. Set environment variables
3. Run migrations: `pnpm prisma:migrate`
4. Start application: `pnpm start:prod`

---

This structure provides a solid foundation for scalable, maintainable NestJS applications. 🚀
