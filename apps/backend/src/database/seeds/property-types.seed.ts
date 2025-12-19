import { PropertyType } from '@realestate/database';

/**
 * Property types for Vietnamese real estate market
 * Based on common classification in Vietnam
 */
export const propertyTypesSeed: Partial<PropertyType>[] = [
  // Level 1: Main categories
  {
    code: 'apartment',
    name: 'Căn hộ/Chung cư',
    nameEn: 'Apartment/Condominium',
    icon: '🏢',
    parentId: null,
    sortOrder: 1,
    isActive: true,
  },
  {
    code: 'house',
    name: 'Nhà ở',
    nameEn: 'House',
    icon: '🏠',
    parentId: null,
    sortOrder: 2,
    isActive: true,
  },
  {
    code: 'villa',
    name: 'Biệt thự',
    nameEn: 'Villa',
    icon: '🏰',
    parentId: null,
    sortOrder: 3,
    isActive: true,
  },
  {
    code: 'land',
    name: 'Đất',
    nameEn: 'Land',
    icon: '🗺️',
    parentId: null,
    sortOrder: 4,
    isActive: true,
  },
  {
    code: 'commercial',
    name: 'Bất động sản thương mại',
    nameEn: 'Commercial Property',
    icon: '🏪',
    parentId: null,
    sortOrder: 5,
    isActive: true,
  },
  {
    code: 'industrial',
    name: 'Bất động sản công nghiệp',
    nameEn: 'Industrial Property',
    icon: '🏭',
    parentId: null,
    sortOrder: 6,
    isActive: true,
  },
  {
    code: 'farm',
    name: 'Trang trại/Khu nghỉ dưỡng',
    nameEn: 'Farm/Resort',
    icon: '🌳',
    parentId: null,
    sortOrder: 7,
    isActive: true,
  },
  {
    code: 'other',
    name: 'Bất động sản khác',
    nameEn: 'Other',
    icon: '📦',
    parentId: null,
    sortOrder: 8,
    isActive: true,
  },
];
