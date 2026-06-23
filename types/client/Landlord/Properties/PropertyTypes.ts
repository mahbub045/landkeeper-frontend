export type PropertyStatus = 'Occupied' | 'Vacant';
export type PropertyType = 'residential' | 'hmo' | 'commercial';
export type FilterTab = 'All' | 'Residential' | 'HMO' | 'Commercial' | 'Occupied' | 'Vacant';

export interface Property {
  id: number;
  name: string;
  address: string;
  image: string;
  status: PropertyStatus;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  rentPerMonth: number | null;
}