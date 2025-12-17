import { ListingStatus, TransactionType, PropertyType } from '../constants/listing-status';

export interface Listing {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  price: number;
  pricePerSqm?: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  latitude: number;
  longitude: number;
  images: string[];
  status: ListingStatus;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  latitude: number;
  longitude: number;
}

export interface ListingFilters {
  provinceCode?: string;
  districtCode?: string;
  propertyType?: PropertyType;
  transactionType?: TransactionType;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
}
