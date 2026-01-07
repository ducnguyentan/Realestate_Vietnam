"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deal = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const listing_entity_1 = require("./listing.entity");
const lead_entity_1 = require("./lead.entity");
const user_entity_1 = require("./user.entity");
const agent_entity_1 = require("./agent.entity");
let Deal = class Deal extends base_entity_1.BaseEntity {
    code = '';
    listingId = '';
    listing = null;
    leadId = null;
    lead = null;
    buyerUserId = '';
    buyerUser = null;
    sellerUserId = '';
    sellerUser = null;
    agentId = null;
    agent = null;
    stage = 'new';
    stageHistory = [];
    agreedPrice = null;
    depositAmount = null;
    services = {};
    depositDueAt = null;
    signingDueAt = null;
    closingDueAt = null;
    handoverAt = null;
    completionType = null;
    cancellationReason = null;
    internalNotes = null;
    completedAt = null;
};
exports.Deal = Deal;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], Deal.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'listing_id', type: 'uuid' }),
    __metadata("design:type", String)
], Deal.prototype, "listingId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => listing_entity_1.Listing),
    (0, typeorm_1.JoinColumn)({ name: 'listing_id' }),
    __metadata("design:type", Object)
], Deal.prototype, "listing", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lead_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Deal.prototype, "leadId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lead_entity_1.Lead, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'lead_id' }),
    __metadata("design:type", Object)
], Deal.prototype, "lead", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Deal.prototype, "buyerUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'buyer_user_id' }),
    __metadata("design:type", Object)
], Deal.prototype, "buyerUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seller_user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Deal.prototype, "sellerUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'seller_user_id' }),
    __metadata("design:type", Object)
], Deal.prototype, "sellerUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'agent_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Deal.prototype, "agentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agent_entity_1.Agent, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'agent_id' }),
    __metadata("design:type", Object)
], Deal.prototype, "agent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: 'new' }),
    __metadata("design:type", String)
], Deal.prototype, "stage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stage_history', type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], Deal.prototype, "stageHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'agreed_price', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], Deal.prototype, "agreedPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deposit_amount', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], Deal.prototype, "depositAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Deal.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deposit_due_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Deal.prototype, "depositDueAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'signing_due_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Deal.prototype, "signingDueAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closing_due_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Deal.prototype, "closingDueAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'handover_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Deal.prototype, "handoverAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completion_type', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Deal.prototype, "completionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancellation_reason', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Deal.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'internal_notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Deal.prototype, "internalNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Deal.prototype, "completedAt", void 0);
exports.Deal = Deal = __decorate([
    (0, typeorm_1.Entity)('deals')
], Deal);
//# sourceMappingURL=deal.entity.js.map