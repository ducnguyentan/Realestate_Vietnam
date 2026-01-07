import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Listing } from './listing.entity';

@Entity('property_types')
export class PropertyType {
  @PrimaryGeneratedColumn('uuid')
  id: string = '';

  @Column({ type: 'varchar', length: 30, unique: true })
  code: string = '';

  @Column({ type: 'varchar', length: 100 })
  name: string = '';

  @Column({ name: 'name_en', type: 'varchar', length: 100, nullable: true })
  nameEn: string | null = null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon: string | null = null;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId: string | null = null;

  @ManyToOne(() => PropertyType, (pt) => pt.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: PropertyType | null = null;

  @OneToMany(() => PropertyType, (pt) => pt.parent)
  children!: PropertyType[];

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number = 0;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean = true;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date = new Date();

  @OneToMany(() => Listing, (listing) => listing.propertyType)
  listings!: Listing[];
}
