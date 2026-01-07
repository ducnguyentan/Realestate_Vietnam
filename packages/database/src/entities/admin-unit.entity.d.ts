import { BaseEntity } from './base.entity';
export declare class AdminUnit extends BaseEntity {
  code: string;
  name: string;
  nameEn: string | null;
  level: number;
  parentCode: string | null;
  parent: AdminUnit | null;
  children: AdminUnit[];
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  polygon: Record<string, unknown> | null;
  population: number | null;
  areaKm2: number | null;
  isActive: boolean;
}
//# sourceMappingURL=admin-unit.entity.d.ts.map
