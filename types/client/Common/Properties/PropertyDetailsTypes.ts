import { Property, PropertyDocument } from './PropertyTypes';

export interface PropertyDetailsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface PropertyGalleryProps {
  docs: PropertyDocument[];
}

export interface LightboxProps {
  docs: PropertyDocument[];
  index: number;
  open: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export interface ImageWithLoaderProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  fill?: boolean;
  className?: string;
  unoptimized?: boolean;
}

export interface PropertyDangerZoneProps {
  onDeleteClick: () => void;
}

export interface PropertyFinancialsProps {
  property: Property;
}

export interface PropertyInfoProps {
  property: Property;
}

export interface PropertyNotesProps {
  notes: string;
}

export interface PropertyPermissionListProps {
  propertyAlias: string;
}
export interface PropertyPermissionUser {
  profile_image: string | null;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface PropertyPermission {
  alias: string;
  user: PropertyPermissionUser;
  property: string;
  mortgage: string | null;
  can_view: boolean;
  can_edit: boolean;
}

export interface PropertyPermissionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PropertyPermission[];
}
