import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Agent } from './agent.entity';
import { PropertyType } from './property-type.entity';
import { AdminUnit } from './admin-unit.entity';

@Entity('listings')
@Index('idx_listings_user', ['userId'])
@Index('idx_listings_status', ['status'])
@Index('idx_listings_type', ['transactionType', 'propertyTypeId'])
@Index('idx_listings_location', ['adminUnitCode'])
@Index('idx_listings_price', ['price'])
@Index('idx_listings_featured', ['isFeatured', 'featuredUntil'])
export class Listing extends BaseEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  code: string = '';

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string = '';

  @ManyToOne(() => User, (user) => user.listings)
  @JoinColumn({ name: 'user_id' })
  user: User | null = null;

  @Column({ name: 'agent_id', type: 'uuid', nullable: true })
  agentId: string | null = null;

  @ManyToOne(() => Agent, (agent) => agent.listings, { nullable: true })
  @JoinColumn({ name: 'agent_id' })
  agent: Agent | null = null;

  @Column({ name: 'transaction_type', type: 'varchar', length: 20 })
  transactionType: 'sell' | 'rent' = 'sell';

  @Column({ name: 'property_type_id', type: 'uuid' })
  propertyTypeId: string = '';

  @ManyToOne(() => PropertyType, (pt) => pt.listings)
  @JoinColumn({ name: 'property_type_id' })
  propertyType: PropertyType | null = null;

  @Column({ type: 'varchar', length: 200 })
  title: string = '';

  @Column({ type: 'text', nullable: true })
  description: string | null = null;

  @Column({ type: 'jsonb', default: [] })
  highlights: string[] = [];

  @Column({ name: 'admin_unit_code', type: 'varchar', length: 20 })
  adminUnitCode: string = '';

  @ManyToOne(() => AdminUnit)
  @JoinColumn({ name: 'admin_unit_code', referencedColumnName: 'code' })
  adminUnit: AdminUnit | null = null;

  @Column({ type: 'text' })
  address: string = '';

  @Column({ type: 'varchar', length: 200, nullable: true })
  street: string | null = null;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number | null = null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number | null = null;

  @Column({ name: 'area_land', type: 'decimal', precision: 10, scale: 2, nullable: true })
  areaLand: number | null = null;

  @Column({ name: 'area_floor', type: 'decimal', precision: 10, scale: 2, nullable: true })
  areaFloor: number | null = null;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  frontage: number | null = null;

  @Column({ type: 'int', nullable: true })
  floors: number | null = null;

  @Column({ type: 'int', nullable: true })
  bedrooms: number | null = null;

  @Column({ type: 'int', nullable: true })
  bathrooms: number | null = null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  direction: string | null = null;

  @Column({ type: 'bigint' })
  price: number = 0;

  @Column({ name: 'price_unit', type: 'varchar', length: 20, default: 'total' })
  priceUnit: string = 'total';

  @Column({ name: 'price_negotiable', type: 'boolean', default: false })
  priceNegotiable: boolean = false;

  @Column({ name: 'legal_status', type: 'varchar', length: 30, nullable: true })
  legalStatus: string | null = null;

  @Column({ name: 'ownership_type', type: 'varchar', length: 30, nullable: true })
  ownershipType: string | null = null;

  @Column({ name: 'is_mortgaged', type: 'boolean', default: false })
  isMortgaged: boolean = false;

  @Column({ type: 'jsonb', default: [] })
  amenities: string[] = [];

  @Column({ type: 'varchar', length: 30, nullable: true })
  furniture: string | null = null;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string = 'draft';

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean = false;

  @Column({ name: 'featured_until', type: 'timestamptz', nullable: true })
  featuredUntil: Date | null = null;

  @Column({ type: 'varchar', length: 300, unique: true, nullable: true })
  slug: string | null = null;

  @Column({ type: 'int', default: 0 })
  views: number = 0;

  @Column({ type: 'int', default: 0 })
  saves: number = 0;

  @Column({ type: 'int', default: 0 })
  contacts: number = 0;

  @Column({ name: 'quality_score', type: 'decimal', precision: 3, scale: 2, nullable: true })
  qualityScore: number | null = null;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date | null = null;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt: Date | null = null;
}
