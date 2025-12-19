import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyType, AdminUnit } from '@realestate/database';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyType, AdminUnit])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
