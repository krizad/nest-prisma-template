# Prisma 7 Migration Guide

This project has been upgraded to **Prisma 7** with enhanced features and improved code quality.

## 🎯 What's New

### 1. **Prisma 7 Features**
- ✅ **TypedSQL** preview feature enabled for type-safe SQL queries
- ✅ **RelationJoins** for improved query performance
- ✅ **Soft Delete** extension with automatic filtering
- ✅ **Performance Monitoring** extension for query metrics
- ✅ **Enhanced Logging** with slow query detection

### 2. **Schema Enhancements**
- Added proper database types (`@db.Uuid`, `@db.VarChar`, `@db.Timestamptz`)
- Implemented soft delete with `deletedAt` fields
- Added comprehensive indexes for better query performance
- Introduced tagging system (Tag, PostTag models)
- Enhanced Post model with slug and view count

### 3. **Service Improvements**
- **Pagination** support in UsersService
- **Search** functionality with multiple filters
- **Better error handling** with proper logging
- **Statistics** endpoint for user analytics
- **Soft delete** and **restore** methods
- **Password verification** helper
- Increased bcrypt salt rounds to 12 for better security

### 4. **Database Seeding**
- Complete seed script with sample data
- Automated creation of admin, moderator, and regular users
- Sample posts and tags
- Run with: `pnpm run prisma:seed`

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm run prisma:generate

# Run migrations
pnpm run prisma:migrate

# Seed the database (optional)
pnpm run prisma:seed
```

### Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# Environment
NODE_ENV="development"

# Prisma Extensions Configuration
ENABLE_SLOW_QUERY_LOG=true
SLOW_QUERY_THRESHOLD_MS=1000

# Seeding
CLEAR_DB_BEFORE_SEED=false
```

## 📋 Breaking Changes from Prisma 6

### 1. Datasource URL Configuration
**Before (Prisma 6):**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**After (Prisma 7):**
```prisma
datasource db {
  provider = "postgresql"
}
```

The URL is now configured in `prisma/prisma.config.ts` and passed to PrismaClient constructor.

### 2. PrismaClient Initialization
**Before:**
```typescript
super({
  datasourceUrl: process.env.DATABASE_URL,
})
```

**After:**
```typescript
super({
  adapter: config.datasources?.db?.url 
    ? { url: config.datasources.db.url } 
    : undefined,
})
```

### 3. Preview Features
`omitApi` is no longer a preview feature - it's now built-in.

## 🔧 New Extensions

### Soft Delete Extension

Automatically filters out soft-deleted records:

```typescript
// Automatically excludes records where deletedAt IS NOT NULL
const users = await prisma.user.findMany();

// Soft delete (sets deletedAt instead of deleting)
await prisma.user.delete({ where: { id } });
```

### Logging Extension

Tracks query performance and logs slow queries:

```typescript
// Configure in environment variables
ENABLE_SLOW_QUERY_LOG=true
SLOW_QUERY_THRESHOLD_MS=1000
```

### Performance Extension

Collects query metrics:

```typescript
import { getMetrics, getAverageQueryTime } from './extensions/logging.extension';

// Get all metrics
const metrics = getMetrics();

// Get average query time
const avgTime = getAverageQueryTime('User', 'findMany');
```

## 📊 New API Features

### Pagination

```typescript
const result = await usersService.findAll(
  {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  {
    email: 'john',
    isActive: true,
  }
);

// Returns:
// {
//   data: UserEntity[],
//   meta: {
//     total: 100,
//     page: 1,
//     limit: 10,
//     totalPages: 10
//   }
// }
```

### Search

```typescript
const result = await usersService.findAll(
  undefined,
  {
    email: 'john',
    role: 'ADMIN',
    isActive: true,
  }
);
```

### Statistics

```typescript
const stats = await usersService.getStatistics();

// Returns:
// {
//   total: 150,
//   active: 120,
//   inactive: 30,
//   byRole: {
//     USER: 100,
//     ADMIN: 10,
//     MODERATOR: 40
//   }
// }
```

### Soft Delete & Restore

```typescript
// Soft delete
await usersService.softDelete(userId);

// Restore
await usersService.restore(userId);
```

## 🎨 Schema Features

### Comprehensive Indexes

All models now have proper indexes for:
- Primary lookups (email, slug)
- Filtering (isActive, published, deletedAt)
- Sorting (createdAt, publishedAt)
- Foreign keys

### Proper Database Types

```prisma
model User {
  id        String    @id @default(uuid()) @db.Uuid
  email     String    @unique @db.VarChar(255)
  createdAt DateTime  @default(now()) @db.Timestamptz(3)
}
```

## 📝 Scripts

```bash
# Development
pnpm run start:dev         # Start with auto-generate

# Prisma
pnpm run prisma:generate   # Generate client
pnpm run prisma:migrate    # Run migrations
pnpm run prisma:push       # Push schema changes
pnpm run prisma:studio     # Open Prisma Studio
pnpm run prisma:seed       # Seed database

# Docker
pnpm run docker:up         # Start containers
pnpm run docker:down       # Stop containers
pnpm run docker:logs       # View logs
```

## 🔐 Security Improvements

1. **Bcrypt salt rounds increased** from 10 to 12
2. **Better password handling** with proper error catching
3. **Input validation** with Prisma types
4. **SQL injection protection** via Prisma's query builder

## 📚 Additional Resources

- [Prisma 7 Documentation](https://www.prisma.io/docs)
- [Prisma 7 Release Notes](https://github.com/prisma/prisma/releases)
- [TypedSQL Guide](https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/typedsql)
- [Prisma Extensions](https://www.prisma.io/docs/orm/prisma-client/client-extensions)

## 🐛 Troubleshooting

### Issue: "adapter is not defined"
**Solution:** Make sure `prisma.config.ts` exports a valid config with datasources.

### Issue: Migration fails
**Solution:** Check your DATABASE_URL and ensure PostgreSQL is running.

### Issue: Slow queries
**Solution:** Check the logs for slow query warnings and add appropriate indexes.

---

**Enjoy building with Prisma 7! 🚀**
