# Railway Environment Variables Configuration

## Backend Service Environment Variables

Add these variables in Railway dashboard → backend service → Variables tab:

### Database Connection (Required)

```bash
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_SSL=true
```

### Application Settings (Required)

```bash
NODE_ENV=production
PORT=3000
API_PREFIX=api
```

### CORS Configuration (Required)

```bash
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### JWT Configuration (Required - Generate secure random strings)

```bash
JWT_SECRET=<your-secure-random-string-here>
JWT_EXPIRES_IN=7d
```

### Redis Configuration (Optional - if using Redis)

```bash
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
```

### Storage Configuration (Optional - if using S3/MinIO)

```bash
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
AWS_REGION=<your-region>
AWS_S3_BUCKET=<your-bucket-name>
```

## How to Add Variables in Railway

1. Go to your Railway project
2. Click on the **backend** service
3. Click on the **Variables** tab
4. Click **+ New Variable**
5. Add each variable name and value
6. Click **Deploy** to apply changes

## Important Notes

- Railway reference variables like `${{Postgres.PGHOST}}` automatically pull values from linked services
- After adding PostgreSQL service, Railway creates these reference variables automatically
- The backend will automatically redeploy after saving new variables
- For `JWT_SECRET`, generate a secure random string (minimum 32 characters)
- Update `CORS_ORIGIN` with your actual Vercel frontend URL

## Generate Secure JWT Secret

You can generate a secure JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use any secure random string generator.
