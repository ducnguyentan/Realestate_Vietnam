import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';

describe('S3Service', () => {
  let service: S3Service;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        S3_ENDPOINT: 'https://s3.amazonaws.com',
        S3_REGION: 'ap-southeast-1',
        S3_ACCESS_KEY: 'test-access-key',
        S3_SECRET_KEY: 'test-secret-key',
        S3_BUCKET: 'test-bucket',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateKey', () => {
    it('should generate a valid S3 key with timestamp', () => {
      const folder = 'uploads';
      const filename = 'test-file.jpg';

      const key = service.generateKey(folder, filename);

      expect(key).toMatch(/^uploads\/\d+-test-file\.jpg$/);
    });

    it('should sanitize filename with special characters', () => {
      const folder = 'documents';
      const filename = 'my file (1).pdf';

      const key = service.generateKey(folder, filename);

      expect(key).toMatch(/^documents\/\d+-my_file__1_\.pdf$/);
    });

    it('should handle Vietnamese characters in filename', () => {
      const folder = 'uploads';
      const filename = 'tài liệu.pdf';

      const key = service.generateKey(folder, filename);

      expect(key).toContain('uploads/');
      expect(key).toContain('.pdf');
    });
  });

  describe('initialization', () => {
    it('should initialize with correct configuration', () => {
      expect(configService.get).toHaveBeenCalledWith('S3_ENDPOINT');

      expect(configService.get).toHaveBeenCalledWith('S3_REGION');

      expect(configService.get).toHaveBeenCalledWith('S3_ACCESS_KEY');

      expect(configService.get).toHaveBeenCalledWith('S3_SECRET_KEY');

      expect(configService.get).toHaveBeenCalledWith('S3_BUCKET');
    });
  });
});
