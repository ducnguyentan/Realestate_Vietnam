# Deployment Guide

**Project**: Realestate_Vietnam
**Version**: 1.0.0-alpha
**Last Updated**: 2025-12-18

## Overview

This guide covers deploying the Realestate_Vietnam platform across different environments (development, staging, production).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Database Setup](#database-setup)
6. [Environment Configuration](#environment-configuration)
7. [Health Checks](#health-checks)
8. [Monitoring & Logs](#monitoring--logs)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

**Minimum**:

- CPU: 2 cores
- RAM: 4 GB
- Storage: 20 GB
- OS: Linux, macOS, or Windows (with WSL2)

**Recommended**:

- CPU: 4+ cores
- RAM: 8+ GB
- Storage: 50 GB
- OS: Ubuntu 22.04 LTS

### Software Requirements

- Node.js 18+ (use nvm for version management)
- npm or pnpm (pnpm 8+)
- Docker 20.10+ and Docker Compose 2.0+
- PostgreSQL 15 (for standalone setup)
- Redis 7+ (for standalone setup)
- Git 2.20+

### Installation

```bash
# Install Node.js (example with nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install pnpm
npm install -g pnpm@8

# Install Docker (Ubuntu)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone repository
git clone <repository-url>
cd realestate_vietnam
```

---

## Local Development

### Quick Start

```bash
# Install dependencies
pnpm install

# Generate environment files
cp .env.example .env.local

# Edit configuration (set DATABASE_URL, JWT_SECRET, etc.)
nano .env.local

# Start development services
docker-compose up -d postgres redis

# Run database migrations
pnpm -r migration:run

# Seed database
pnpm --filter backend run seed

# Start backend
pnpm --filter backend run start:dev

# In another terminal, start frontend
pnpm --filter frontend run dev
```

**Access**:

- Backend: http://localhost:3000
- Frontend: http://localhost:3001
- API Docs: http://localhost:3000/api/docs
- Swagger: http://localhost:3000/api

### Development Scripts

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm run test

# Run linting
pnpm run lint

# Format code
pnpm run format

# Type checking
pnpm -r typecheck

# Development mode (backend + frontend)
pnpm run dev
```

### Database Setup (Local)

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Connect to database
psql postgresql://user:password@localhost:5432/realestate

# Create initial schema
psql postgresql://user:password@localhost:5432/realestate < database/schema.sql

# Seed data
pnpm --filter backend run seed
```

---

## Docker Deployment

### Docker Compose (All Services)

**File**: `docker/docker-compose.yml`

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Remove volumes (clean slate)
docker-compose down -v
```

**Services**:

- **PostgreSQL 15**: Port 5432
- **Redis**: Port 6379
- **MinIO**: Port 9000, 9001 (console)
- **Backend**: Port 3000
- **Frontend**: Port 3001

### Custom Docker Build

**Backend**:

```bash
# Build
docker build -t realestate-backend:latest ./apps/backend

# Run
docker run -d \
  --name realestate-backend \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  realestate-backend:latest
```

**Frontend**:

```bash
# Build
docker build -t realestate-frontend:latest ./apps/frontend

# Run
docker run -d \
  --name realestate-frontend \
  -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL="http://backend:3000/api" \
  realestate-frontend:latest
```

### Docker Compose Override (Production)

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://...
      JWT_SECRET: ${JWT_SECRET}
    restart: always

  frontend:
    build:
      context: .
      dockerfile: apps/frontend/Dockerfile
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: https://api.example.com
    restart: always
```

**Deploy**:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Cloud Deployment

### AWS Deployment (Example)

#### 1. Prepare Infrastructure

```bash
# Create ECR repositories
aws ecr create-repository --repository-name realestate-backend
aws ecr create-repository --repository-name realestate-frontend

# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier realestate-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 20

# Create ElastiCache Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id realestate-redis \
  --cache-node-type cache.t3.micro \
  --engine redis
```

#### 2. Build and Push Docker Images

```bash
# Authenticate
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
docker build -t realestate-backend ./apps/backend
docker tag realestate-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/realestate-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/realestate-backend:latest

# Build and push frontend
docker build -t realestate-frontend ./apps/frontend
docker tag realestate-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/realestate-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/realestate-frontend:latest
```

#### 3. Deploy to ECS/Fargate

```bash
# Create ECS task definitions and services
# (Use AWS Console or AWS CLI)

# Example task definition
aws ecs register-task-definition \
  --family realestate-backend \
  --container-definitions file://task-definition.json
```

#### 4. Setup Load Balancer

```bash
# Create Application Load Balancer
aws elbv2 create-load-balancer \
  --name realestate-alb \
  --scheme internet-facing \
  --type application

# Create target groups
aws elbv2 create-target-group \
  --name realestate-backend-tg \
  --protocol HTTP \
  --port 3000

aws elbv2 create-target-group \
  --name realestate-frontend-tg \
  --protocol HTTP \
  --port 3001
```

### Google Cloud Deployment (Alternative)

```bash
# Enable APIs
gcloud services enable compute.googleapis.com \
  sql.googleapis.com \
  redis.googleapis.com

# Create Cloud SQL instance
gcloud sql instances create realestate-db \
  --database-version POSTGRES_15 \
  --tier db-f1-micro

# Deploy to Cloud Run
gcloud run deploy realestate-backend \
  --image gcr.io/project-id/realestate-backend \
  --region us-central1 \
  --set-env-vars DATABASE_URL=$DB_URL,JWT_SECRET=$JWT_SECRET
```

---

## Database Setup

### PostgreSQL 15 Setup

```bash
# Create database
createdb -U postgres realestate_vietnam

# Create user with specific privileges
psql -U postgres
CREATE USER realestate WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE realestate_vietnam TO realestate;
ALTER USER realestate CREATEDB;
```

### Schema Initialization

```bash
# Load schema
psql -U realestate -d realestate_vietnam < database/schema.sql

# Verify tables
psql -U realestate -d realestate_vietnam
\dt  # List tables

# Seed data
pnpm --filter backend run seed
```

### Backup Strategy

```bash
# Full backup
pg_dump -U realestate -d realestate_vietnam -F c > backup-$(date +%Y%m%d).dump

# Compressed backup
pg_dump -U realestate -d realestate_vietnam | gzip > backup-$(date +%Y%m%d).sql.gz

# Restore from backup
pg_restore -U realestate -d realestate_vietnam backup-20241218.dump

# Schedule daily backup (cron)
0 2 * * * pg_dump -U realestate realestate_vietnam | gzip > /backups/backup-$(date +\%Y\%m\%d).sql.gz
```

---

## Environment Configuration

### Backend (.env)

```env
# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:password@host:5432/realestate_vietnam
DATABASE_POOL_SIZE=10
DATABASE_POOL_TIMEOUT=30000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=30d

# Redis
REDIS_URL=redis://localhost:6379

# OTP (Mock for MVP, real SMS later)
OTP_LENGTH=6
OTP_EXPIRY=900  # 15 minutes

# File Upload
MINIO_ENDPOINT=minio:9000
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=realestate-uploads
MINIO_USE_SSL=false

# Email (SendGrid - future)
SENDGRID_API_KEY=your-sendgrid-key

# SMS (Twilio - future)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# CORS
CORS_ORIGIN=http://localhost:3001,https://example.com

# API Documentation
SWAGGER_ENABLED=true
SWAGGER_PATH=/api/docs
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Realestate Vietnam
NEXT_PUBLIC_APP_DESCRIPTION=Vietnamese Real Estate Marketplace
```

### Docker .env

```env
# PostgreSQL
POSTGRES_USER=realestate
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=realestate_vietnam

# Redis
REDIS_PASSWORD=redis_password

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
```

---

## Health Checks

### API Health Endpoint

```bash
# Check backend health
curl http://localhost:3000/health

# Expected response
{
  "status": "ok",
  "timestamp": "2024-12-18T10:00:00Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Database Health

```bash
# Check PostgreSQL connection
psql postgresql://user:password@localhost:5432/realestate -c "SELECT 1"

# Monitor query performance
SELECT query, mean_exec_time, calls FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;
```

### Redis Health

```bash
# Check Redis connection
redis-cli ping

# Monitor key usage
redis-cli --stat

# Check memory usage
redis-cli info memory
```

### Kubernetes Probes (if using K8s)

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

---

## Monitoring & Logs

### Application Logs

```bash
# View logs with Docker Compose
docker-compose logs -f backend
docker-compose logs -f frontend

# Filter logs
docker-compose logs backend | grep ERROR

# Save to file
docker-compose logs > logs.txt
```

### Structured Logging (Production)

```typescript
// backend logs with Winston (future implementation)
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### Performance Monitoring

```bash
# Monitor backend performance
top -p $(docker-compose ps -q backend)

# Database query performance
psql -U realestate -d realestate_vietnam
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC;

# Redis memory usage
redis-cli info stats
```

### Error Tracking (Future)

```bash
# Sentry integration (error tracking)
# Configure in backend
npm install @sentry/node @sentry/tracing

# Configure in frontend
npm install @sentry/react
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Test connection
psql -U realestate -h localhost -d realestate_vietnam

# Check logs
docker-compose logs postgres
```

**Solution**:

```bash
# Restart PostgreSQL
docker-compose restart postgres

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

#### 2. Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run start
```

#### 3. Out of Memory

```bash
# Check memory usage
docker stats

# Increase container memory limit
docker-compose down
# Edit docker-compose.yml and add memory limit
# Restart
docker-compose up -d
```

#### 4. Redis Connection Refused

```bash
# Check Redis status
docker-compose ps redis

# Restart Redis
docker-compose restart redis

# Check Redis logs
docker-compose logs redis
```

#### 5. Frontend Can't Connect to Backend

```bash
# Check backend is running
curl http://localhost:3000/health

# Check NEXT_PUBLIC_API_URL in frontend .env
cat apps/frontend/.env.local

# Check CORS configuration
# Backend should allow frontend origin
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run start

# Backend debug
NODE_DEBUG=all npm run start:dev

# Database query logging
# Add to database.config.ts
synchronize: false,
logging: ['error', 'warn', 'log'],
```

### Reset Database

```bash
# WARNING: Deletes all data!
docker-compose down -v

# Remove database volume
docker volume rm realestate_vietnam_postgres_data

# Restart fresh
docker-compose up -d postgres
pnpm --filter backend run seed
```

---

## Production Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Configure all environment variables securely
- [ ] Enable HTTPS/SSL certificates
- [ ] Setup database backups (daily)
- [ ] Configure Redis persistence
- [ ] Setup monitoring and alerting
- [ ] Configure error tracking (Sentry)
- [ ] Enable request logging
- [ ] Setup health checks
- [ ] Configure firewall rules
- [ ] Setup CI/CD pipeline
- [ ] Perform load testing
- [ ] Create runbooks for common issues
- [ ] Setup disaster recovery procedure
- [ ] Configure rate limiting
- [ ] Enable security headers
- [ ] Setup log aggregation
- [ ] Configure CDN for static assets
- [ ] Setup database read replicas
- [ ] Configure auto-scaling policies

---

## Rollback Procedure

```bash
# Keep previous version tagged
docker tag realestate-backend:latest realestate-backend:v1.0.0
docker push realestate-backend:v1.0.0

# Rollback to previous version
docker pull realestate-backend:v1.0.0
docker run -d --name realestate-backend realestate-backend:v1.0.0

# Rollback database (if migrations)
npm run migration:revert
```

---

## Support & Escalation

**For Issues**:

1. Check logs: `docker-compose logs -f`
2. Check health endpoint
3. Review troubleshooting section
4. Contact DevOps team if critical
5. File bug report with logs attached

**Escalation Path**:

- Frontend issues → Frontend Lead
- Backend issues → Backend Lead
- Database issues → DBA
- Infrastructure → DevOps Engineer
- Critical → CTO

---

**Document Version**: 1.0.0
**Last Updated**: 2025-12-18
**Maintainer**: DevOps Team
