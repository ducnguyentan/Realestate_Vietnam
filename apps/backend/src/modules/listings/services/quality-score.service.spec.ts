import { Test, TestingModule } from '@nestjs/testing';
import { QualityScoreService } from './quality-score.service';
import { Listing } from '@realestate/database';

describe('QualityScoreService', () => {
  let service: QualityScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QualityScoreService],
    }).compile();

    service = module.get<QualityScoreService>(QualityScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateScore', () => {
    it('should calculate score for minimal listing', () => {
      const listing = {
        title: 'Test',
        description: null,
        price: 0,
        address: '',
        adminUnitCode: '',
        areaLand: null,
        areaFloor: null,
        bedrooms: null,
        bathrooms: null,
        direction: null,
        frontage: null,
        legalStatus: null,
        ownershipType: null,
        highlights: [],
        amenities: [],
      } as unknown as Listing;

      const score = service.calculateScore(listing);
      expect(score).toBe(0);
    });

    it('should calculate score for complete listing', () => {
      const listing = {
        title:
          'Beautiful house in District 1 with great view and modern amenities',
        description:
          'This is a very detailed description with more than 100 characters explaining all the features and benefits of the property including location, design, and nearby facilities.',
        price: 5000000000,
        address: '123 Main St',
        adminUnitCode: '79',
        areaLand: 100,
        areaFloor: 80,
        bedrooms: 3,
        bathrooms: 2,
        direction: 'East',
        frontage: 5,
        legalStatus: 'Pink Book',
        ownershipType: 'Individual',
        highlights: [
          'Modern design',
          'Great location',
          'Near schools',
          'Quiet neighborhood',
        ],
        amenities: ['Air Conditioning', 'Security', 'Parking', 'Swimming Pool'],
      } as Listing;

      const score = service.calculateScore(listing);
      expect(score).toBeGreaterThan(8);
      expect(score).toBeLessThanOrEqual(10);
    });

    it('should give 1 point for title >= 20 chars', () => {
      const listing = {
        title: 'This is a long title',
        description: null,
        price: 100000,
        address: 'Address',
        adminUnitCode: '79',
      } as Listing;

      const score = service.calculateScore(listing);
      expect(score).toBeGreaterThan(0);
    });

    it('should give points for property details', () => {
      const listing = {
        title: 'Test',
        description: null,
        price: 0,
        address: '',
        adminUnitCode: '',
        areaLand: 100,
        bedrooms: 3,
        bathrooms: 2,
        direction: 'North',
      } as Listing;

      const score = service.calculateScore(listing);
      expect(score).toBeGreaterThanOrEqual(2.5); // area(1) + bedrooms(0.5) + bathrooms(0.5) + direction(0.5)
    });
  });

  describe('getQualityCategory', () => {
    it('should return "excellent" for score >= 8', () => {
      expect(service.getQualityCategory(8)).toBe('excellent');
      expect(service.getQualityCategory(10)).toBe('excellent');
    });

    it('should return "high" for score >= 6', () => {
      expect(service.getQualityCategory(6)).toBe('high');
      expect(service.getQualityCategory(7.5)).toBe('high');
    });

    it('should return "medium" for score >= 4', () => {
      expect(service.getQualityCategory(4)).toBe('medium');
      expect(service.getQualityCategory(5.5)).toBe('medium');
    });

    it('should return "low" for score < 4', () => {
      expect(service.getQualityCategory(0)).toBe('low');
      expect(service.getQualityCategory(3.9)).toBe('low');
    });
  });

  describe('getSuggestions', () => {
    it('should suggest improvements for incomplete listing', () => {
      const listing = {
        title: 'Short',
        description: 'Short desc',
        price: 1000000,
        address: 'Address',
        adminUnitCode: '79',
        areaLand: null,
        areaFloor: null,
        bedrooms: null,
        bathrooms: null,
        direction: null,
        legalStatus: null,
        ownershipType: null,
        highlights: [],
        amenities: [],
      } as unknown as Listing;

      const suggestions = service.getSuggestions(listing);

      expect(suggestions).toContain(
        'Add a more detailed title (at least 20 characters)',
      );
      expect(suggestions).toContain(
        'Add a detailed description (at least 100 characters)',
      );
      expect(suggestions).toContain('Add property area information');
      expect(suggestions).toContain('Add number of bedrooms');
      expect(suggestions).toContain('Add number of bathrooms');
    });

    it('should return empty array for complete listing', () => {
      const listing = {
        title: 'This is a complete and detailed title',
        description:
          'This is a very detailed description with more than 100 characters explaining everything about the property',
        price: 1000000,
        address: 'Address',
        adminUnitCode: '79',
        areaLand: 100,
        areaFloor: 80,
        bedrooms: 3,
        bathrooms: 2,
        direction: 'East',
        legalStatus: 'Pink Book',
        ownershipType: 'Individual',
        highlights: ['Feature 1', 'Feature 2', 'Feature 3'],
        amenities: ['Amenity 1', 'Amenity 2', 'Amenity 3'],
      } as Listing;

      const suggestions = service.getSuggestions(listing);

      expect(suggestions).toHaveLength(0);
    });
  });
});
