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
exports.Agent = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
const listing_entity_1 = require("./listing.entity");
let Agent = class Agent extends base_entity_1.BaseEntity {
    userId = '';
    user = null;
    licenseNumber = null;
    companyName = null;
    experienceYears = 0;
    specializations = [];
    serviceAreas = [];
    commissionRate = 2.0;
    totalListings = 0;
    totalDeals = 0;
    ratingAvg = 0;
    status = 'pending';
    listings = [];
};
exports.Agent = Agent;
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid', unique: true }),
    __metadata("design:type", String)
], Agent.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.agent, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], Agent.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'license_number', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Agent.prototype, "licenseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_name', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], Agent.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'experience_years', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Agent.prototype, "experienceYears", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], Agent.prototype, "specializations", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service_areas', type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], Agent.prototype, "serviceAreas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, default: 2.0 }),
    __metadata("design:type", Number)
], Agent.prototype, "commissionRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_listings', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Agent.prototype, "totalListings", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_deals', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Agent.prototype, "totalDeals", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rating_avg', type: 'decimal', precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Agent.prototype, "ratingAvg", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'pending' }),
    __metadata("design:type", String)
], Agent.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => listing_entity_1.Listing, (listing) => listing.agent),
    __metadata("design:type", Array)
], Agent.prototype, "listings", void 0);
exports.Agent = Agent = __decorate([
    (0, typeorm_1.Entity)('agents')
], Agent);
//# sourceMappingURL=agent.entity.js.map