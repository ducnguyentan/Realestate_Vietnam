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
exports.PropertyType = void 0;
const typeorm_1 = require("typeorm");
const listing_entity_1 = require("./listing.entity");
let PropertyType = class PropertyType {
    id = '';
    code = '';
    name = '';
    nameEn = null;
    icon = null;
    parentId = null;
    parent = null;
    children = [];
    sortOrder = 0;
    isActive = true;
    createdAt = new Date();
    listings = [];
};
exports.PropertyType = PropertyType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PropertyType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, unique: true }),
    __metadata("design:type", String)
], PropertyType.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PropertyType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name_en', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], PropertyType.prototype, "nameEn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], PropertyType.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], PropertyType.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PropertyType, (pt) => pt.children, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", Object)
], PropertyType.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PropertyType, (pt) => pt.parent),
    __metadata("design:type", Array)
], PropertyType.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PropertyType.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], PropertyType.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], PropertyType.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => listing_entity_1.Listing, (listing) => listing.propertyType),
    __metadata("design:type", Array)
], PropertyType.prototype, "listings", void 0);
exports.PropertyType = PropertyType = __decorate([
    (0, typeorm_1.Entity)('property_types')
], PropertyType);
//# sourceMappingURL=property-type.entity.js.map