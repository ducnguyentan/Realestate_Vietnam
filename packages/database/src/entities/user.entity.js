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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_role_entity_1 = require("./user-role.entity");
const agent_entity_1 = require("./agent.entity");
const admin_unit_entity_1 = require("./admin-unit.entity");
const listing_entity_1 = require("./listing.entity");
let User = class User extends base_entity_1.BaseEntity {
    phone = null;
    email = null;
    passwordHash = null;
    fullName = null;
    avatarUrl = null;
    idCardNumber = null;
    dateOfBirth = null;
    gender = null;
    address = null;
    adminUnitCode = null;
    adminUnit = null;
    status = 'active';
    phoneVerified = false;
    emailVerified = false;
    identityVerified = false;
    identityVerifiedAt = null;
    idFrontImage = null;
    idBackImage = null;
    idSelfieImage = null;
    lastLoginAt = null;
    settings = {};
    userRoles = [];
    agent = null;
    listings = [];
};
exports.User = User;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 15, unique: true, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_card_number', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "idCardNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_of_birth', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admin_unit_code', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "adminUnitCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => admin_unit_entity_1.AdminUnit, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'admin_unit_code', referencedColumnName: 'code' }),
    __metadata("design:type", Object)
], User.prototype, "adminUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'active' }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_verified', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "phoneVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_verified', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'identity_verified', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "identityVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'identity_verified_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "identityVerifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_front_image', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "idFrontImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_back_image', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "idBackImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_selfie_image', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "idSelfieImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], User.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_role_entity_1.UserRole, (userRole) => userRole.user),
    __metadata("design:type", Array)
], User.prototype, "userRoles", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => agent_entity_1.Agent, (agent) => agent.user),
    __metadata("design:type", Object)
], User.prototype, "agent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => listing_entity_1.Listing, (listing) => listing.user),
    __metadata("design:type", Array)
], User.prototype, "listings", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map