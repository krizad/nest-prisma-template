# NestJS + Prisma Simplified Template 🚀

A clean and **beginner-friendly** NestJS boilerplate with Prisma ORM and PostgreSQL.

Perfect for learning NestJS or starting new projects quickly!

[![NestJS](https://img.shields.io/badge/NestJS-11.0-red.svg)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.4-2D3748.svg)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)

## ✨ Features

- ✅ **2 Simple Modules**: Auth (login) & Users (CRUD operations)
- ✅ **Simple Database**: Only `users` table with basic fields
- ✅ **Complete API Examples**: Create, Read, Update, Delete, List with pagination
- ✅ **Request/Response DTOs**: Separated input and output DTOs
- ✅ **ListResult DTO**: Generic pagination response with metadata
- ✅ **JWT Authentication**: Login endpoint and protected routes
- ✅ **Input Validation**: Email, password validation
- ✅ **Swagger API Docs**: Interactive API documentation
- ✅ **Error Handling**: Standardized error responses
- ✅ **Database Seeding**: Sample users included
- ✅ **Docker Ready**: PostgreSQL with Docker Compose
- ✅ **TypeScript**: Full type safety

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── login-response.dto.ts
│   └── users/
│       ├── users.service.ts
│       ├── users.controller.ts
│       └── dto/
│           ├── create-user.dto.ts
│           ├── update-user.dto.ts
│           └── user.dto.ts
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── model/response/
├── config/
└── infra/

prisma/
├── schema.prisma
├── seed.ts
└── migrations/
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL 14+
- Docker (optional)

### Installation

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env .env.local
   ```

3. **Setup database**
   ```bash
   # Run migrations
   pnpm prisma db push
   
   # Seed database
   pnpm seed
   ```

4. **Start development server**
   ```bash
   pnpm start:dev
   ```

Access the API at `http://localhost:3000/api`

### Docker Setup (Optional)

```bash
docker-compose up -d
```

## 📡 API Examples

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Password123!"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2025-02-13T00:00:00Z",
    "updatedAt": "2025-02-13T00:00:00Z"
  }
}
```

### Get All Users (Paginated)

```bash
curl "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2025-02-13T00:00:00Z",
      "updatedAt": "2025-02-13T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### Create User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Get User by ID

```bash
curl "http://localhost:3000/api/users/{id}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update User

```bash
curl -X PATCH "http://localhost:3000/api/users/{id}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

### Delete User

```bash
curl -X DELETE "http://localhost:3000/api/users/{id}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Available Scripts

```bash
# Development
pnpm start:dev       # Start with hot reload
pnpm start           # Start production build
pnpm build           # Build for production

# Database
pnpm prisma db push  # Apply schema changes
pnpm seed            # Seed database
pnpm prisma studio   # Open Prisma Studio UI

# Code Quality
pnpm lint            # Run ESLint
pnpm format          # Format with Prettier

# Testing
pnpm test            # Run unit tests
pnpm test:e2e        # Run E2E tests
```

## 🗂️ Database Schema

The template includes a simple `users` table:

```prisma
model User {
  id        String    @id @default(uuid()) @db.Uuid
  email     String    @unique
  password  String
  firstName String?
  lastName  String?
  role      UserRole  @default(USER)
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([email])
  @@map("users")
}

enum UserRole {
  USER
  ADMIN
}
```

## 🔐 Authentication

The template includes JWT authentication:

- **Login**: `POST /api/auth/login` - Get access token
- **Protected Routes**: Use `Authorization: Bearer TOKEN` header
- **JWT Config**: Edit `src/config/jwt.config.ts`

For public routes, use `@Public()` decorator.

## 📚 Key Files

- **DTOs**: `src/modules/*/dto/` - Request/response structures
- **Controllers**: `src/modules/*/\*.controller.ts` - API endpoints
- **Services**: `src/modules/*/\*.service.ts` - Business logic
- **Guards**: `src/common/guards/` - Authentication/authorization
- **Interceptors**: `src/common/interceptors/` - Response formatting
- **Database**: `prisma/schema.prisma` - Schema definition

## 🛠️ Expanding the Template

To add a new module:

1. Create `src/modules/your-module/` directory
2. Create `*.service.ts`, `*.controller.ts`, `*.module.ts`
3. Create `dto/` folder with request/response DTOs
4. Add to `src/app.module.ts` imports
5. Update `prisma/schema.prisma` with models
6. Run `pnpm prisma db push`

## 📖 Learn More

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📄 License

This project is licensed under the MIT License.
