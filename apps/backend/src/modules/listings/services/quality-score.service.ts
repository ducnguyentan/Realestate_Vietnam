import { Injectable } from '@nestjs/common';
import { Listing } from '@realestate/database';

/**
 * Quality Score Calculation Service
 *
 * Calculates listing quality score (0-10) based on completeness and detail level
 * Higher scores improve search ranking and visibility
 */
@Injectable()
export class QualityScoreService {
  /**
   * Calculate quality score for a listing
   * Score breakdown (0-10):
   * - Basic info (3 points): title, description, price, location
   * - Property details (3 points): area, bedrooms, bathrooms, direction
   * - Legal & ownership (2 points): legal status, ownership type
   * - Media & amenities (2 points): highlights, amenities
   */
  calculateScore(listing: Listing): number {
    let score = 0;

    // Basic info (3 points)
    if (listing.title && listing.title.length >= 20) score += 1;
    if (listing.description && listing.description.length >= 100) score += 1;
    if (listing.price > 0) score += 0.5;
    if (listing.address && listing.adminUnitCode) score += 0.5;

    // Property details (3 points)
    if (listing.areaLand || listing.areaFloor) score += 1;
    if (listing.bedrooms !== null && listing.bedrooms > 0) score += 0.5;
    if (listing.bathrooms !== null && listing.bathrooms > 0) score += 0.5;
    if (listing.direction) score += 0.5;
    if (listing.frontage) score += 0.5;

    // Legal & ownership (2 points)
    if (listing.legalStatus) score += 1;
    if (listing.ownershipType) score += 1;

    // Media & amenities (2 points)
    if (listing.highlights && listing.highlights.length >= 3) score += 1;
    if (listing.amenities && listing.amenities.length >= 3) score += 1;

    // Round to 2 decimal places
    return Math.round(score * 100) / 100;
  }

  /**
   * Get quality score category
   */
  getQualityCategory(score: number): 'low' | 'medium' | 'high' | 'excellent' {
    if (score >= 8) return 'excellent';
    if (score >= 6) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }

  /**
   * Get suggestions to improve listing quality
   */
  getSuggestions(listing: Listing): string[] {
    const suggestions: string[] = [];

    if (!listing.title || listing.title.length < 20) {
      suggestions.push('Add a more detailed title (at least 20 characters)');
    }

    if (!listing.description || listing.description.length < 100) {
      suggestions.push('Add a detailed description (at least 100 characters)');
    }

    if (!listing.areaLand && !listing.areaFloor) {
      suggestions.push('Add property area information');
    }

    if (listing.bedrooms === null || listing.bedrooms === 0) {
      suggestions.push('Add number of bedrooms');
    }

    if (listing.bathrooms === null || listing.bathrooms === 0) {
      suggestions.push('Add number of bathrooms');
    }

    if (!listing.direction) {
      suggestions.push('Add property direction (facing)');
    }

    if (!listing.legalStatus) {
      suggestions.push('Add legal status (e.g., pink book, red book)');
    }

    if (!listing.ownershipType) {
      suggestions.push('Add ownership type');
    }

    if (!listing.highlights || listing.highlights.length < 3) {
      suggestions.push('Add at least 3 property highlights');
    }

    if (!listing.amenities || listing.amenities.length < 3) {
      suggestions.push('Add at least 3 amenities');
    }

    return suggestions;
  }
}
