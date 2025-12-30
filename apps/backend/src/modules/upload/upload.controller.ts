import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../../s3/s3.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('single')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp|pdf)$/ }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const key = this.s3Service.generateKey('uploads', file.originalname);
    const result = await this.s3Service.uploadFile(
      key,
      file.buffer,
      file.mimetype,
    );

    return {
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: result.url,
        key: result.key,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    };
  }

  @Post('multiple')
  @Public()
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp|pdf)$/ }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const uploadPromises = files.map(async (file) => {
      const key = this.s3Service.generateKey('uploads', file.originalname);
      const result = await this.s3Service.uploadFile(
        key,
        file.buffer,
        file.mimetype,
      );

      return {
        url: result.url,
        key: result.key,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return {
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully`,
      data: uploadedFiles,
    };
  }

  @Post('property-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPropertyImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB for property images
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const key = this.s3Service.generateKey('properties', file.originalname);
    const result = await this.s3Service.uploadFile(
      key,
      file.buffer,
      file.mimetype,
    );

    return {
      success: true,
      message: 'Property image uploaded successfully',
      data: {
        url: result.url,
        key: result.key,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    };
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }), // 20MB for documents
          new FileTypeValidator({ fileType: /(pdf|doc|docx)$/ }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const key = this.s3Service.generateKey('documents', file.originalname);
    const result = await this.s3Service.uploadFile(
      key,
      file.buffer,
      file.mimetype,
    );

    return {
      success: true,
      message: 'Document uploaded successfully',
      data: {
        url: result.url,
        key: result.key,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    };
  }
}
