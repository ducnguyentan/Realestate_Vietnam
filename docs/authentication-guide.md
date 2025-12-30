# Authentication & User Management Guide

**Project**: Realestate_Vietnam
**Version**: 1.0.0
**Last Updated**: 2025-12-30
**Status**: Authentication system complete, security hardening required

## Table of Contents

1. [Overview](#overview)
2. [User Types](#user-types)
3. [Registration Process](#registration-process)
4. [Login Process](#login-process)
5. [Protected Routes](#protected-routes)
6. [Dashboard Features](#dashboard-features)
7. [Profile Management](#profile-management)
8. [API Endpoints](#api-endpoints)
9. [Security Considerations](#security-considerations)
10. [Error Handling](#error-handling)
11. [Troubleshooting](#troubleshooting)

---

## Overview

The authentication system uses JWT (JSON Web Tokens) for stateless authentication with a two-token approach:

- **Access Token**: Short-lived (15 minutes), included in every request
- **Refresh Token**: Long-lived (30 days), used to obtain new access tokens

### Architecture

```
User Browser
    ↓
Frontend (Next.js)
    ├─ AuthContext (state management)
    ├─ ProtectedRoute component
    └─ Auth Service (API client)
    ↓
Backend API (NestJS)
    ├─ AuthController
    ├─ AuthService
    ├─ TokenService
    └─ JwtAuthGuard
    ↓
PostgreSQL Database
    └─ User + UserSettings tables
```

---

## User Types

The platform supports two primary user types, each with distinct roles and dashboards:

### Partner (Đăng ký BĐS)

**Purpose**: List and manage properties

**Capabilities**:

- Create new property listings
- Edit existing listings
- Delete listings (soft delete)
- View leads/inquiries from buyers
- Track property performance metrics
- Upload property images
- Manage property status (draft → published)

**Dashboard Access**: `/dashboard/partner`

**API Roles**: `Seller`, `Agent`, `Broker`

### Buyer (Tìm kiếm BĐS)

**Purpose**: Search and inquire about properties

**Capabilities**:

- Search properties by location, price, type
- View property details
- Save favorite properties
- Send inquiries to sellers
- Track inquiry status
- View property history

**Dashboard Access**: `/dashboard/buyer`

**API Roles**: `Buyer`, `Tenant`, `Investor`

---

## Registration Process

### Flow Diagram

```
User selects user type (Partner/Buyer)
    ↓
Enters contact details (Email or Phone)
    ↓
Sets password + uploads avatar
    ↓
API: POST /auth/register
    ├─ Validate UserType enum
    ├─ Hash password (bcrypt)
    ├─ Upload avatar to S3
    ├─ Create User record
    ├─ Store userType in settings
    └─ Generate tokens
    ↓
Return Access Token + Refresh Token
    ↓
Frontend stores tokens
    ↓
Redirect to respective dashboard
```

### Registration API

**Endpoint**: `POST /auth/register`

**Request Body**:

```typescript
{
  email?: string;           // Optional if phone provided
  phone?: string;           // Optional if email provided (+84XXXXXXXXX format)
  password?: string;        // 8+ characters (plain text, will be hashed)
  fullName: string;         // Required, min 2 characters
  userType: 'partner' | 'buyer'; // Required, determines dashboard
}
```

**Response**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "partner@example.com",
  "fullName": "Nguyễn Văn A",
  "userType": "partner",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

### Implementation Example (Frontend)

```typescript
// apps/frontend/src/services/auth.service.ts
async register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: data.email,
      phone: data.phone,
      password: data.password,
      fullName: data.fullName,
      userType: data.userType, // 'partner' or 'buyer'
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}
```

---

## Login Process

### Flow Diagram

```
User enters credentials (Email/Phone + Password)
    ↓
API: POST /auth/login
    ├─ Find user by email or phone
    ├─ Compare password (bcrypt)
    ├─ Retrieve userType from settings
    └─ Generate token pair
    ↓
Return Access Token + Refresh Token + User profile
    ↓
Frontend stores tokens in secure storage
    ↓
Redirect to appropriate dashboard (partner/buyer)
```

### Login API

**Endpoint**: `POST /auth/login`

**Request Body**:

```json
{
  "email": "partner@example.com",
  "password": "SecurePassword123"
}
```

**Response**:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "partner@example.com",
    "fullName": "Nguyễn Văn A",
    "avatar": "https://s3.amazonaws.com/avatars/...",
    "userType": "partner"
  },
  "expiresIn": 900
}
```

### Token Refresh

When access token expires (15 minutes), use refresh token to get new tokens:

**Endpoint**: `POST /auth/refresh`

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

---

## Protected Routes

### Route Protection Implementation

**Component**: `apps/frontend/src/components/auth/ProtectedRoute.tsx`

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'partner' | 'buyer'; // Optional: restrict by user type
  requiredRoles?: string[];                // Optional: restrict by roles
}

export function ProtectedRoute({
  children,
  requiredUserType,
  requiredRoles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (!user) {
    return redirect('/login');
  }

  if (requiredUserType && user.userType !== requiredUserType) {
    return <Unauthorized userType={user.userType} />;
  }

  if (requiredRoles && !requiredRoles.some(role => user.roles?.includes(role))) {
    return <Unauthorized />;
  }

  return children;
}
```

### Route Structure

```
/                    # Landing page (public)
├─ /login           # Login page (public)
├─ /register        # Registration page (public)
└─ /dashboard       # Protected (requires auth)
   ├─ /partner      # Partner-only dashboard
   │  ├─ /listings  # Manage listings
   │  └─ /leads     # View leads/inquiries
   ├─ /buyer        # Buyer-only dashboard
   │  ├─ /search    # Search properties
   │  └─ /favorites # Saved properties
   └─ /profile      # User profile (all authenticated users)
```

---

## Dashboard Features

### Partner Dashboard (`/dashboard/partner`)

**Access Control**: Restricted to users with `userType === 'partner'`

**Features**:

1. **My Listings**
   - List all properties owned by partner
   - Edit listing details, images, pricing
   - Change listing status (draft, published, sold, archived)
   - View quality score
   - Delete listing (soft delete)

2. **Leads & Inquiries**
   - View all leads for properties
   - Filter by property, date, status
   - Respond to inquiries
   - Convert lead to deal

3. **Statistics**
   - Total listings count
   - Published vs draft
   - Inquiries this month
   - Views per property

4. **Settings**
   - Update profile info
   - Change avatar
   - Manage contact methods
   - Notification preferences

### Buyer Dashboard (`/dashboard/buyer`)

**Access Control**: Restricted to users with `userType === 'buyer'`

**Features**:

1. **Search & Browse**
   - Advanced search by location, price range, property type
   - Filter by area, bedrooms, amenities
   - Sort by newest, price, distance

2. **Saved Properties**
   - Mark properties as favorite
   - View list of saved properties
   - Create saved searches

3. **My Inquiries**
   - View sent inquiries
   - Track inquiry status
   - View seller responses
   - Schedule viewings

4. **Settings**
   - Update profile info
   - Change avatar
   - Manage search preferences
   - Notification settings

---

## Profile Management

### Get Current User

**Endpoint**: `GET /auth/me`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Response**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "phone": "+84912345678",
  "fullName": "Nguyễn Văn A",
  "avatar": "https://s3.amazonaws.com/avatars/550e8400.jpg",
  "userType": "partner",
  "roles": ["Seller", "Agent"],
  "isKycVerified": false,
  "createdAt": "2025-12-30T10:00:00Z"
}
```

### Update Profile

**Endpoint**: `PUT /users/profile`

**Request Body**:

```json
{
  "fullName": "Nguyễn Văn A",
  "phone": "+84912345678",
  "bio": "Professional real estate agent"
}
```

### Upload Avatar

**Endpoint**: `POST /auth/upload-avatar`

**Request** (multipart/form-data):

```
Content-Type: multipart/form-data

file: <image.jpg>
```

**Response**:

```json
{
  "avatar": "https://s3.amazonaws.com/avatars/550e8400-avatar-20251230.jpg",
  "message": "Avatar uploaded successfully"
}
```

**File Constraints**:

- Max size: 5MB
- Formats: JPG, PNG, WebP
- Stored in S3 with unique filename

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint              | Description                | Auth Required |
| ------ | --------------------- | -------------------------- | ------------- |
| POST   | `/auth/register`      | Create new account         | No            |
| POST   | `/auth/login`         | Login with credentials     | No            |
| POST   | `/auth/refresh`       | Get new token pair         | No            |
| POST   | `/auth/logout`        | Invalidate current session | Yes           |
| GET    | `/auth/me`            | Get current user profile   | Yes           |
| POST   | `/auth/validate`      | Verify token validity      | No            |
| POST   | `/auth/verify-otp`    | Verify OTP code            | No            |
| POST   | `/auth/upload-avatar` | Upload profile picture     | Yes           |

### User Endpoints

| Method | Endpoint                 | Description                 | Auth Required |
| ------ | ------------------------ | --------------------------- | ------------- |
| GET    | `/users/profile`         | Get user profile            | Yes           |
| PUT    | `/users/profile`         | Update user profile         | Yes           |
| POST   | `/users/change-password` | Change password             | Yes           |
| GET    | `/users/kyc-status`      | Get KYC verification status | Yes           |
| POST   | `/users/kyc-verify`      | Submit KYC documents        | Yes           |
| DELETE | `/users/account`         | Delete account              | Yes           |

### Request Headers

All authenticated requests must include:

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Token Format

Access and refresh tokens are JWT (JSON Web Tokens) with the following structure:

**Header**:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "roles": ["Seller"],
  "userType": "partner",
  "iat": 1735577999,
  "exp": 1735578899
}
```

---

## Security Considerations

### Current Implementation

✅ **Implemented**:

- Password hashing with bcrypt (10 salt rounds)
- JWT-based stateless authentication
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (30 days)
- Role-based access control (RBAC)
- Input validation (email, phone, password format)
- S3 signed URLs for avatar upload
- Soft deletes for user data

### Critical Security Actions Required

⚠️ **BEFORE PRODUCTION**, implement fixes from [SECURITY_CRITICAL_ACTIONS.md](../SECURITY_CRITICAL_ACTIONS.md):

1. **httpOnly Cookies** (4-6 hours)
   - Migrate from localStorage to secure cookies
   - Prevents XSS token theft
   - Auto-sent with requests via `credentials: 'include'`

2. **Rate Limiting** (1-2 hours)
   - /auth/login: 3 attempts per minute
   - /auth/register: 2 per 5 minutes
   - Prevents brute-force attacks

3. **Secret Rotation** (URGENT)
   - Rotate JWT_SECRET
   - Rotate AWS S3 credentials
   - Remove from git history

4. **Password Complexity** (30 minutes)
   - Enforce uppercase, lowercase, numbers, symbols
   - Use `@IsStrongPassword()` validator

5. **CORS Configuration**
   - Restrict to trusted origins only
   - Avoid `*` in production

### Best Practices

1. **Token Storage**
   - Access tokens in httpOnly cookies (after security fixes)
   - Never store in localStorage (XSS vulnerable)
   - Never log tokens in console

2. **API Communication**
   - Always use HTTPS (production)
   - Set credentials: 'include' on all requests
   - Validate server SSL certificates

3. **Error Handling**
   - Never expose specific user validation errors (prevent email enumeration)
   - Return generic "Invalid credentials" for login failures
   - Log detailed errors server-side only

4. **Session Management**
   - Implement token refresh before expiry
   - Invalidate tokens on logout
   - Clear session data on browser close

---

## Error Handling

### Common Error Responses

**400 Bad Request** - Validation Error:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

**401 Unauthorized** - Invalid Credentials:

```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

**403 Forbidden** - Insufficient Permissions:

```json
{
  "statusCode": 403,
  "message": "Access denied: requires Partner user type",
  "error": "Forbidden"
}
```

**409 Conflict** - Email/Phone Already Exists:

```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict"
}
```

**429 Too Many Requests** - Rate Limited:

```json
{
  "statusCode": 429,
  "message": "Too many login attempts. Try again in 60 seconds.",
  "error": "Too Many Requests"
}
```

### Error Handling in Frontend

```typescript
// apps/frontend/src/services/auth.service.ts
async login(credentials: LoginCredentials): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();

      if (response.status === 429) {
        throw new Error('Too many attempts. Please wait before trying again.');
      }

      if (response.status === 401) {
        throw new Error('Invalid email or password.');
      }

      throw new Error(error.message || 'Login failed');
    }

    await this.getCurrentUser();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
```

---

## Troubleshooting

### Login Fails with "Invalid Credentials"

**Possible Causes**:

1. Incorrect email/password combination
2. User account not found
3. User email/phone not verified (OTP)
4. Account deleted or suspended

**Solutions**:

- Verify email/password are correct
- Check if account exists in database
- Ensure OTP verification completed
- Contact support if account suspended

### Token Expires Immediately

**Possible Causes**:

1. JWT_SECRET mismatch between backend and frontend
2. System clock skew (server/client time mismatch)
3. Token issued with past expiry time

**Solutions**:

- Verify JWT_SECRET in .env
- Sync system clocks with NTP
- Check token payload with jwt.io (do not share secret)

### Protected Route Shows "Unauthorized"

**Possible Causes**:

1. Access token expired
2. User type mismatch (required Partner, user is Buyer)
3. Missing required role
4. Token revoked (logout)

**Solutions**:

- Refresh token pair
- Check userType in dashboard requirements
- Verify user roles in auth context
- Re-login after logout

### Avatar Upload Fails

**Possible Causes**:

1. File size > 5MB
2. Invalid file format (not JPG/PNG/WebP)
3. S3 credentials invalid
4. Bucket permissions not configured

**Solutions**:

- Compress image to < 5MB
- Use JPG, PNG, or WebP format
- Check AWS S3 credentials and permissions
- Verify bucket policy allows uploads

### "Rate Limited" Error on Login

**Cause**: Too many login attempts in short period

**Solution**: Wait 60 seconds before trying again. After security fixes, rate limiting will be configurable.

---

## API Examples

### Example: Complete Registration Flow (Frontend)

```typescript
// apps/frontend/src/app/register/page.tsx
import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    userType: 'buyer' as const,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);

      // Store tokens (update to use cookies after security fixes)
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Redirect to appropriate dashboard
      const dashboard = formData.userType === 'partner'
        ? '/dashboard/partner'
        : '/dashboard/buyer';

      router.push(dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

### Example: Protected API Request (Frontend)

```typescript
// apps/frontend/src/lib/api.ts
import { getAccessToken } from '@/services/auth.service';

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Send cookies with request
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
```

---

**Document Version**: 1.0.0
**Last Updated**: 2025-12-30
**Status**: Complete, Security hardening required before production
**Next Update**: After security fixes implementation (Q1 2026)
