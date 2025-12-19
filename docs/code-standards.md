# Code Standards & Conventions

**Project**: Realestate_Vietnam
**Last Updated**: 2025-12-18

## Table of Contents

1. [General Principles](#general-principles)
2. [TypeScript Standards](#typescript-standards)
3. [Backend (NestJS) Standards](#backend-nestjs-standards)
4. [Frontend (Next.js) Standards](#frontend-nextjs-standards)
5. [Database Standards](#database-standards)
6. [File Organization](#file-organization)
7. [Naming Conventions](#naming-conventions)
8. [API Standards](#api-standards)
9. [Error Handling](#error-handling)
10. [Testing Standards](#testing-standards)
11. [Documentation Standards](#documentation-standards)
12. [Git Conventions](#git-conventions)

---

## General Principles

### Code Quality

- **Readability First**: Code is read more often than written
- **Simplicity**: Follow KISS (Keep It Simple, Stupid)
- **DRY**: Don't Repeat Yourself - extract common patterns
- **SOLID Principles**: Follow dependency injection, single responsibility

### Performance

- Avoid N+1 query problems
- Use proper indexing on database columns
- Implement caching where appropriate
- Prefer immutability in state management

### Security

- Never log sensitive information (passwords, tokens, PII)
- Use parameterized queries (TypeORM prevents SQL injection)
- Validate all user inputs
- Implement CORS properly
- Use environment variables for secrets

---

## TypeScript Standards

### Configuration

**tsconfig.base.json** (Monorepo):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@realestate/database": ["packages/database/src"],
      "@realestate/shared": ["packages/shared/src"]
    }
  }
}
```

### Type Safety

**Use strict typing everywhere**:

```typescript
// Good
function calculatePrice(basePrice: number, discount: number): number {
  return basePrice * (1 - discount);
}

// Bad
function calculatePrice(basePrice, discount) {
  return basePrice * (1 - discount);
}
```

**Avoid any**:

```typescript
// Good
const response: IApiResponse<User> = await api.getUser(id);

// Bad
const response: any = await api.getUser(id);
```

**Use interfaces for public APIs**:

```typescript
// Good
interface CreateListingDto {
  title: string;
  description: string;
  price: number;
  area: number;
}

// Bad
type CreateListingDto = {
  title: any;
  description: any;
  price: any;
  area: any;
};
```

### Imports and Exports

**Use absolute imports** (configured in tsconfig):

```typescript
// Good
import { User } from '@realestate/database';
import { formatPhone } from '@realestate/shared/utils/format';

// Bad
import { User } from '../../../packages/database/src/entities/user.entity';
import { formatPhone } from '../../../../../packages/shared/src/utils/format';
```

**Named exports for utilities, default exports for services**:

```typescript
// Utility (named export)
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

// Service (default export)
export default class ListingService {
  // Implementation
}
```

---

## Backend (NestJS) Standards

### Project Structure

```
apps/backend/src/
├── config/              # Configuration files
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── redis.config.ts
├── modules/            # Feature modules
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── index.ts
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── strategies/
│   │   └── services/
│   ├── users/          # User module
│   ├── listings/       # Listings module
│   └── (more modules)
├── database/
│   └── seeds/          # Database seeding
├── app.module.ts       # Root module
├── app.service.ts      # Root service
├── main.ts            # Application entry
└── app.controller.ts  # Root controller
```

### Module Structure

**Each module should contain**:

1. `*.module.ts` - Module definition
2. `*.service.ts` - Business logic
3. `*.controller.ts` - HTTP endpoints
4. `dto/` - Data Transfer Objects
5. `*.spec.ts` - Unit tests

```typescript
// Example: auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

### Controllers

**Naming**: `FeatureController` (e.g., `ListingsController`)

```typescript
@Controller('listings')
@ApiTags('Listings')
export class ListingsController {
  constructor(private readonly service: ListingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all listings' })
  @ApiResponse({ status: 200, type: [Listing] })
  async getAll(@Query() filter: FilterListingDto): Promise<Listing[]> {
    return this.service.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get listing by ID' })
  async getOne(@Param('id') id: string): Promise<Listing> {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new listing' })
  async create(@CurrentUser() user: User, @Body() dto: CreateListingDto): Promise<Listing> {
    return this.service.create(user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateListingDto,
  ): Promise<Listing> {
    return this.service.update(id, user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    return this.service.delete(id, user.id);
  }
}
```

### Services

**Naming**: `FeatureService` (e.g., `ListingsService`)

**Responsibilities**:

- Business logic
- Database operations
- External service calls
- Validation logic

```typescript
@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly repository: Repository<Listing>,
    private readonly qualityService: QualityScoreService,
  ) {}

  async findAll(filter: FilterListingDto): Promise<Listing[]> {
    const query = this.repository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.propertyType', 'propertyType')
      .leftJoinAndSelect('listing.location', 'location');

    if (filter.city) {
      query.where('location.code = :city', { city: filter.city });
    }

    if (filter.priceMin && filter.priceMax) {
      query.andWhere('listing.price BETWEEN :min AND :max', {
        min: filter.priceMin,
        max: filter.priceMax,
      });
    }

    return query
      .take(filter.limit || 20)
      .skip(filter.offset || 0)
      .getMany();
  }

  async create(userId: string, dto: CreateListingDto): Promise<Listing> {
    const listing = this.repository.create({
      ...dto,
      userId,
      code: await this.generateListingCode(dto.city),
      slug: this.generateSlug(dto.title),
    });

    const saved = await this.repository.save(listing);
    const score = await this.qualityService.calculate(saved);
    saved.qualityScore = score;

    return saved;
  }

  private async generateListingCode(city: string): Promise<string> {
    const date = new Date();
    const dateStr = date
      .toLocaleDateString('en-GB', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '');

    const count = await this.repository.countBy({ city });
    const counter = String(count + 1).padStart(3, '0');

    return `BDS-${city}-${dateStr}${counter}`;
  }

  private generateSlug(title: string): string {
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove Vietnamese tone marks
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }
}
```

### DTOs (Data Transfer Objects)

**Location**: `src/modules/feature/dto/`

**Naming**: `FeatureActionDto` (e.g., `CreateListingDto`, `UpdateListingDto`)

```typescript
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateListingDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  area: number;

  @IsString()
  propertyTypeId: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  images?: string[];
}

export class UpdateListingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  // Keep immutable fields out of update DTOs
  // code, slug, qualityScore are generated, not user-editable
}
```

### Decorators

**Location**: `src/modules/feature/decorators/`

```typescript
// current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

### Guards

**Location**: `src/modules/feature/guards/`

```typescript
// jwt-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(request: any): string | null {
    const auth = request.headers.authorization;
    if (!auth) return null;
    const [type, token] = auth.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
```

### Exception Handling

**Use NestJS built-in exceptions**:

```typescript
import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';

// Bad
throw new Error('User not found');

// Good
throw new NotFoundException('User not found');
throw new BadRequestException('Invalid email format');
throw new UnauthorizedException('Invalid credentials');
```

### Database Queries

**Use TypeORM QueryBuilder for complex queries**:

```typescript
// Good - Readable and optimized
const listings = await this.repository
  .createQueryBuilder('l')
  .leftJoinAndSelect('l.owner', 'owner')
  .leftJoinAndSelect('l.propertyType', 'type')
  .where('l.status = :status', { status: 'published' })
  .andWhere('l.price BETWEEN :min AND :max', { min: 100000, max: 500000 })
  .orderBy('l.createdAt', 'DESC')
  .take(20)
  .skip(0)
  .getMany();

// Bad - Multiple queries leading to N+1
const listings = await this.repository.find({ where: { status: 'published' } });
for (const listing of listings) {
  listing.owner = await this.userRepository.findOne(listing.userId);
  listing.propertyType = await this.propertyTypeRepository.findOne(listing.propertyTypeId);
}
```

---

## Frontend (Next.js) Standards

### Project Structure

```
apps/frontend/src/
├── app/                    # App Router (pages and layout)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── fonts/             # Font files
├── lib/                   # Utilities and configuration
│   ├── api.ts            # API client
│   ├── providers.tsx     # Context providers
│   └── hooks/            # Custom React hooks
├── components/           # Reusable components (future)
│   ├── ui/              # Basic UI components
│   ├── layout/          # Layout components
│   └── features/        # Feature-specific components
└── types/               # TypeScript types and interfaces
```

### Component Guidelines

**Naming**: PascalCase for components

```typescript
// Good
export function ListingCard({ listing }: { listing: Listing }) {
  return <div className="p-4">{listing.title}</div>;
}

// Bad
export function listing_card(props) {
  return <div className="p-4">{props.title}</div>;
}
```

**Type components properly**:

```typescript
import { ReactNode } from 'react';

interface ListingCardProps {
  listing: Listing;
  onClick?: () => void;
  children?: ReactNode;
}

export function ListingCard({ listing, onClick, children }: ListingCardProps) {
  return (
    <div onClick={onClick} className="p-4">
      <h3>{listing.title}</h3>
      {children}
    </div>
  );
}
```

### Styling

**Tailwind CSS conventions**:

```typescript
// Good - Organized, readable
export function Button({ variant = 'primary', disabled, children }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${disabledStyles}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Bad - Unclear organization
<button className="px-4 py-2 rounded font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50">
  Click me
</button>
```

### API Client

**Location**: `src/lib/api.ts`

```typescript
interface FetchOptions extends RequestInit {
  baseUrl?: string;
}

class ApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  private async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Similar for PUT, PATCH, DELETE
}

export const apiClient = new ApiClient();
```

### State Management

**React Query** (server state):

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

// Fetch
function useListings() {
  return useQuery({
    queryKey: ['listings'],
    queryFn: () => apiClient.get('/listings'),
  });
}

// Mutation
function useCreateListing() {
  return useMutation({
    mutationFn: (data) => apiClient.post('/listings', data),
    onSuccess: () => {
      // Invalidate cache to refetch
      queryClient.invalidateQueries(['listings']);
    },
  });
}
```

**Zustand** (client state):

```typescript
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  login: async (email, password) => {
    const { user, token } = await apiClient.post('/auth/login', { email, password });
    set({ user, token });
  },
  logout: () => set({ user: null, token: null }),
}));
```

---

## Database Standards

### Entity Design

**File naming**: `entity-name.entity.ts`

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Base } from './base.entity';

@Entity('listings')
export class Listing extends Base {
  @Column('varchar', { length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column('numeric', { precision: 12, scale: 2 })
  price: number;

  @Column('numeric', { precision: 10, scale: 2 })
  area: number;

  @Column('varchar', { length: 50, unique: true })
  code: string;

  @Column('varchar', { length: 255 })
  slug: string;

  @Column('numeric', { precision: 3, scale: 1, default: 0 })
  qualityScore: number;

  @ManyToOne(() => User)
  owner: User;

  @ManyToOne(() => PropertyType)
  propertyType: PropertyType;

  @Column('varchar', { length: 50 })
  status: 'draft' | 'published' | 'expired' | 'sold' | 'archived';

  @OneToMany(() => Lead, (lead) => lead.listing)
  leads: Lead[];
}
```

### Base Entity

**All entities should extend Base**:

```typescript
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column('boolean', { default: true })
  isActive: boolean;
}
```

### Indexes

**Add indexes for frequently queried columns**:

```typescript
@Entity('listings')
@Index('idx_user_listings', ['userId'])
@Index('idx_property_type', ['propertyTypeId'])
@Index('idx_listing_code', ['code'], { unique: true })
@Index('idx_listing_status', ['status'])
export class Listing extends Base {
  // Fields
}
```

### Naming Conventions for Columns

- **Snake case** in database, **camelCase** in entities
- **Foreign keys**: `{entityName}Id` (e.g., `userId`, `propertyTypeId`)
- **Boolean fields**: `is{Property}` (e.g., `isActive`, `isKycVerified`)
- **Timestamps**: `createdAt`, `updatedAt`, `deletedAt`

```typescript
@Column('varchar', { length: 50 })
propertyTypeId: string;

@Column('boolean', { default: false })
isKycVerified: boolean;
```

---

## File Organization

### General Layout

```
component/
├── component.tsx         # Main component
├── component.spec.ts    # Tests
├── component.module.css # Styles (if isolated)
├── types.ts            # TypeScript interfaces
└── utils.ts            # Helper functions
```

### Import Order

1. External libraries
2. Absolute imports (@realestate/\*)
3. Relative imports (../)
4. Type imports

```typescript
import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { formatPrice } from '@realestate/shared/utils/format';

import { ListingCard } from '../components/ListingCard';
import { calculateScore } from './utils';

import type { Listing } from '@realestate/shared/types';
```

---

## Naming Conventions

### Variables and Functions

**camelCase** for variables and functions:

```typescript
const userEmail = 'user@example.com';
const isVerified = true;
const calculateTotal = (items: Item[]) => items.reduce((sum, item) => sum + item.price, 0);
```

### Constants

**UPPER_SNAKE_CASE** for constants:

```typescript
const API_BASE_URL = 'https://api.realestate.vn';
const JWT_EXPIRY_MINUTES = 15;
const LISTING_QUALITY_MIN_SCORE = 4.0;
```

### Classes and Interfaces

**PascalCase** for classes and interfaces:

```typescript
class ListingService {
  // Implementation
}

interface CreateListingDto {
  title: string;
}

enum ListingStatus {
  Draft = 'draft',
  Published = 'published',
  Sold = 'sold',
}
```

### File Names

**kebab-case** for file names:

```
user.service.ts
create-listing.dto.ts
quality-score.service.ts
jwt-auth.guard.ts
```

### Database Columns

**snake_case** in database:

```sql
SELECT user_id, first_name, is_verified, created_at FROM users;
```

---

## API Standards

### Endpoint Naming

**RESTful conventions**:

```
GET    /listings              # List all
GET    /listings/:id          # Get one
POST   /listings              # Create
PUT    /listings/:id          # Update
DELETE /listings/:id          # Delete
```

**Special actions** (non-CRUD):

```
POST   /listings/:id/publish  # Publish listing
POST   /listings/:id/draft    # Save draft
POST   /auth/verify-otp       # Verify OTP
```

### Request/Response Format

**Request Body** (camelCase):

```json
{
  "title": "Căn hộ 2 phòng ngủ",
  "description": "Căn hộ tại Hà Nội",
  "price": 3000000,
  "area": 65,
  "propertyTypeId": "uuid"
}
```

**Response** (camelCase):

```json
{
  "id": "uuid",
  "code": "BDS-HCM-181224001",
  "title": "Căn hộ 2 phòng ngủ",
  "price": 3000000,
  "area": 65,
  "qualityScore": 7.5,
  "createdAt": "2024-12-18T10:00:00Z",
  "updatedAt": "2024-12-18T10:00:00Z"
}
```

### Status Codes

```
200 OK              - Successful request
201 Created         - Resource created
204 No Content      - Successful delete/update
400 Bad Request     - Invalid input
401 Unauthorized    - Missing/invalid token
403 Forbidden       - Insufficient permissions
404 Not Found       - Resource not found
409 Conflict        - Resource already exists
500 Server Error    - Unexpected error
```

### Pagination

**Query parameters**:

```
GET /listings?limit=20&offset=0
GET /listings?page=1&pageSize=20
```

**Response format**:

```json
{
  "data": [...],
  "pagination": {
    "total": 1000,
    "limit": 20,
    "offset": 0,
    "page": 1
  }
}
```

---

## Error Handling

### Backend Error Responses

```typescript
// Standard error format
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BadRequest",
  "details": {
    "price": "must be a positive number",
    "area": "must be greater than 0"
  }
}
```

### Exception Classes

```typescript
// Use NestJS built-in exceptions
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

throw new NotFoundException(`Listing with ID ${id} not found`);
throw new BadRequestException('Email already registered');
throw new ConflictException('Listing code already exists');
```

### Frontend Error Handling

```typescript
async function fetchListings() {
  try {
    const listings = await apiClient.get('/listings');
    setListings(listings);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        // Handle unauthorized
        redirectToLogin();
      } else {
        // Handle other errors
        showErrorToast(error.message);
      }
    }
  }
}
```

---

## Testing Standards

### Test File Naming

**Colocate with source**: `feature.service.spec.ts`

### Test Structure

```typescript
describe('ListingsService', () => {
  let service: ListingsService;
  let repository: Repository<Listing>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          provide: getRepositoryToken(Listing),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ListingsService);
    repository = module.get(getRepositoryToken(Listing));
  });

  describe('findAll', () => {
    it('should return all listings', async () => {
      const mockListings = [{ id: '1', title: 'Listing 1' }];
      jest.spyOn(repository, 'find').mockResolvedValue(mockListings);

      const result = await service.findAll();

      expect(result).toEqual(mockListings);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
```

### Test Coverage Targets

- **Services**: > 80% coverage
- **Controllers**: > 70% coverage
- **Guards/Pipes**: > 80% coverage
- **Overall**: > 75% coverage

---

## Documentation Standards

### Code Comments

**Use comments sparingly** (code should be self-documenting):

```typescript
// Bad - Obvious comment
const sum = a + b; // Add a and b

// Good - Explains why, not what
// Round to nearest 0.5M VND for display consistency
const roundedPrice = Math.round(price / 500000) * 500000;
```

### JSDoc Comments for Public APIs

```typescript
/**
 * Calculate quality score for a listing
 *
 * @param listing - The listing to score
 * @returns Quality score (0-10)
 * @throws Error if listing is missing required fields
 */
export function calculateQualityScore(listing: Listing): number {
  // Implementation
}
```

### README in Each App

**apps/backend/README.md**:

- Quick start (npm install, npm run dev)
- API documentation link
- Environment variables
- Testing instructions
- Deployment notes

**apps/frontend/README.md**:

- Quick start
- Component structure
- Styling guide
- State management
- Development tips

---

## Git Conventions

### Branch Naming

- `feature/feature-name` - New feature
- `fix/bug-description` - Bug fix
- `docs/documentation-topic` - Documentation
- `refactor/component-name` - Code refactoring
- `chore/task-description` - Maintenance tasks

### Commit Messages

**Format**: `type(scope): description`

```
feat(auth): add JWT token refresh endpoint
fix(listings): correct quality score calculation
docs(readme): update installation instructions
refactor(auth): extract token service
chore(deps): update dependencies
```

**Types**:

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Adding/updating tests
- `chore` - Maintenance, dependency updates
- `ci` - CI/CD configuration

### Pull Request Guidelines

- Title follows commit convention
- Description explains what and why
- Link related issues
- All tests pass
- No ESLint warnings
- Minimum 1 approval before merge

---

## Performance Guidelines

### Backend

- **Query optimization**: Use QueryBuilder with eager loading
- **Caching**: Use Redis for frequently accessed data
- **Pagination**: Always paginate large result sets
- **Indexes**: Add database indexes for filter/sort columns
- **Connection pooling**: PostgreSQL connection pool size = 10

### Frontend

- **Code splitting**: Use dynamic imports for routes
- **Lazy loading**: Lazy load components below the fold
- **Memoization**: Use React.memo for expensive components
- **State management**: Keep global state minimal
- **Bundle size**: Monitor with next/bundle-analyzer

---

## Security Guidelines

### Backend

- **Input validation**: Always validate user input with class-validator
- **SQL injection prevention**: Use parameterized queries (TypeORM)
- **Authentication**: Verify JWT on protected routes
- **Authorization**: Check user permissions before operations
- **Secrets**: Never commit .env files, use GitHub Secrets
- **Logging**: Never log passwords, tokens, or PII

### Frontend

- **Token storage**: Use httpOnly cookies when possible
- **XSS prevention**: Sanitize user-generated content
- **CORS**: Configure for specific origins only
- **Dependency scanning**: Regularly update dependencies
- **Secrets**: Never commit API keys or tokens

---

## Review Checklist

Before submitting PR:

- [ ] Code follows standards in this document
- [ ] All tests pass (`npm run test`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] No console.log statements left
- [ ] Database migrations included (if applicable)
- [ ] Documentation updated
- [ ] Sensitive data not committed
- [ ] Performance acceptable

---

**Document Version**: 1.0.0
**Last Updated**: 2025-12-18
**Maintainer**: Development Team
