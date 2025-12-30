# 🔴 SECURITY CRITICAL ACTIONS - MUST FIX BEFORE PRODUCTION

**Date**: 2025-12-30
**Status**: ⚠️ BLOCKING DEPLOYMENT
**Priority**: P0 - Critical

---

## Issue 1: Exposed Secrets in Git History 🔴

**Severity**: CRITICAL - Complete auth/AWS compromise possible

**Problem**:

- `.env` file with JWT_SECRET and S3 credentials was committed to git
- Even though `.gitignore` now excludes it, secrets are in git history
- Anyone with repo access can extract credentials

**Affected Files**:

```
apps/backend/.env (lines 18-36)
- JWT_SECRET
- S3_ACCESS_KEY
- S3_SECRET_KEY
```

**Immediate Actions Required**:

### 1. Rotate ALL Secrets (URGENT - Do within 24 hours)

```bash
# Generate new JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# AWS: Rotate S3 credentials
# 1. Go to AWS IAM Console
# 2. Delete access key: AKIAVSROV5BS5UTQULM4
# 3. Create new access key
# 4. Update .env with new credentials
```

### 2. Remove from Git History

**Option A: BFG Repo-Cleaner (Recommended)**

```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Backup repo first!
cp -r Realestate_Vietnam Realestate_Vietnam_backup

# Remove .env from history
java -jar bfg.jar --delete-files .env Realestate_Vietnam

# Clean up
cd Realestate_Vietnam
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: Breaks history for collaborators)
git push origin --force --all
```

**Option B: Filter-Branch (Alternative)**

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch apps/backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

### 3. Notify Team

⚠️ **IMPORTANT**: If repo is shared:

- Notify all developers that repo history was rewritten
- They MUST re-clone the repository
- Old clones will have the exposed secrets

### 4. Verify Secrets Are Safe

```bash
# Check if .env still in history
git log --all --full-history -- "apps/backend/.env"

# Should return empty if successful
```

---

## Issue 2: localStorage Token Storage 🔴

**Severity**: CRITICAL - XSS allows token theft

**Problem**:

- Access tokens stored in `localStorage`
- Vulnerable to XSS attacks
- Malicious script can steal tokens → full account takeover

**Current Implementation**:

```typescript
// apps/frontend/src/services/auth.service.ts
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);
```

**Required Fix**: Migrate to httpOnly Cookies

**Implementation Steps**:

### 1. Backend: Set Cookies Instead of Returning Tokens

```typescript
// apps/backend/src/modules/auth/auth.controller.ts
@Post('login')
async login(
  @Body() loginDto: LoginDto,
  @Res({ passthrough: true }) response: Response,
) {
  const tokens = await this.authService.login(loginDto);

  // Set httpOnly cookies
  response.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  response.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return { success: true };
}
```

### 2. Frontend: Remove localStorage Usage

```typescript
// apps/frontend/src/services/auth.service.ts
async login(data: LoginData): Promise<void> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Send cookies
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Login failed');

  // No manual token storage needed - cookies handled automatically
  await this.getCurrentUser();
}
```

### 3. Update All API Calls to Send Cookies

```typescript
// All fetch calls need credentials: 'include'
fetch(url, {
  credentials: 'include',
  // ... other options
});
```

### 4. Backend: Read Tokens from Cookies

```typescript
// apps/backend/src/modules/auth/guards/jwt-auth.guard.ts
// Update JwtStrategy to extract token from cookies instead of Authorization header
```

**Estimated Effort**: 4-6 hours

---

## Issue 3: Missing Rate Limiting 🔴

**Severity**: HIGH - Brute-force attacks possible

**Problem**:

- No rate limiting on `/auth/login`, `/auth/register`
- Attackers can brute-force passwords
- Can enumerate valid emails/phones

**Required Fix**: Add Rate Limiting

**Implementation**:

### 1. Install Dependencies

```bash
cd apps/backend
pnpm add @nestjs/throttler
```

### 2. Configure Throttler

```typescript
// apps/backend/src/app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 5, // 5 requests per minute
      },
    ]),
    // ... other imports
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // ... other providers
  ],
})
```

### 3. Apply Stricter Limits to Auth Endpoints

```typescript
// apps/backend/src/modules/auth/auth.controller.ts
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  @Post('login')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 attempts per minute
  async login(@Body() loginDto: LoginDto) {
    // ...
  }

  @Post('register')
  @Throttle({ default: { limit: 2, ttl: 300000 } }) // 2 registrations per 5 minutes
  async register(@Body() registerDto: RegisterDto) {
    // ...
  }
}
```

**Estimated Effort**: 1-2 hours

---

## Additional High-Priority Items

### 4. Password Complexity Validation

**Current**: Accepts weak passwords like "12345678"

**Fix**:

```typescript
// apps/backend/src/modules/auth/dto/register.dto.ts
@IsStrongPassword({
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
}, {
  message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol'
})
password?: string;
```

### 5. Add .env.example Template

```bash
# Create template without real secrets
cp apps/backend/.env apps/backend/.env.example

# Replace real values with placeholders
# Edit .env.example:
JWT_SECRET=your-super-secret-jwt-key-min-64-chars
S3_ACCESS_KEY=YOUR_AWS_ACCESS_KEY
S3_SECRET_KEY=YOUR_AWS_SECRET_KEY

# Commit .env.example
git add apps/backend/.env.example
git commit -m "Add .env.example template"
```

---

## Implementation Priority

**Week 1** (MUST DO):

1. ✅ Rotate JWT_SECRET immediately
2. ✅ Rotate AWS S3 credentials
3. ✅ Remove .env from git history
4. ⏳ Implement httpOnly cookies (4-6 hours)
5. ⏳ Add rate limiting (1-2 hours)

**Week 2** (SHOULD DO): 6. Add password complexity validation 7. Add CORS configuration 8. Add input sanitization for XSS 9. Improve OTP storage (Redis instead of memory)

**Week 3** (NICE TO HAVE): 10. Add 2FA/MFA support 11. Add account lockout after failed attempts 12. Add security audit logging 13. Add penetration testing

---

## Testing After Fixes

### 1. Test httpOnly Cookies

```bash
# Login and check cookies in DevTools
# Should see: accessToken, refreshToken (HttpOnly: ✓)
# localStorage should be empty
```

### 2. Test Rate Limiting

```bash
# Try 10 login attempts rapidly
# Should get 429 Too Many Requests after 3 attempts
```

### 3. Test Secrets Rotation

```bash
# Old JWT tokens should be invalid
# Old S3 uploads should fail
# New tokens and uploads should work
```

---

## Sign-off Checklist

Before deploying to production:

- [ ] JWT_SECRET rotated and removed from git history
- [ ] S3 credentials rotated and removed from git history
- [ ] All team members notified about repo rewrite
- [ ] httpOnly cookies implemented and tested
- [ ] Rate limiting configured and tested
- [ ] Password complexity validation added
- [ ] .env.example created and committed
- [ ] Security audit passed
- [ ] Penetration test completed
- [ ] Incident response plan documented

---

## Contact

**Security Lead**: [Your Name]
**Escalation**: [Manager Name]
**AWS Account Admin**: [Admin Name]

**Report Security Issues**: security@yourcompany.com

---

**Last Updated**: 2025-12-30
**Next Review**: After fixes implemented
