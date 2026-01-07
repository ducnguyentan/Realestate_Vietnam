import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Listing } from './listing.entity';
export declare class Agent extends BaseEntity {
  userId: string;
  user: User | null;
  licenseNumber: string | null;
  companyName: string | null;
  experienceYears: number;
  specializations: string[];
  serviceAreas: string[];
  commissionRate: number;
  totalListings: number;
  totalDeals: number;
  ratingAvg: number;
  status: string;
  listings: Listing[];
}
//# sourceMappingURL=agent.entity.d.ts.map
