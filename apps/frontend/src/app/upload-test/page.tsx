'use client';

import { useState } from 'react';
import FileUpload from '@/components/upload/FileUpload';

export default function UploadTestPage() {
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isError, setIsError] = useState(false);

  const handleUploadComplete = (url: string, key: string) => {
    setUploadStatus(`✓ Upload thành công!\nURL: ${url}\nKey: ${key}`);
    setIsError(false);
  };

  const handleUploadError = (error: string) => {
    setUploadStatus(`✗ Lỗi: ${error}`);
    setIsError(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Test Upload File lên S3
        </h1>

        {uploadStatus && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              isError
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}
          >
            <pre className="whitespace-pre-wrap text-sm">{uploadStatus}</pre>
          </div>
        )}

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              1. Upload Single File (Max 5MB)
            </h2>
            <FileUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              maxSizeMB={5}
              allowedTypes={['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf']}
              uploadType="single"
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              2. Upload Multiple Files (Max 5MB mỗi file)
            </h2>
            <FileUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              maxSizeMB={5}
              allowedTypes={['jpg', 'jpeg', 'png', 'gif', 'webp']}
              multiple={true}
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              3. Upload Property Image (Max 10MB)
            </h2>
            <FileUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              maxSizeMB={10}
              allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
              uploadType="property-image"
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              4. Upload Document (Max 20MB)
            </h2>
            <FileUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              maxSizeMB={20}
              allowedTypes={['pdf', 'doc', 'docx']}
              uploadType="document"
            />
          </section>
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Thông tin cấu hình S3</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              • <strong>Endpoint:</strong> Xem trong file .env
            </li>
            <li>
              • <strong>Bucket:</strong> realestate-uploads-prod
            </li>
            <li>
              • <strong>Region:</strong> ap-southeast-1
            </li>
            <li>
              • <strong>API URL:</strong>{' '}
              {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
