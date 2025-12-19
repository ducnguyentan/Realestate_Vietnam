import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from '@realestate/database';
import { ListingsController } from './listings.controller';
import { ListingsService } from './services/listings.service';
import { QualityScoreService } from './services/quality-score.service';

@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  controllers: [ListingsController],
  providers: [ListingsService, QualityScoreService],
  exports: [ListingsService],
})
export class ListingsModule {}
