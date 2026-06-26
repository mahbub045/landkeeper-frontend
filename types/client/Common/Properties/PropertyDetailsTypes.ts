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
  className?: string;
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
