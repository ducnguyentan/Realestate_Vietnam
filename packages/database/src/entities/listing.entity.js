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
exports.Listing = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
const agent_entity_1 = require("./agent.entity");
const property_type_entity_1 = require("./property-type.entity");
const admin_unit_entity_1 = require("./admin-unit.entity");
let Listing = class Listing extends base_entity_1.BaseEntity {
    code = '';
    userId = '';
    user = null;
    agentId = null;
    agent = null;
    transactionType = 'sell';
    propertyTypeId = '';
    propertyType = null;
    title = '';
    description = null;
    highlights = [];
    adminUnitCode = '';
    adminUnit = null;
    address = '';
    street = null;
    latitude = null;
    longitude = null;
    areaLand = null;
    areaFloor = null;
    frontage = null;
    floors = null;
    bedrooms = null;
    bathrooms = null;
    direction = null;
    price = 0;
    priceUnit = 'total';
    priceNegotiable = false;
    legalStatus = null;
    ownershipType = null;
    isMortgaged = false;
    amenities = [];
    furniture = null;
    status = 'draft';
    isFeatured = false;
    featuredUntil = null;
    slug = null;
    views = 0;
    saves = 0;
    contacts = 0;
    qualityScore = null;
    expiresAt = null;
    publishedAt = null;
};
exports.Listing = Listing;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], Listing.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Listing.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.listings),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], Listing.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'agent_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "agentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agent_entity_1.Agent, (agent) => agent.listings, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'agent_id' }),
    __metadata("design:type", Object)
], Listing.prototype, "agent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_type', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Listing.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_type_id', type: 'uuid' }),
    __metadata("design:type", String)
], Listing.prototype, "propertyTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_type_entity_1.PropertyType, (pt) => pt.listings),
    (0, typeorm_1.JoinColumn)({ name: 'property_type_id' }),
    __metadata("design:type", Object)
], Listing.prototype, "propertyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Listing.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], Listing.prototype, "highlights", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admin_unit_code', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Listing.prototype, "adminUnitCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => admin_unit_entity_1.AdminUnit),
    (0, typeorm_1.JoinColumn)({ name: 'admin_unit_code', referencedColumnName: 'code' }),
    __metadata("design:type", Object)
], Listing.prototype, "adminUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Listing.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "street", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'area_land', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "areaLand", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'area_floor', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "areaFloor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 6, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "frontage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "floors", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "bedrooms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "bathrooms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "direction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Listing.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_unit', type: 'varchar', length: 20, default: 'total' }),
    __metadata("design:type", String)
], Listing.prototype, "priceUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_negotiable', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Listing.prototype, "priceNegotiable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'legal_status', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "legalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ownership_type', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "ownershipType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_mortgaged', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Listing.prototype, "isMortgaged", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], Listing.prototype, "amenities", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "furniture", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'draft' }),
    __metadata("design:type", String)
], Listing.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_featured', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Listing.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'featured_until', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "featuredUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, unique: true, nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Listing.prototype, "views", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Listing.prototype, "saves", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Listing.prototype, "contacts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quality_score', type: 'decimal', precision: 3, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "qualityScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'published_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "publishedAt", void 0);
exports.Listing = Listing = __decorate([
    (0, typeorm_1.Entity)('listings'),
    (0, typeorm_1.Index)('idx_listings_user', ['userId']),
    (0, typeorm_1.Index)('idx_listings_status', ['status']),
    (0, typeorm_1.Index)('idx_listings_type', ['transactionType', 'propertyTypeId']),
    (0, typeorm_1.Index)('idx_listings_location', ['adminUnitCode']),
    (0, typeorm_1.Index)('idx_listings_price', ['price']),
    (0, typeorm_1.Index)('idx_listings_featured', ['isFeatured', 'featuredUntil'])
], Listing);
//# sourceMappingURL=listing.entity.js.map