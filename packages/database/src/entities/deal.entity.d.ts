import { BaseEntity } from './base.entity';
import { Listing } from './listing.entity';
import { Lead } from './lead.entity';
import { User } from './user.entity';
import { Agent } from './agent.entity';
export declare class Deal extends BaseEntity {
  code: string;
  listingId: string;
  listing: Listing | null;
  leadId: string | null;
  lead: Lead | null;
  buyerUserId: string;
  buyerUser: User | null;
  sellerUserId: string;
  sellerUser: User | null;
  agentId: string | null;
  agent: Agent | null;
  stage: string;
  stageHistory: Array<{
    stage: string;
    timestamp: string;
  }>;
  agreedPrice: number | null;
  depositAmount: number | null;
  services: Record<string, unknown>;
  depositDueAt: Date | null;
  signingDueAt: Date | null;
  closingDueAt: Date | null;
  handoverAt: Date | null;
  completionType: string | null;
  cancellationReason: string | null;
  internalNotes: string | null;
  completedAt: Date | null;
}
//# sourceMappingURL=deal.entity.d.ts.map
