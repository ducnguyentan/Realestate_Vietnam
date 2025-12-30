'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { UploadService } from '@/services/upload.service';

interface FileUploadProps {
  onUploadComplete?: (url: string, key: string) => void;
  onUploadError?: (error: string) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
  multiple?: boolean;
  uploadType?: 'single' | 'property-image' | 'document';
}

export default function FileUpload({
  onUploadComplete,
  onUploadError,
  maxSizeMB = 5,
  allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'],
  multiple = false,
  uploadType = 'single',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Validate file types
    const invalidFiles = files.filter(
      (file) => !UploadService.validateFileType(file, allowedTypes),
    );

    if (invalidFiles.length > 0) {
      onUploadError?.(`Định dạng file không hợp lệ: ${invalidFiles.map((f) => f.name).join(', ')}`);
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter((file) => !UploadService.validateFileSize(file, maxSizeMB));

    if (oversizedFiles.length > 0) {
      onUploadError?.(
        `File quá lớn (tối đa ${maxSizeMB}MB): ${oversizedFiles.map((f) => f.name).join(', ')}`,
      );
      return;
    }

    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      onUploadError?.('Vui lòng chọn file để upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      if (multiple && selectedFiles.length > 1) {
        const result = await UploadService.uploadMultiple(selectedFiles);
        const urls = result.data.map((item) => item.url);
        setUploadedUrls(urls);

        result.data.forEach((item) => {
          onUploadComplete?.(item.url, item.key);
        });
      } else {
        let result;
        const file = selectedFiles[0];

        switch (uploadType) {
          case 'property-image':
            result = await UploadService.uploadPropertyImage(file);
            break;
          case 'document':
            result = await UploadService.uploadDocument(file);
            break;
          default:
            result = await UploadService.uploadSingle(file);
        }

        setUploadedUrls([result.data.url]);
        onUploadComplete?.(result.data.url, result.data.key);
      }

      setUploadProgress(100);
      setSelectedFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload thất bại';
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setUploadedUrls([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Chọn file để upload</label>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={allowedTypes.map((type) => `.${type}`).join(',')}
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500">
          Định dạng: {allowedTypes.join(', ')} | Tối đa: {maxSizeMB}MB
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">
              File đã chọn ({selectedFiles.length})
            </h3>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700"
              disabled={uploading}
            >
              Xóa tất cả
            </button>
          </div>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{UploadService.formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  disabled={uploading}
                  className="ml-4 text-red-600 hover:text-red-700 disabled:opacity-50"
                  aria-label="Xóa file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploading && (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-blue-700">Đang upload...</span>
            <span className="text-sm font-medium text-blue-700">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md
          hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
          transition-colors duration-200"
      >
        {uploading
          ? 'Đang upload...'
          : `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length} file)` : ''}`}
      </button>

      {uploadedUrls.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Upload thành công ({uploadedUrls.length})
          </h3>
          <ul className="space-y-2">
            {uploadedUrls.map((url, index) => (
              <li key={index} className="p-2 bg-green-50 rounded">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-700 hover:text-green-800 break-all"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
