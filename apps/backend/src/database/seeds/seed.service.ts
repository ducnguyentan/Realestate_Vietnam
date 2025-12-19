import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyType, AdminUnit } from '@realestate/database';
import { propertyTypesSeed } from './property-types.seed';
import { adminUnitsSeed } from './admin-units.seed';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(PropertyType)
    private readonly propertyTypeRepository: Repository<PropertyType>,
    @InjectRepository(AdminUnit)
    private readonly adminUnitRepository: Repository<AdminUnit>,
  ) {}

  /**
   * Seed property types
   */
  async seedPropertyTypes(): Promise<void> {
    this.logger.log('Seeding property types...');

    const existingCount = await this.propertyTypeRepository.count();
    if (existingCount > 0) {
      this.logger.log(
        `Property types already seeded (${existingCount} records). Skipping.`,
      );
      return;
    }

    for (const data of propertyTypesSeed) {
      const propertyType = this.propertyTypeRepository.create(data);
      await this.propertyTypeRepository.save(propertyType);
    }

    this.logger.log(`✓ Seeded ${propertyTypesSeed.length} property types`);
  }

  /**
   * Seed admin units (63 provinces/cities)
   */
  async seedAdminUnits(): Promise<void> {
    this.logger.log('Seeding admin units...');

    const existingCount = await this.adminUnitRepository.count();
    if (existingCount > 0) {
      this.logger.log(
        `Admin units already seeded (${existingCount} records). Skipping.`,
      );
      return;
    }

    for (const data of adminUnitsSeed) {
      const adminUnit = this.adminUnitRepository.create(data);
      await this.adminUnitRepository.save(adminUnit);
    }

    this.logger.log(
      `✓ Seeded ${adminUnitsSeed.length} admin units (provinces/cities)`,
    );
  }

  /**
   * Run all seeds
   */
  async runSeeds(): Promise<void> {
    this.logger.log('=== Starting database seeding ===');

    try {
      await this.seedPropertyTypes();
      await this.seedAdminUnits();

      this.logger.log('=== Database seeding completed successfully ===');
    } catch (error) {
      this.logger.error('Database seeding failed', error);
      throw error;
    }
  }
}
