import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { QualityScoreService } from './quality-score.service';
import { Listing } from '@realestate/database';

describe('ListingsService', () => {
  let service: ListingsService;

  const mockRepository = {
    create: jest.fn((dto: Partial<Listing>): Partial<Listing> => dto),
    save: jest.fn((listing) => Promise.resolve({ id: 'test-id', ...listing })),
    findOne: jest.fn(),
    increment: jest.fn(() => Promise.resolve()),
  };

  const mockQualityScoreService = {
    calculateScore: jest.fn(() => 7.5),
    getSuggestions: jest.fn(() => []),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        { provide: getRepositoryToken(Listing), useValue: mockRepository },
        { provide: QualityScoreService, useValue: mockQualityScoreService },
      ],
    }).compile();

    service = module.get<ListingsService>(ListingsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should throw NotFoundException when listing not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return listing when found', async () => {
      const mockListing = {
        id: 'test-id',
        userId: 'user-123',
        views: 10,
      } as Listing;
      mockRepository.findOne.mockResolvedValue(mockListing);

      const result = await service.findById('test-id');
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should throw ForbiddenException when user is not owner', async () => {
      const mockListing = { id: 'test-id', userId: 'owner-123' } as Listing;
      mockRepository.findOne.mockResolvedValue(mockListing);

      await expect(
        service.update('test-id', 'other-user', { title: 'New' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('incrementSaves', () => {
    it('should increment save count', async () => {
      await service.incrementSaves('listing-id');
      expect(mockRepository.increment).toHaveBeenCalledWith(
        { id: 'listing-id' },
        'saves',
        1,
      );
    });
  });

  describe('incrementContacts', () => {
    it('should increment contact count', async () => {
      await service.incrementContacts('listing-id');
      expect(mockRepository.increment).toHaveBeenCalledWith(
        { id: 'listing-id' },
        'contacts',
        1,
      );
    });
  });
});
