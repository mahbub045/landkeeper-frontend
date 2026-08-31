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
  can_view: boolean;
  can_edit: boolean;
  property: Property;
  mortgage: Mortgage;
}

export interface BulkPropertyPermissionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PropertiesPermissionType[];
}

export interface BulkPropertyPermissionPayload {
  property: string[];
  can_view: boolean;
  can_edit: boolean;
}
