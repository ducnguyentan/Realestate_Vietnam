import { User } from './user.entity';
import { Role } from './role.entity';
export declare class UserRole {
  id: string;
  userId: string;
  roleId: string;
  grantedAt: Date;
  user: User | null;
  role: Role | null;
}
//# sourceMappingURL=user-role.entity.d.ts.map
