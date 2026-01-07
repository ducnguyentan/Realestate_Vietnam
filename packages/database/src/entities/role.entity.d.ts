import { UserRole } from './user-role.entity';
export declare class Role {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  permissions: string[];
  isSystem: boolean;
  createdAt: Date;
  userRoles: UserRole[];
}
//# sourceMappingURL=role.entity.d.ts.map
