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
exports.AdminUnit = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
let AdminUnit = class AdminUnit extends base_entity_1.BaseEntity {
    code = '';
    name = '';
    nameEn = null;
    level = 0;
    parentCode = null;
    parent = null;
    children = [];
    region = null;
    latitude = null;
    longitude = null;
    polygon = null;
    population = null;
    areaKm2 = null;
    isActive = true;
};
exports.AdminUnit = AdminUnit;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], AdminUnit.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AdminUnit.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name_en', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], AdminUnit.prototype, "nameEn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AdminUnit.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_code', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], AdminUnit.prototype, "parentCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => AdminUnit, (unit) => unit.children, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_code', referencedColumnName: 'code' }),
    __metadata("design:type", Object)
], AdminUnit.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => AdminUnit, (unit) => unit.parent),
    __metadata("design:type", Array)
], AdminUnit.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], AdminUnit.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Object)
], AdminUnit.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Object)
], AdminUnit.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AdminUnit.prototype, "polygon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], AdminUnit.prototype, "population", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'area_km2', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], AdminUnit.prototype, "areaKm2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], AdminUnit.prototype, "isActive", void 0);
exports.AdminUnit = AdminUnit = __decorate([
    (0, typeorm_1.Entity)('admin_units')
], AdminUnit);
//# sourceMappingURL=admin-unit.entity.js.map