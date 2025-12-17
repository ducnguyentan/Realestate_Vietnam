import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string = '';

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string = '';

  @Column({ name: 'display_name', type: 'varchar', length: 100 })
  displayName: string = '';

  @Column({ type: 'text', nullable: true })
  description: string | null = null;

  @Column({ type: 'jsonb', default: [] })
  permissions: string[] = [];

  @Column({ name: 'is_system', type: 'boolean', default: false })
  isSystem: boolean = false;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date = new Date();

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[] = [];
}
