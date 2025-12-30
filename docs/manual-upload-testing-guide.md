# Hướng Dẫn Upload File Từ Frontend Lên S3 (Manual Testing)

## Mục Lục

1. [Chuẩn Bị](#chuẩn-bị)
2. [Khởi Động Ứng Dụng](#khởi-động-ứng-dụng)
3. [Test Upload Qua UI](#test-upload-qua-ui)
4. [Test Upload Qua API](#test-upload-qua-api)
5. [Kiểm Tra Kết Quả](#kiểm-tra-kết-quả)
6. [Xử Lý Lỗi Thường Gặp](#xử-lý-lỗi-thường-gặp)

---

## Chuẩn Bị

### 1. Kiểm Tra Environment Variables

**Backend (.env):**

```bash
# Đảm bảo file apps/backend/.env có các biến sau:
S3_ENDPOINT=https://s3.amazonaws.com
S3_ACCESS_KEY=YOUR_AWS_ACCESS_KEY_ID
S3_SECRET_KEY=YOUR_AWS_SECRET_ACCESS_KEY
S3_BUCKET=realestate-uploads-prod
S3_REGION=ap-southeast-1
```

**Frontend (.env.local):**

```bash
# Đảm bảo file apps/frontend/.env.local có:
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. Chuẩn Bị File Test

Tạo thư mục test files:

```bash
mkdir test-uploads
cd test-uploads
```

Download hoặc tạo các file mẫu:

- **test-image.jpg** (< 5MB) - Ảnh bất kỳ
- **test-image-large.jpg** (< 10MB) - Ảnh property
- **test-document.pdf** (< 20MB) - PDF document
- **test-invalid.txt** - File không hợp lệ (để test validation)
- **test-oversized.jpg** (> 10MB) - File quá lớn (để test limit)

---

## Khởi Động Ứng Dụng

### Bước 1: Start Backend

```bash
# Terminal 1
cd apps/backend
pnpm install  # Nếu chưa install dependencies
pnpm dev
```

**Kiểm tra backend đang chạy:**

- URL: http://localhost:3000
- Health check: http://localhost:3000/api

**Console output mong đợi:**

```
[Nest] INFO [S3Service] S3 Service initialized with bucket: realestate-uploads-prod, region: ap-southeast-1
[Nest] INFO [NestApplication] Nest application successfully started
```

### Bước 2: Start Frontend

```bash
# Terminal 2
cd apps/frontend
pnpm install  # Nếu chưa install dependencies
pnpm dev
```

**Kiểm tra frontend đang chạy:**

- URL: http://localhost:3001

---

## Test Upload Qua UI

### Test 1: Upload Single File (Public)

**URL:** http://localhost:3001/upload-test

**Các bước:**

1. **Scroll đến section "1. Upload Single File (Max 5MB)"**

2. **Click nút "Chọn file để upload"**
   - Chọn file: `test-image.jpg` (< 5MB)
   - Format: jpg, jpeg, png, gif, webp, pdf

3. **Verify file hiển thị trong danh sách**
   - Tên file: test-image.jpg
   - Kích thước: VD "1.2 MB"

4. **Click nút "Upload (1 file)"**

5. **Kiểm tra kết quả:**
   - ✅ Thanh progress bar chạy đến 100%
   - ✅ Hiển thị "Upload thành công (1)" màu xanh
   - ✅ URL S3 hiển thị dạng: `https://realestate-uploads-prod.s3.ap-southeast-1.amazonaws.com/uploads/1735531200000-test-image.jpg`

6. **Click vào URL để verify file tồn tại trên S3**

**Screenshot mẫu:**

```
┌─────────────────────────────────────────┐
│ ✓ Upload thành công!                    │
│ URL: https://...amazonaws.com/...jpg    │
│ Key: uploads/1735531200000-test-image   │
└─────────────────────────────────────────┘
```

### Test 2: Upload Multiple Files (Public)

**Scroll đến section "2. Upload Multiple Files"**

1. **Click "Chọn file để upload"**
   - Giữ Ctrl/Cmd và chọn nhiều files:
     - test-image-1.jpg
     - test-image-2.jpg
     - test-image-3.png

2. **Verify danh sách hiển thị 3 files**

3. **Click "Upload (3 files)"**

4. **Kiểm tra kết quả:**
   - ✅ "Upload thành công (3)"
   - ✅ 3 URLs hiển thị
   - ✅ Mỗi file có folder prefix: `uploads/`

### Test 3: Upload Property Image (Requires Login)

**Scroll đến section "3. Upload Property Image (Max 10MB)"**

⚠️ **Lưu ý:** Endpoint này yêu cầu authentication.

**Nếu chưa login:**

1. **Mở tab mới:** http://localhost:3001/login
2. **Login với tài khoản test:**
   ```
   Email/Phone: test@example.com
   Password: Test@123
   ```
3. **Quay lại tab upload-test**

**Upload steps:**

1. **Chọn file:** `test-image-large.jpg` (< 10MB)
2. **Click Upload**
3. **Kiểm tra:**
   - ✅ URL có folder: `properties/`
   - ✅ File tồn tại trên S3

**Nếu chưa login, sẽ thấy lỗi:**

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Test 4: Upload Document (Requires Login)

**Scroll đến section "4. Upload Document (Max 20MB)"**

1. **Chọn file:** `test-document.pdf`
2. **Click Upload**
3. **Kiểm tra:**
   - ✅ URL có folder: `documents/`
   - ✅ File format: .pdf

---

## Test Upload Qua API

### Tool: Postman/Thunder Client/cURL

### Test 1: Upload Single File via cURL

**Windows PowerShell:**

```powershell
$filePath = "C:\path\to\test-image.jpg"
$uri = "http://localhost:3000/api/upload/single"

$form = @{
    file = Get-Item -Path $filePath
}

Invoke-WebRequest -Uri $uri -Method POST -Form $form
```

**Linux/Mac:**

```bash
curl -X POST http://localhost:3000/api/upload/single \
  -F "file=@/path/to/test-image.jpg"
```

**Response mẫu:**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://realestate-uploads-prod.s3.ap-southeast-1.amazonaws.com/uploads/1735531200000-test-image.jpg",
    "key": "uploads/1735531200000-test-image.jpg",
    "filename": "test-image.jpg",
    "size": 1234567,
    "mimetype": "image/jpeg"
  }
}
```

### Test 2: Upload Multiple Files via Postman

**Postman Setup:**

1. **Method:** POST
2. **URL:** `http://localhost:3000/api/upload/multiple`
3. **Headers:** Không cần (auto-detect multipart/form-data)
4. **Body:**
   - Type: `form-data`
   - Key: `files` (type: File)
   - Value: Select multiple files
   - ⚠️ **Lưu ý:** Key phải là `files` (có 's'), không phải `file`

5. **Click Send**

**Response mẫu:**

```json
{
  "success": true,
  "message": "3 files uploaded successfully",
  "data": [
    {
      "url": "https://.../uploads/1735531200000-file1.jpg",
      "key": "uploads/1735531200000-file1.jpg",
      "filename": "file1.jpg",
      "size": 123456,
      "mimetype": "image/jpeg"
    },
    {
      "url": "https://.../uploads/1735531200001-file2.jpg",
      "key": "uploads/1735531200001-file2.jpg",
      "filename": "file2.jpg",
      "size": 234567,
      "mimetype": "image/jpeg"
    }
  ]
}
```

### Test 3: Upload Property Image (With JWT Token)

**Bước 1: Get JWT Token**

```bash
# Login để lấy token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "Test@123"
  }'
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "expiresIn": 900
}
```

**Bước 2: Upload với Token**

```bash
# Copy accessToken từ bước 1
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/api/upload/property-image \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/property.jpg"
```

**Postman:**

- Method: POST
- URL: `http://localhost:3000/api/upload/property-image`
- Headers:
  - `Authorization: Bearer {accessToken}`
- Body: form-data
  - Key: `file`
  - Value: property-image.jpg

---

## Kiểm Tra Kết Quả

### 1. Verify Upload Qua Browser

**Copy URL từ response và mở trong browser:**

```
https://realestate-uploads-prod.s3.ap-southeast-1.amazonaws.com/uploads/1735531200000-test-image.jpg
```

**Mong đợi:**

- ✅ Ảnh hiển thị trong browser
- ✅ Không có lỗi 403 (Access Denied)
- ✅ Không có lỗi 404 (Not Found)

### 2. Verify Trên AWS S3 Console

**Đăng nhập AWS Console:**

1. Login: https://console.aws.amazon.com/
2. Service: S3
3. Bucket: `realestate-uploads-prod`
4. Browse folders:
   - `uploads/` - Single/multiple uploads
   - `properties/` - Property images
   - `documents/` - Documents

**Kiểm tra file properties:**

- Object URL
- Size
- Last modified
- Storage class: Standard
- ACL: public-read

### 3. Verify Backend Logs

**Trong terminal backend, kiểm tra logs:**

```log
[Nest] INFO [S3Service] File uploaded successfully: uploads/1735531200000-test-image.jpg
```

**Nếu có lỗi:**

```log
[Nest] ERROR [S3Service] Failed to upload file: uploads/test.jpg
Error: The AWS Access Key Id you provided does not exist in our records.
```

---

## Xử Lý Lỗi Thường Gặp

### Lỗi 1: File Too Large

**Frontend hiển thị:**

```
✗ Lỗi: File quá lớn (tối đa 5MB): test-oversized.jpg
```

**Backend response:**

```json
{
  "statusCode": 422,
  "message": "Validation failed (expected size is less than 5242880)"
}
```

**Cách fix:**

- Giảm kích thước file
- Hoặc sử dụng endpoint có limit cao hơn (property-image: 10MB, document: 20MB)

### Lỗi 2: Invalid File Type

**Frontend hiển thị:**

```
✗ Lỗi: Định dạng file không hợp lệ: test.txt
```

**Backend response:**

```json
{
  "statusCode": 422,
  "message": "Validation failed (expected type is /(jpg|jpeg|png|gif|webp|pdf)$/)"
}
```

**Cách fix:**

- Upload đúng định dạng file
- Kiểm tra danh sách allowed types

### Lỗi 3: S3 Access Denied

**Backend log:**

```
[Nest] ERROR [S3Service] Failed to upload file
AccessDenied: Access Denied
```

**Nguyên nhân:**

- S3_ACCESS_KEY hoặc S3_SECRET_KEY sai
- IAM user không có quyền PutObject

**Cách fix:**

1. Verify credentials trong .env
2. Kiểm tra IAM policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::realestate-uploads-prod/*"
    }
  ]
}
```

### Lỗi 4: CORS Error (Frontend)

**Console error:**

```
Access to fetch at 'http://localhost:3000/api/upload/single' from origin 'http://localhost:3001'
has been blocked by CORS policy
```

**Cách fix:**

Kiểm tra backend CORS config:

```typescript
// apps/backend/src/main.ts
app.enableCors({
  origin: ['http://localhost:3001'],
  credentials: true,
});
```

### Lỗi 5: Network Error

**Frontend error:**

```
✗ Lỗi: Failed to fetch
```

**Nguyên nhân:**

- Backend không chạy
- Sai URL API endpoint

**Cách fix:**

1. Kiểm tra backend đang chạy: http://localhost:3000/api
2. Verify NEXT_PUBLIC_API_URL trong .env.local
3. Restart frontend nếu vừa thay đổi env

### Lỗi 6: Unauthorized (401)

**Response:**

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Nguyên nhân:**

- Chưa login (với property-image, document endpoints)
- JWT token hết hạn

**Cách fix:**

1. Login lại để lấy token mới
2. Thêm Authorization header với Bearer token
3. Sử dụng cookies (credentials: 'include')

---

## Checklist Upload Thành Công

### Trước khi upload:

- [ ] Backend đang chạy (port 3000)
- [ ] Frontend đang chạy (port 3001)
- [ ] Environment variables đã cấu hình đúng
- [ ] File test đã chuẩn bị

### Trong quá trình upload:

- [ ] File size < giới hạn
- [ ] File type hợp lệ
- [ ] JWT token (nếu cần auth)
- [ ] Progress bar hiển thị

### Sau khi upload:

- [ ] Response success: true
- [ ] URL S3 hợp lệ
- [ ] File accessible qua browser
- [ ] File tồn tại trên S3 console
- [ ] Backend log không có error

---

## Tips & Best Practices

### 1. Test Systematically

**Test theo thứ tự:**

1. ✅ Single file (public)
2. ✅ Multiple files (public)
3. ✅ Login
4. ✅ Property image (auth)
5. ✅ Document (auth)

### 2. Use Browser DevTools

**Network Tab:**

- Inspect request payload
- Check response headers
- Monitor upload progress

**Console Tab:**

- Check for JavaScript errors
- View service worker logs

### 3. Test Edge Cases

**File validation:**

- Max size exactly (5MB = 5242880 bytes)
- Zero-byte file
- Filename với ký tự đặc biệt: `test (1) [copy].jpg`
- Filename tiếng Việt: `hình ảnh.jpg`

**Network conditions:**

- Slow 3G (throttle in DevTools)
- Offline mode
- Interrupted upload

### 4. Automation Script

**Tạo script test nhanh:**

```bash
#!/bin/bash
# test-upload.sh

API_URL="http://localhost:3000/api/upload"

echo "Testing single upload..."
curl -X POST $API_URL/single -F "file=@test-image.jpg"

echo "\nTesting multiple upload..."
curl -X POST $API_URL/multiple \
  -F "files=@test1.jpg" \
  -F "files=@test2.jpg" \
  -F "files=@test3.jpg"
```

**Run:**

```bash
chmod +x test-upload.sh
./test-upload.sh
```

---

## Video Walkthrough (Suggested)

**Nếu cần video demo:**

1. **Record screen với OBS/QuickTime**
2. **Demo flow:**
   - Khởi động backend + frontend
   - Upload qua UI (tất cả 4 types)
   - Upload qua Postman
   - Verify trên S3 console
   - Demo error cases

3. **Upload lên YouTube/Drive** và share link

---

## Quick Reference

| Endpoint                 | Auth | Max Size | Formats        | Test File            |
| ------------------------ | ---- | -------- | -------------- | -------------------- |
| `/upload/single`         | No   | 5MB      | jpg, png, pdf  | test-image.jpg       |
| `/upload/multiple`       | No   | 5MB/file | jpg, png       | test1.jpg, test2.jpg |
| `/upload/property-image` | Yes  | 10MB     | jpg, png, webp | property.jpg         |
| `/upload/document`       | Yes  | 20MB     | pdf, doc, docx | document.pdf         |

**URLs:**

- Frontend: http://localhost:3001
- Test Page: http://localhost:3001/upload-test
- Backend: http://localhost:3000/api
- Health: http://localhost:3000/api

**Credentials (Test):**

```
Email: test@example.com
Password: Test@123
```

---

## Support

**Nếu gặp vấn đề:**

1. Check logs trong terminal
2. Check browser DevTools console
3. Verify environment variables
4. Test với cURL trước khi test UI
5. Restart backend + frontend

**Documentation:**

- API Docs: [file-upload-guide.md](./file-upload-guide.md)
- Architecture: [system-architecture.md](./system-architecture.md)
