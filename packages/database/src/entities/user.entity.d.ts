import { BaseEntity } from './base.entity';
import { UserRole } from './user-role.entity';
import { Agent } from './agent.entity';
import { AdminUnit } from './admin-unit.entity';
import { Listing } from './listing.entity';
export declare class User extends BaseEntity {
  phone: string | null;
  email: string | null;
  passwordHash: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  idCardNumber: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  address: string | null;
  adminUnitCode: string | null;
  adminUnit: AdminUnit | null;
  status: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  identityVerified: boolean;
  identityVerifiedAt: Date | null;
  idFrontImage: string | null;
  idBackImage: string | null;
  idSelfieImage: string | null;
  lastLoginAt: Date | null;
  settings: Record<string, unknown>;
  userRoles: UserRole[];
  agent: Agent | null;
  listings: Listing[];
}
//# sourceMappingURL=user.entity.d.ts.map
