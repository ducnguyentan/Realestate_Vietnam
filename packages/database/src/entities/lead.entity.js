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
exports.Lead = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const listing_entity_1 = require("./listing.entity");
const user_entity_1 = require("./user.entity");
const agent_entity_1 = require("./agent.entity");
let Lead = class Lead extends base_entity_1.BaseEntity {
    listingId = '';
    listing = null;
    buyerUserId = '';
    buyerUser = null;
    sellerUserId = '';
    sellerUser = null;
    agentId = null;
    agent = null;
    contactName = null;
    contactPhone = null;
    message = null;
    status = 'new';
    priority = 'normal';
    budgetMin = null;
    budgetMax = null;
    interestLevel = null;
    lastContactedAt = null;
    nextFollowUpAt = null;
    source = null;
};
exports.Lead = Lead;
__decorate([
    (0, typeorm_1.Column)({ name: 'listing_id', type: 'uuid' }),
    __metadata("design:type", String)
], Lead.prototype, "listingId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => listing_entity_1.Listing),
    (0, typeorm_1.JoinColumn)({ name: 'listing_id' }),
    __metadata("design:type", Object)
], Lead.prototype, "listing", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Lead.prototype, "buyerUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'buyer_user_id' }),
    __metadata("design:type", Object)
], Lead.prototype, "buyerUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seller_user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Lead.prototype, "sellerUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'seller_user_id' }),
    __metadata("design:type", Object)
], Lead.prototype, "sellerUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'agent_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Lead.prototype, "agentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agent_entity_1.Agent, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'agent_id' }),
    __metadata("design:type", Object)
], Lead.prototype, "agent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Lead.prototype, "contactName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_phone', type: 'varchar', length: 15, nullable: true }),
    __metadata("design:type", Object)
], Lead.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Lead.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'new' }),
    __metadata("design:type", String)
], Lead.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'normal' }),
    __metadata("design:type", String)
], Lead.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'budget_min', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], Lead.prototype, "budgetMin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'budget_max', type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], Lead.prototype, "budgetMax", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'interest_level', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Lead.prototype, "interestLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_contacted_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Lead.prototype, "lastContactedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_follow_up_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Lead.prototype, "nextFollowUpAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Lead.prototype, "source", void 0);
exports.Lead = Lead = __decorate([
    (0, typeorm_1.Entity)('leads')
], Lead);
//# sourceMappingURL=lead.entity.js.map