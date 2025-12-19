import { Entity, Column, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from './user-role.entity';
import { Agent } from './agent.entity';
import { AdminUnit } from './admin-unit.entity';
import { Listing } from './listing.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 15, unique: true, nullable: true })
  phone: string | null = null;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string | null = null;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true })
  passwordHash: string | null = null;

  @Column({ name: 'full_name', type: 'varchar', length: 100, nullable: true })
  fullName: string | null = null;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatarUrl: string | null = null;

  @Column({ name: 'id_card_number', type: 'varchar', length: 20, nullable: true })
  idCardNumber: string | null = null;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date | null = null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: string | null = null;

  @Column({ type: 'text', nullable: true })
  address: string | null = null;

  @Column({ name: 'admin_unit_code', type: 'varchar', length: 20, nullable: true })
  adminUnitCode: string | null = null;

  @ManyToOne(() => AdminUnit, { nullable: true })
  @JoinColumn({ name: 'admin_unit_code', referencedColumnName: 'code' })
  adminUnit: AdminUnit | null = null;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string = 'active';

  @Column({ name: 'phone_verified', type: 'boolean', default: false })
  phoneVerified: boolean = false;

  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified: boolean = false;

  @Column({ name: 'identity_verified', type: 'boolean', default: false })
  identityVerified: boolean = false;

  @Column({ name: 'identity_verified_at', type: 'timestamptz', nullable: true })
  identityVerifiedAt: Date | null = null;

  @Column({ name: 'id_front_image', type: 'varchar', length: 500, nullable: true })
  idFrontImage: string | null = null;

  @Column({ name: 'id_back_image', type: 'varchar', length: 500, nullable: true })
  idBackImage: string | null = null;

  @Column({ name: 'id_selfie_image', type: 'varchar', length: 500, nullable: true })
  idSelfieImage: string | null = null;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null = null;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, unknown> = {};

  // Relations
  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[] = [];

  @OneToOne(() => Agent, (agent) => agent.user)
  agent: Agent | null = null;

  @OneToMany(() => Listing, (listing) => listing.user)
  listings: Listing[] = [];
}
