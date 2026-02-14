# Architecture Documentation 🏗️

## Table of Contents

- [Overview](#overview)
- [Architecture Principles](#architecture-principles)
- [Folder Structure](#folder-structure)
- [Data Flow](#data-flow)
- [Layer Descriptions](#layer-descriptions)
- [Design Patterns](#design-patterns)
- [Why This Pattern?](#why-this-pattern)
- [Adding New Features](#adding-new-features)

## Overview

This boilerplate follows **Clean Architecture** and **Domain-Driven Design (DDD)** principles to create a maintainable, scalable, and testable application structure.

### Key Benefits:

- 📦 **Modular**: Each feature is self-contained in its own module
- 🔄 **Maintainable**: Clear separation of concerns makes changes easier
- 🧪 **Testable**: Dependencies are injected, making unit testing straightforward
- 📈 **Scalable**: Easy to add new features without affecting existing code
- 🔒 **Type-Safe**: Full TypeScript + Prisma type generation

## Architecture Principles

### 1. Clean Architecture

Clean Architecture divides the system into layers with clear responsibilities:

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (Controllers)     │
│  HTTP Request → Validation → Authorization  │
├─────────────────────────────────────────────┤
│          Application Layer (Services)        │
│    Business Logic → Use Cases → DTOs        │
├─────────────────────────────────────────────┤
│         Domain Layer (Entities)              │
│         Business Entities & Rules            │
├─────────────────────────────────────────────┤
│      Infrastructure Layer (Prisma)           │
│    Database → External APIs → Services      │
└─────────────────────────────────────────────┘
```

**Dependency Rule**: Dependencies point inward. Outer layers depend on inner layers, never the reverse.

### 2. Domain-Driven Design (DDD)

DDD organizes code around business domains:

- **Modules**: Each business domain has its own module (e.g., users, orders, payments)
- **Entities**: Core business objects with identity
- **DTOs**: Data Transfer Objects for API contracts
- **Services**: Business logic implementation

## Folder Structure

```
src/
├── common/                    # Shared utilities across the application
│   ├── decorators/            # Custom decorators
│   │   ├── current-user.decorator.ts      # Get current user from request
│   │   ├── roles.decorator.ts             # Define required roles
│   │   └── api-standard-response.decorator.ts  # Standard API responses
│   ├── filters/               # Exception filters
│   │   └── all-exceptions.filter.ts       # Global error handling
│   ├── guards/                # Authorization guards
│   │   └── roles.guard.ts                 # Role-based access control
│   └── interceptors/          # Request/response interceptors
│       ├── logging.interceptor.ts         # Request/response logging
│       └── transform.interceptor.ts       # Response transformation
│
├── config/                    # Configuration modules
│   ├── app.config.ts          # Application settings (port, API prefix)
│   ├── database.config.ts     # Database connection settings
│   ├── jwt.config.ts          # JWT authentication settings
│   ├── swagger.config.ts      # API documentation settings
│   └── interfaces/
│       └── config.interface.ts  # Configuration type definitions
│
├── infra/                     # Infrastructure layer
│   └── database/
│       └── prisma/            # Prisma ORM integration
│           ├── prisma.service.ts   # Prisma client wrapper
│           └── prisma.module.ts    # Prisma module (Global)
│
├── modules/                   # Feature modules (DDD domains)
│   └── users/                 # User domain
│       ├── dto/               # Data Transfer Objects
│       │   ├── create-user.dto.ts   # Create user request
│       │   └── update-user.dto.ts   # Update user request
│       ├── entities/          # Domain entities
│       │   └── user.entity.ts       # User entity (response)
│       ├── users.controller.ts      # HTTP endpoints
│       ├── users.service.ts         # Business logic
│       └── users.module.ts          # Module definition
│
├── app.module.ts              # Root module
└── main.ts                    # Application entry point
```

## Data Flow

### Request → Response Flow

```
1. HTTP Request
   ↓
2. Controller (Presentation Layer)
   - Receives request
   - Validates with DTOs
   - Checks authorization
   ↓
3. Service (Application Layer)
   - Executes business logic
   - Calls infrastructure layer
   ↓
4. Prisma Service (Infrastructure Layer)
   - Interacts with database
   - Returns raw data
   ↓
5. Entity (Domain Layer)
   - Transforms data
   - Removes sensitive fields
   ↓
6. Interceptor
   - Transforms response format
   - Adds metadata
   ↓
7. HTTP Response
```

### Example: Create User Flow

```typescript
// 1. Request comes to controller
POST /api/v1/users
Body: { email: "user@example.com", password: "secret123" }

// 2. Controller validates and delegates
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}

// 3. Service executes business logic
async create(createUserDto: CreateUserDto) {
  // Check if user exists
  // Hash password
  // Save to database via Prisma
  const user = await this.prisma.user.create({...});
  return new UserEntity(user); // Remove password
}

// 4. Response interceptor transforms
{
  statusCode: 201,
  message: "Success",
  data: { id: "...", email: "...", ... },
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

## Layer Descriptions

### 1. Presentation Layer (Controllers)

**Responsibility**: Handle HTTP requests and responses

**Location**: `src/modules/*/**.controller.ts`

**Concerns**:
- Route definitions
- Request validation (DTOs)
- Authorization checks
- Swagger documentation

**Example**:
```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

### 2. Application Layer (Services)

**Responsibility**: Contain business logic and use cases

**Location**: `src/modules/*/**.service.ts`

**Concerns**:
- Business logic implementation
- Data transformation
- Calling infrastructure services
- Error handling

**Example**:
```typescript
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // Business logic here
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword }
    });
    return new UserEntity(user);
  }
}
```

### 3. Domain Layer (Entities)

**Responsibility**: Represent business concepts

**Location**: `src/modules/*/entities/`

**Concerns**:
- Domain objects
- Business rules
- Data transformation

**Example**:
```typescript
export class UserEntity {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
    delete (this as any).password; // Remove sensitive data
  }
}
```

### 4. Infrastructure Layer (Prisma)

**Responsibility**: Handle external dependencies

**Location**: `src/infra/`

**Concerns**:
- Database connections
- External APIs
- File systems
- Third-party services

**Example**:
```typescript
@Injectable()
export class PrismaService extends PrismaClient 
  implements OnModuleInit, OnModuleDestroy {
  
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

## Design Patterns

### 1. Dependency Injection

All dependencies are injected via constructors:

```typescript
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService
  ) {}
}
```

**Benefits**:
- Easy to test (mock dependencies)
- Loose coupling
- Better code organization

### 2. Repository Pattern

Prisma acts as a repository abstraction:

```typescript
// Instead of coupling to specific database
const user = await this.prisma.user.findUnique({ where: { id } });

// Can easily swap Prisma for another ORM
```

### 3. DTO Pattern

Data Transfer Objects for API contracts:

```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

**Benefits**:
- Validation at API boundary
- Clear API contracts
- Type safety

### 4. Module Pattern

Each feature is encapsulated in a module:

```typescript
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

## Why This Pattern?

### Problem: Monolithic Chaos

Traditional MVC applications often become:
- **Tightly Coupled**: Changes in one area break others
- **Hard to Test**: Business logic mixed with framework code
- **Difficult to Scale**: Adding features affects entire codebase
- **Poor Separation**: Database queries in controllers

### Solution: Clean Architecture + DDD

Our approach solves these issues:

✅ **Modular**: Each domain is isolated
✅ **Testable**: Easy to mock dependencies
✅ **Maintainable**: Clear responsibilities
✅ **Scalable**: Add features without breaking existing code
✅ **Type-Safe**: Prisma + TypeScript = 100% type safety

### Real-World Example

**Bad Approach** (Tightly Coupled):
```typescript
@Controller('users')
export class UsersController {
  @Post()
  async create(@Body() body: any) {
    // ❌ Business logic in controller
    // ❌ No validation
    // ❌ Direct database access
    const user = await db.user.create(body);
    return user;
  }
}
```

**Good Approach** (Clean Architecture):
```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) { // ✅ Validated DTO
    return this.usersService.create(createUserDto); // ✅ Delegate to service
  }
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // ✅ Business logic in service
    // ✅ Dependency injection
    // ✅ Returns entity (no sensitive data)
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword }
    });
    return new UserEntity(user);
  }
}
```

## Adding New Features

### Step-by-Step Guide

#### 1. Create Module Structure

```bash
# Generate module using NestJS CLI
nest g module modules/posts
nest g controller modules/posts
nest g service modules/posts
```

#### 2. Define Prisma Schema

```prisma
// prisma/schema.prisma
model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}
```

#### 3. Create DTOs

```typescript
// src/modules/posts/dto/create-post.dto.ts
export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;
}
```

#### 4. Create Entity

```typescript
// src/modules/posts/entities/post.entity.ts
export class PostEntity {
  id: string;
  title: string;
  content?: string;
  published: boolean;
  createdAt: Date;

  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
  }
}
```

#### 5. Implement Service

```typescript
// src/modules/posts/posts.service.ts
@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    const post = await this.prisma.post.create({
      data: { ...createPostDto, authorId: userId }
    });
    return new PostEntity(post);
  }
}
```

#### 6. Implement Controller

```typescript
// src/modules/posts/posts.controller.ts
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser('id') userId: string
  ) {
    return this.postsService.create(createPostDto, userId);
  }
}
```

#### 7. Register Module

```typescript
// src/app.module.ts
@Module({
  imports: [
    // ...
    PostsModule, // ✅ Add your module
  ],
})
export class AppModule {}
```

## Summary

This architecture provides:

- ✅ **Clear Separation**: Each layer has specific responsibilities
- ✅ **Maintainability**: Easy to locate and modify code
- ✅ **Testability**: Dependencies are mockable
- ✅ **Scalability**: Add features without breaking existing code
- ✅ **Type Safety**: Full TypeScript + Prisma coverage
- ✅ **Best Practices**: Following industry standards

For more information, see:
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

**Questions?** Open an issue on GitHub!
