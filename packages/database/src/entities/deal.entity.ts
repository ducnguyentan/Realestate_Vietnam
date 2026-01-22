import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Listing } from './listing.entity';
import { Lead } from './lead.entity';
import { User } from './user.entity';
import { Agent } from './agent.entity';

@Entity('deals')
export class Deal extends BaseEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  code!: string;

  @Column({ name: 'listing_id', type: 'uuid' })
  listingId!: string;

  @ManyToOne(() => Listing)
  @JoinColumn({ name: 'listing_id' })
  listing: Listing | null = null;

  @Column({ name: 'lead_id', type: 'uuid', nullable: true })
  leadId: string | null = null;

  @ManyToOne(() => Lead, { nullable: true })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead | null = null;

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

  @Column({ type: 'varchar', length: 30, default: 'new' })
  stage: string = 'new';

  @Column({ name: 'stage_history', type: 'jsonb', default: [] })
  stageHistory: Array<{ stage: string; timestamp: string }> = [];

  @Column({ name: 'agreed_price', type: 'bigint', nullable: true })
  agreedPrice: number | null = null;

  @Column({ name: 'deposit_amount', type: 'bigint', nullable: true })
  depositAmount: number | null = null;

  @Column({ type: 'jsonb', default: {} })
  services: Record<string, unknown> = {};

  @Column({ name: 'deposit_due_at', type: 'timestamptz', nullable: true })
  depositDueAt: Date | null = null;

  @Column({ name: 'signing_due_at', type: 'timestamptz', nullable: true })
  signingDueAt: Date | null = null;

  @Column({ name: 'closing_due_at', type: 'timestamptz', nullable: true })
  closingDueAt: Date | null = null;

  @Column({ name: 'handover_at', type: 'timestamptz', nullable: true })
  handoverAt: Date | null = null;

  @Column({ name: 'completion_type', type: 'varchar', length: 20, nullable: true })
  completionType: string | null = null;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason: string | null = null;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes: string | null = null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null = null;
}
