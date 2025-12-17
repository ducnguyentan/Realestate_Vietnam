import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Listing } from './listing.entity';

@Entity('agents')
export class Agent extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string = '';

  @OneToOne(() => User, (user) => user.agent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User | null = null;

  @Column({ name: 'license_number', type: 'varchar', length: 50, nullable: true })
  licenseNumber: string | null = null;

  @Column({ name: 'company_name', type: 'varchar', length: 200, nullable: true })
  companyName: string | null = null;

  @Column({ name: 'experience_years', type: 'int', default: 0 })
  experienceYears: number = 0;

  @Column({ type: 'jsonb', default: [] })
  specializations: string[] = [];

  @Column({ name: 'service_areas', type: 'jsonb', default: [] })
  serviceAreas: string[] = [];

  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, default: 2.0 })
  commissionRate: number = 2.0;

  @Column({ name: 'total_listings', type: 'int', default: 0 })
  totalListings: number = 0;

  @Column({ name: 'total_deals', type: 'int', default: 0 })
  totalDeals: number = 0;

  @Column({ name: 'rating_avg', type: 'decimal', precision: 3, scale: 2, default: 0 })
  ratingAvg: number = 0;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string = 'pending';

  @OneToMany(() => Listing, (listing) => listing.agent)
  listings: Listing[] = [];
}
