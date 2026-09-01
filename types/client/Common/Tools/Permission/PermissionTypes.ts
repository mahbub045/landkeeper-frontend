export type TabKey = 'properties' | 'mortgages';

export interface Property {
  id: number;
  alias: string;
  property_name: string;
}

export interface Mortgage {
  lender_name: string;
}

export interface PropertiesPermissionType {
  alias: string;
  can_view: boolean;
  can_edit: boolean;
  property: Property;
  mortgage: Mortgage;
}
