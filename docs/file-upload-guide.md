# File Upload Guide - S3 Integration

## Overview

Hệ thống upload file tích hợp AWS S3 cho phép người dùng upload hình ảnh, tài liệu lên cloud storage an toàn và scalable.

## Backend Architecture

### S3Service (Global)

**Location:** `apps/backend/src/s3/s3.service.ts`

Service xử lý tất cả tương tác với AWS S3:

```typescript
// Upload file và trả về URL
await s3Service.uploadFile(key, buffer, contentType);

// Tạo key duy nhất
const key = s3Service.generateKey('folder', 'filename.jpg');

// Xóa file
await s3Service.deleteFile(key);

// Tạo signed URL (private files)
const url = await s3Service.getSignedUrl(key, 3600);
```

### Upload Controller

**Location:** `apps/backend/src/modules/upload/upload.controller.ts`

4 endpoints chính:

#### 1. Upload Single File

```http
POST /api/upload/single
Content-Type: multipart/form-data

file: [binary]
```

**Giới hạn:**

- Max size: 5MB
- Formats: jpg, jpeg, png, gif, webp, pdf

**Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://s3.amazonaws.com/bucket/uploads/1234567890-file.jpg",
    "key": "uploads/1234567890-file.jpg",
    "filename": "file.jpg",
    "size": 1024,
    "mimetype": "image/jpeg"
  }
}
```

#### 2. Upload Multiple Files

```http
POST /api/upload/multiple
Content-Type: multipart/form-data

files: [binary, binary, ...]
```

**Giới hạn:**

- Max files: 10
- Max size per file: 5MB
- Formats: jpg, jpeg, png, gif, webp, pdf

#### 3. Upload Property Image

```http
POST /api/upload/property-image
Content-Type: multipart/form-data
Authorization: Bearer <token>

file: [binary]
```

**Giới hạn:**

- Max size: 10MB
- Formats: jpg, jpeg, png, webp

#### 4. Upload Document

```http
POST /api/upload/document
Content-Type: multipart/form-data
Authorization: Bearer <token>

file: [binary]
```

**Giới hạn:**

- Max size: 20MB
- Formats: pdf, doc, docx

## Frontend Integration

### Upload Service

**Location:** `apps/frontend/src/services/upload.service.ts`

```typescript
import { UploadService } from '@/services/upload.service';

// Upload single file
const result = await UploadService.uploadSingle(file);
console.log(result.data.url);

// Upload multiple files
const files = [file1, file2, file3];
const result = await UploadService.uploadMultiple(files);

// Upload property image (requires auth)
const result = await UploadService.uploadPropertyImage(file);

// Upload document (requires auth)
const result = await UploadService.uploadDocument(file);

// Helper functions
const isValid = UploadService.validateFileType(file, ['jpg', 'png']);
const isSizeOk = UploadService.validateFileSize(file, 5); // 5MB
const formatted = UploadService.formatFileSize(1024000); // "1000 KB"
```

### FileUpload Component

**Location:** `apps/frontend/src/components/upload/FileUpload.tsx`

```tsx
import FileUpload from '@/components/upload/FileUpload';

function MyPage() {
  const handleComplete = (url: string, key: string) => {
    console.log('Uploaded:', url);
  };

  const handleError = (error: string) => {
    console.error('Upload failed:', error);
  };

  return (
    <FileUpload
      onUploadComplete={handleComplete}
      onUploadError={handleError}
      maxSizeMB={5}
      allowedTypes={['jpg', 'jpeg', 'png', 'gif', 'webp']}
      multiple={true}
      uploadType="single"
    />
  );
}
```

**Props:**

- `onUploadComplete?: (url: string, key: string) => void` - Callback khi upload thành công
- `onUploadError?: (error: string) => void` - Callback khi upload thất bại
- `maxSizeMB?: number` - Kích thước tối đa (MB), mặc định 5
- `allowedTypes?: string[]` - Các định dạng cho phép, mặc định ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf']
- `multiple?: boolean` - Cho phép chọn nhiều file, mặc định false
- `uploadType?: 'single' | 'property-image' | 'document'` - Loại endpoint, mặc định 'single'

## Environment Variables

### Backend (.env)

```bash
# S3 Configuration
S3_ENDPOINT=https://s3.amazonaws.com
S3_ACCESS_KEY=YOUR_AWS_ACCESS_KEY_ID
S3_SECRET_KEY=YOUR_AWS_SECRET_ACCESS_KEY
S3_BUCKET=realestate-uploads-prod
S3_REGION=ap-southeast-1

# For local development with MinIO
# S3_ENDPOINT=http://localhost:9000
# S3_ACCESS_KEY=minioadmin
# S3_SECRET_KEY=minio_secret
# S3_BUCKET=realestate-uploads
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Testing

### Test Page

Truy cập: `http://localhost:3001/upload-test`

Page này cung cấp UI để test tất cả 4 loại upload.

### Unit Tests

```bash
# Run backend tests
cd apps/backend
pnpm test

# Tests include:
# - S3Service: generateKey, uploadFile, deleteFile
# - UploadController: all 4 endpoints
# Total: 45 tests passing
```

## File Organization on S3

```
bucket/
├── uploads/          # General uploads (single/multiple)
│   └── 1704067200000-filename.jpg
├── properties/       # Property images
│   └── 1704067200000-property.jpg
└── documents/        # Documents
    └── 1704067200000-document.pdf
```

File naming pattern: `{timestamp}-{sanitized-filename}`

## Security

### Authentication

- `/upload/single` và `/upload/multiple`: Public (không cần auth)
- `/upload/property-image` và `/upload/document`: Requires JWT token

### Validation

- File type validation (extension check)
- File size validation (configurable per endpoint)
- Content type validation
- Filename sanitization (remove special chars)

### S3 Permissions

- ACL: `public-read` cho property images
- Private files sử dụng signed URLs

## Error Handling

### Common Errors

1. **File too large**

```json
{
  "statusCode": 422,
  "message": "File size exceeds maximum allowed size"
}
```

2. **Invalid file type**

```json
{
  "statusCode": 422,
  "message": "File type not allowed"
}
```

3. **No file provided**

```json
{
  "statusCode": 400,
  "message": "No file uploaded"
}
```

4. **S3 Upload Error**

```json
{
  "statusCode": 500,
  "message": "Failed to upload file to S3"
}
```

## Best Practices

### Backend

1. Always validate file size and type
2. Sanitize filenames before upload
3. Use descriptive folder names
4. Log all upload operations
5. Handle errors gracefully

### Frontend

1. Show upload progress to users
2. Validate files client-side before upload
3. Display clear error messages
4. Allow users to preview images before upload
5. Implement retry mechanism for failed uploads

### Production

1. Use CDN for faster delivery
2. Enable S3 versioning for important files
3. Set up lifecycle policies for old files
4. Monitor S3 costs and usage
5. Implement rate limiting on upload endpoints

## Performance Optimization

1. **Image Compression**: Consider compressing images before upload
2. **Parallel Uploads**: Use Promise.all for multiple files
3. **Chunked Upload**: For very large files (>100MB), use multipart upload
4. **Caching**: Set appropriate Cache-Control headers on S3

## Monitoring

### Logs to Monitor

- Upload success/failure rates
- Average upload time
- File sizes distribution
- S3 API errors
- Storage usage trends

### Metrics

- Total uploads per day
- Total storage used
- Bandwidth consumed
- Error rate
- Average response time

## Future Enhancements

1. **Image Processing**
   - Automatic thumbnail generation
   - Image optimization (WebP conversion)
   - EXIF data extraction

2. **Advanced Features**
   - Resumable uploads for large files
   - Direct browser-to-S3 upload (presigned URLs)
   - Video processing and transcoding
   - Virus scanning integration

3. **User Experience**
   - Drag-and-drop upload
   - Paste image from clipboard
   - Bulk operations (delete, move)
   - Upload queue management
