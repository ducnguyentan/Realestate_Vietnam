import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Between,
} from 'typeorm';
import { Listing } from '@realestate/database';
import { CreateListingDto, UpdateListingDto, FilterListingDto } from '../dto';
import { QualityScoreService } from './quality-score.service';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    private readonly qualityScoreService: QualityScoreService,
  ) {}

  /**
   * Create a new listing
   */
  async create(
    userId: string,
    createListingDto: CreateListingDto,
  ): Promise<Listing> {
    // Generate unique listing code (format: BDS-HCM-250101)
    const code = await this.generateListingCode(createListingDto.adminUnitCode);

    // Generate SEO-friendly slug
    const slug = await this.generateSlug(createListingDto.title);

    // Create listing
    const listing = this.listingRepository.create({
      ...createListingDto,
      userId,
      code,
      slug,
      status: 'draft',
    });

    // Calculate quality score
    listing.qualityScore = this.qualityScoreService.calculateScore(listing);

    return this.listingRepository.save(listing);
  }

  /**
   * Get listing by ID
   */
  async findById(id: string, userId?: string): Promise<Listing> {
    const listing = await this.listingRepository.findOne({
      where: { id },
      relations: ['user', 'propertyType', 'adminUnit'],
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Increment view count (skip if owner)
    if (!userId || userId !== listing.userId) {
      listing.views += 1;
      await this.listingRepository.save(listing);
    }

    return listing;
  }

  /**
   * Get listing by code
   */
  async findByCode(code: string): Promise<Listing> {
    const listing = await this.listingRepository.findOne({
      where: { code },
      relations: ['user', 'propertyType', 'adminUnit'],
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  /**
   * Get listing by slug
   */
  async findBySlug(slug: string): Promise<Listing> {
    const listing = await this.listingRepository.findOne({
      where: { slug },
      relations: ['user', 'propertyType', 'adminUnit'],
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  /**
   * Get all listings with filters and pagination
   */
  async findAll(
    filterDto: FilterListingDto,
  ): Promise<{ data: Listing[]; total: number; page: number; limit: number }> {
    const {
      transactionType,
      propertyTypeId,
      adminUnitCode,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      bathrooms,
      direction,
      status,
      isFeatured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 20,
    } = filterDto;

    const where: FindOptionsWhere<Listing> = {};

    // Apply filters
    if (transactionType) where.transactionType = transactionType;
    if (propertyTypeId) where.propertyTypeId = propertyTypeId;
    if (adminUnitCode) where.adminUnitCode = adminUnitCode;
    if (bedrooms) where.bedrooms = bedrooms;
    if (bathrooms) where.bathrooms = bathrooms;
    if (direction) where.direction = direction;
    if (status) where.status = status;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;

    // Price range
    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.price = LessThanOrEqual(maxPrice);
    }

    // Search by title or description
    const queryBuilder = this.listingRepository.createQueryBuilder('listing');
    queryBuilder.leftJoinAndSelect('listing.user', 'user');
    queryBuilder.leftJoinAndSelect('listing.propertyType', 'propertyType');
    queryBuilder.leftJoinAndSelect('listing.adminUnit', 'adminUnit');

    // Apply where conditions
    Object.entries(where).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'object' && 'from' in value && 'to' in value) {
          queryBuilder.andWhere(`listing.${key} BETWEEN :min AND :max`, {
            min: value.from,
            max: value.to,
          });
        } else {
          queryBuilder.andWhere(`listing.${key} = :${key}`, { [key]: value });
        }
      }
    });

    // Area range
    if (minArea !== undefined || maxArea !== undefined) {
      const areaConditions = [];
      if (minArea !== undefined) {
        areaConditions.push(
          '(listing.areaLand >= :minArea OR listing.areaFloor >= :minArea)',
        );
      }
      if (maxArea !== undefined) {
        areaConditions.push(
          '(listing.areaLand <= :maxArea OR listing.areaFloor <= :maxArea)',
        );
      }
      queryBuilder.andWhere(areaConditions.join(' AND '), { minArea, maxArea });
    }

    // Search
    if (search) {
      queryBuilder.andWhere(
        '(listing.title ILIKE :search OR listing.description ILIKE :search OR listing.address ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Sorting
    const validSortFields = [
      'createdAt',
      'price',
      'views',
      'qualityScore',
      'publishedAt',
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`listing.${sortField}`, sortOrder);

    // Featured listings first
    if (isFeatured) {
      queryBuilder.addOrderBy('listing.featuredUntil', 'DESC');
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Get user's listings
   */
  async findByUserId(userId: string): Promise<Listing[]> {
    return this.listingRepository.find({
      where: { userId },
      relations: ['propertyType', 'adminUnit'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Update listing
   */
  async update(
    id: string,
    userId: string,
    updateListingDto: UpdateListingDto,
  ): Promise<Listing> {
    const listing = await this.listingRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    // Update slug if title changed
    if (updateListingDto.title && updateListingDto.title !== listing.title) {
      listing.slug = await this.generateSlug(updateListingDto.title);
    }

    // Update fields
    Object.assign(listing, updateListingDto);

    // Recalculate quality score
    listing.qualityScore = this.qualityScoreService.calculateScore(listing);

    return this.listingRepository.save(listing);
  }

  /**
   * Delete listing
   */
  async delete(id: string, userId: string): Promise<void> {
    const listing = await this.listingRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await this.listingRepository.remove(listing);
  }

  /**
   * Publish listing (change status from draft to pending)
   */
  async publish(id: string, userId: string): Promise<Listing> {
    const listing = await this.listingRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only publish your own listings');
    }

    if (listing.status !== 'draft') {
      throw new BadRequestException('Only draft listings can be published');
    }

    // Check minimum quality score
    const qualityScore = this.qualityScoreService.calculateScore(listing);
    if (qualityScore < 4) {
      const suggestions = this.qualityScoreService.getSuggestions(listing);
      throw new BadRequestException({
        message: 'Listing quality score too low. Please improve your listing.',
        qualityScore,
        suggestions,
      });
    }

    listing.status = 'pending';
    listing.publishedAt = new Date();

    return this.listingRepository.save(listing);
  }

  /**
   * Increment save count
   */
  async incrementSaves(id: string): Promise<void> {
    await this.listingRepository.increment({ id }, 'saves', 1);
  }

  /**
   * Increment contact count
   */
  async incrementContacts(id: string): Promise<void> {
    await this.listingRepository.increment({ id }, 'contacts', 1);
  }

  /**
   * Get quality score and suggestions
   */
  async getQualityInfo(
    id: string,
    userId: string,
  ): Promise<{ score: number; category: string; suggestions: string[] }> {
    const listing = await this.listingRepository.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException(
        'You can only view quality info for your own listings',
      );
    }

    const score = this.qualityScoreService.calculateScore(listing);
    const category = this.qualityScoreService.getQualityCategory(score);
    const suggestions = this.qualityScoreService.getSuggestions(listing);

    return { score, category, suggestions };
  }

  /**
   * Generate unique listing code (format: BDS-{CITY_CODE}-{YYMMDD}{COUNTER})
   * Example: BDS-HCM-25010100001
   */
  private async generateListingCode(adminUnitCode: string): Promise<string> {
    const cityCode = this.getCityCode(adminUnitCode);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD

    // Get today's listing count for this city
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const count = await this.listingRepository.count({
      where: {
        adminUnitCode,
        createdAt: MoreThanOrEqual(startOfDay),
      },
    });

    const counter = String(count + 1).padStart(5, '0');
    return `BDS-${cityCode}-${dateStr}${counter}`;
  }

  /**
   * Get city code from admin unit code
   */
  private getCityCode(adminUnitCode: string): string {
    const cityCodeMap: Record<string, string> = {
      '01': 'HN', // Hanoi
      '79': 'HCM', // Ho Chi Minh City
      '48': 'DN', // Da Nang
      '31': 'HP', // Hai Phong
      '92': 'CT', // Can Tho
    };

    return cityCodeMap[adminUnitCode] || adminUnitCode.padStart(2, '0');
  }

  /**
   * Generate SEO-friendly slug from title
   */
  private async generateSlug(title: string): Promise<string> {
    // Convert to lowercase and remove Vietnamese diacritics
    const slug = this.removeVietnameseTones(title)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check for uniqueness
    let uniqueSlug = slug;
    let counter = 1;

    while (
      await this.listingRepository.findOne({ where: { slug: uniqueSlug } })
    ) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }

  /**
   * Remove Vietnamese diacritics
   */
  private removeVietnameseTones(str: string): string {
    const from =
      'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ';
    const to =
      'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyaaaaaaaaaaaaaaaaaeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';

    for (let i = 0; i < from.length; i++) {
      str = str.replace(new RegExp(from[i], 'g'), to[i]);
    }

    return str;
  }
}
