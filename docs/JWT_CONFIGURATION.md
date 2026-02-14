# JWT Configuration Guide

This template now supports optional JWT token validation that can be easily enabled or disabled via environment variables.

## Configuration

### Enable/Disable JWT Validation

Control JWT validation globally using the `JWT_ENABLED` environment variable:

```env
# Enable JWT validation (default: true)
JWT_ENABLED=true

# Disable JWT validation (allow all requests without authentication)
JWT_ENABLED=false
```

**Default Behavior:** JWT validation is **enabled by default** (`JWT_ENABLED` defaults to `true`)

### JWT Token Configuration

When JWT is enabled, configure the following environment variables:

```env
# JWT Secret key for signing tokens (required when JWT is enabled)
JWT_SECRET=your-secret-key-change-in-production

# JWT token expiration time (default: 7d)
JWT_EXPIRATION=7d

# JWT Refresh secret key
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production

# JWT Refresh token expiration time (default: 30d)
JWT_REFRESH_EXPIRATION=30d
```

## Usage Examples

### Development with JWT Disabled

```env
# .env.local
NODE_ENV=development
PORT=3000
JWT_ENABLED=false
```

This allows you to:
- Test endpoints without providing authentication tokens
- Develop features without JWT complexity
- Quickly prototype API endpoints

### Production with JWT Enabled

```env
# .env
NODE_ENV=production
PORT=3000
JWT_ENABLED=true
JWT_SECRET=your-production-secret-key
JWT_REFRESH_SECRET=your-production-refresh-secret-key
JWT_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=30d
```

## How It Works

### When JWT is Enabled (`JWT_ENABLED=true`)

1. The `JwtAuthGuard` is active and validates JWT tokens on all protected routes
2. Routes decorated with `@Public()` can be accessed without authentication
3. All other routes require a valid JWT token in the `Authorization` header

Example:
```typescript
@Controller('users')
export class UsersController {
  @Get()
  getUsers() {
    // Protected - requires JWT token
  }

  @Get('public')
  @Public()
  getPublicInfo() {
    // Public - no JWT required
  }
}
```

### When JWT is Disabled (`JWT_ENABLED=false`)

1. All routes are treated as public
2. The `JwtAuthGuard` bypasses all authentication checks
3. Useful for development and testing without authentication

## Files Modified

- `src/config/jwt.config.ts` - Added `enabled` flag configuration
- `src/config/interfaces/config.interface.ts` - Updated `JwtConfig` interface
- `src/common/guards/jwt-auth.guard.ts` - Added JWT enabled check

## Best Practices

1. **Production:** Always set `JWT_ENABLED=true` with strong secret keys
2. **Development:** Use `JWT_ENABLED=false` for faster development cycles
3. **Testing:** Use `JWT_ENABLED=false` to simplify test setup
4. **Staging:** Use `JWT_ENABLED=true` to match production environment

## Migration from Previous Versions

This change is **backward compatible**. Existing code without the `JWT_ENABLED` variable will work with JWT enabled by default.

To disable JWT validation without changing existing code:
```bash
export JWT_ENABLED=false
npm run start
```

## Example .env Files

### .env.local (Development)
```env
NODE_ENV=development
PORT=3000
JWT_ENABLED=false
DATABASE_URL=postgresql://...
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### .env (Production)
```env
NODE_ENV=production
PORT=3000
JWT_ENABLED=true
JWT_SECRET=your-strong-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-strong-refresh-secret-min-32-chars
JWT_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=30d
DATABASE_URL=postgresql://...
CORS_ORIGINS=https://yourdomain.com
```
