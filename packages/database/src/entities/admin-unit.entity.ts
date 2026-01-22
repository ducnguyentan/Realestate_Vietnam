import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('admin_units')
export class AdminUnit extends BaseEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ name: 'name_en', type: 'varchar', length: 100, nullable: true })
  nameEn: string | null = null;

  @Column({ type: 'int' })
  level!: number;

  @Column({ name: 'parent_code', type: 'varchar', length: 20, nullable: true })
  parentCode: string | null = null;

  @ManyToOne(() => AdminUnit, (unit) => unit.children, { nullable: true })
  @JoinColumn({ name: 'parent_code', referencedColumnName: 'code' })
  parent: AdminUnit | null = null;

  @OneToMany(() => AdminUnit, (unit) => unit.parent)
  children!: AdminUnit[];

  @Column({ type: 'varchar', length: 20, nullable: true })
  region: string | null = null;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number | null = null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number | null = null;

  @Column({ type: 'jsonb', nullable: true })
  polygon: Record<string, unknown> | null = null;

  @Column({ type: 'int', nullable: true })
  population: number | null = null;

  @Column({ name: 'area_km2', type: 'decimal', precision: 10, scale: 2, nullable: true })
  areaKm2: number | null = null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean = true;
}
