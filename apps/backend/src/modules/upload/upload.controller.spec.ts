import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { S3Service } from '../../s3/s3.service';
import { BadRequestException } from '@nestjs/common';

describe('UploadController', () => {
  let controller: UploadController;
  let s3Service: S3Service;

  const mockS3Service = {
    generateKey: jest.fn((folder: string, filename: string) => {
      return `${folder}/test-${filename}`;
    }),
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    s3Service = module.get<S3Service>(S3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadSingle', () => {
    it('should upload a single file successfully', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const mockUploadResult = {
        url: 'https://s3.amazonaws.com/bucket/uploads/test-test.jpg',
        key: 'uploads/test-test.jpg',
      };

      mockS3Service.uploadFile.mockResolvedValue(mockUploadResult);

      const result = await controller.uploadSingle(mockFile);

      expect(result.success).toBe(true);
      expect(result.message).toBe('File uploaded successfully');
      expect(result.data.url).toBe(mockUploadResult.url);
      expect(result.data.key).toBe(mockUploadResult.key);
      expect(result.data.filename).toBe('test.jpg');

      expect(s3Service.generateKey).toHaveBeenCalledWith('uploads', 'test.jpg');

      expect(s3Service.uploadFile).toHaveBeenCalledWith(
        'uploads/test-test.jpg',
        mockFile.buffer,
        mockFile.mimetype,
      );
    });

    it('should throw BadRequestException if no file is provided', async () => {
      await expect(
        controller.uploadSingle(undefined as unknown as Express.Multer.File),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('uploadMultiple', () => {
    it('should upload multiple files successfully', async () => {
      const mockFiles = [
        {
          originalname: 'test1.jpg',
          buffer: Buffer.from('test1'),
          mimetype: 'image/jpeg',
          size: 1024,
        },
        {
          originalname: 'test2.jpg',
          buffer: Buffer.from('test2'),
          mimetype: 'image/jpeg',
          size: 2048,
        },
      ] as Express.Multer.File[];

      mockS3Service.uploadFile
        .mockResolvedValueOnce({
          url: 'https://s3.amazonaws.com/bucket/uploads/test-test1.jpg',
          key: 'uploads/test-test1.jpg',
        })
        .mockResolvedValueOnce({
          url: 'https://s3.amazonaws.com/bucket/uploads/test-test2.jpg',
          key: 'uploads/test-test2.jpg',
        });

      const result = await controller.uploadMultiple(mockFiles);

      expect(result.success).toBe(true);
      expect(result.message).toBe('2 files uploaded successfully');
      expect(result.data).toHaveLength(2);
      expect(result.data[0].filename).toBe('test1.jpg');
      expect(result.data[1].filename).toBe('test2.jpg');

      expect(s3Service.uploadFile).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException if no files are provided', async () => {
      await expect(controller.uploadMultiple([])).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('uploadPropertyImage', () => {
    it('should upload property image successfully', async () => {
      const mockFile = {
        originalname: 'property.jpg',
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      const mockUploadResult = {
        url: 'https://s3.amazonaws.com/bucket/properties/test-property.jpg',
        key: 'properties/test-property.jpg',
      };

      mockS3Service.uploadFile.mockResolvedValue(mockUploadResult);

      const result = await controller.uploadPropertyImage(mockFile);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Property image uploaded successfully');

      expect(s3Service.generateKey).toHaveBeenCalledWith(
        'properties',
        'property.jpg',
      );
    });
  });

  describe('uploadDocument', () => {
    it('should upload document successfully', async () => {
      const mockFile = {
        originalname: 'document.pdf',
        buffer: Buffer.from('test'),
        mimetype: 'application/pdf',
        size: 1024,
      } as Express.Multer.File;

      const mockUploadResult = {
        url: 'https://s3.amazonaws.com/bucket/documents/test-document.pdf',
        key: 'documents/test-document.pdf',
      };

      mockS3Service.uploadFile.mockResolvedValue(mockUploadResult);

      const result = await controller.uploadDocument(mockFile);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Document uploaded successfully');

      expect(s3Service.generateKey).toHaveBeenCalledWith(
        'documents',
        'document.pdf',
      );
    });
  });
});
