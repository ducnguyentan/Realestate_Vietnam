import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Listing } from './listing.entity';
import { User } from './user.entity';
import { Agent } from './agent.entity';

@Entity('leads')
export class Lead extends BaseEntity {
  @Column({ name: 'listing_id', type: 'uuid' })
  listingId!: string;

  @ManyToOne(() => Listing)
  @JoinColumn({ name: 'listing_id' })
  listing: Listing | null = null;

  @Column({ name: 'buyer_user_id', type: 'uuid' })
  buyerUserId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'buyer_user_id' })
  buyerUser: User | null = null;

  @Column({ name: 'seller_user_id', type: 'uuid' })
  sellerUserId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_user_id' })
  sellerUser: User | null = null;

  @Column({ name: 'agent_id', type: 'uuid', nullable: true })
  agentId: string | null = null;

  @ManyToOne(() => Agent, { nullable: true })
  @JoinColumn({ name: 'agent_id' })
  agent: Agent | null = null;

  @Column({ name: 'contact_name', type: 'varchar', length: 100, nullable: true })
  contactName: string | null = null;

  @Column({ name: 'contact_phone', type: 'varchar', length: 15, nullable: true })
  contactPhone: string | null = null;

  @Column({ type: 'text', nullable: true })
  message: string | null = null;

  @Column({ type: 'varchar', length: 20, default: 'new' })
  status: string = 'new';

  @Column({ type: 'varchar', length: 10, default: 'normal' })
  priority: string = 'normal';

  @Column({ name: 'budget_min', type: 'bigint', nullable: true })
  budgetMin: number | null = null;

  @Column({ name: 'budget_max', type: 'bigint', nullable: true })
  budgetMax: number | null = null;

  @Column({ name: 'interest_level', type: 'int', nullable: true })
  interestLevel: number | null = null;

  @Column({ name: 'last_contacted_at', type: 'timestamptz', nullable: true })
  lastContactedAt: Date | null = null;

  @Column({ name: 'next_follow_up_at', type: 'timestamptz', nullable: true })
  nextFollowUpAt: Date | null = null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  source: string | null = null;
}
