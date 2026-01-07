import { BaseEntity } from './base.entity';
import { Listing } from './listing.entity';
import { User } from './user.entity';
import { Agent } from './agent.entity';
export declare class Lead extends BaseEntity {
  listingId: string;
  listing: Listing | null;
  buyerUserId: string;
  buyerUser: User | null;
  sellerUserId: string;
  sellerUser: User | null;
  agentId: string | null;
  agent: Agent | null;
  contactName: string | null;
  contactPhone: string | null;
  message: string | null;
  status: string;
  priority: string;
  budgetMin: number | null;
  budgetMax: number | null;
  interestLevel: number | null;
  lastContactedAt: Date | null;
  nextFollowUpAt: Date | null;
  source: string | null;
}
//# sourceMappingURL=lead.entity.d.ts.map
