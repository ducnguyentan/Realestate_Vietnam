import { Listing } from './listing.entity';
export declare class PropertyType {
  id: string;
  code: string;
  name: string;
  nameEn: string | null;
  icon: string | null;
  parentId: string | null;
  parent: PropertyType | null;
  children: PropertyType[];
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  listings: Listing[];
}
//# sourceMappingURL=property-type.entity.d.ts.map
