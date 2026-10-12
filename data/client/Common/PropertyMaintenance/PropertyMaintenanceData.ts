import {
  MaintenanceCategory,
  MaintenanceStatus,
} from '@/types/client/Common/PropertyMaintenance/PropertyMaintenanceType';
import {
  Bath,
  Bug,
  Building2,
  CloudRain,
  CookingPot,
  DoorOpen,
  Droplets,
  Fan,
  Flame,
  House,
  ShieldCheck,
  SprayCan,
  Thermometer,
  Trees,
  Users,
  WashingMachine,
  Wrench,
  Zap,
} from 'lucide-react';


export const STATUS_EDITABLE_ROLES = ['LANDLORD', 'ADMIN'] as const;

export const canEditMaintenanceStatus = (role?: string) =>
  STATUS_EDITABLE_ROLES.includes(
    role as (typeof STATUS_EDITABLE_ROLES)[number],
  );

export const STATUS_OPTIONS: Array<{
  value: MaintenanceStatus;
  label: string;
}> = [
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

export const CATEGORY_OPTIONS: Array<{
  value: MaintenanceCategory;
  label: string;
}> = [
  { value: 'PLUMBING_WATER', label: 'Plumbing & Water' },
  { value: 'HEATING_HOT_WATER', label: 'Heating & Hot Water' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'GAS', label: 'Gas' },
  { value: 'ROOF_GUTTERING', label: 'Roof & Guttering' },
  { value: 'DAMP_MOULD_CONDENSATION', label: 'Damp, Mould & Condensation' },
  { value: 'DOORS_WINDOWS_LOCKS', label: 'Doors, Windows & Locks' },
  { value: 'BATHROOM', label: 'Bathroom' },
  { value: 'KITCHEN', label: 'Kitchen' },
  { value: 'APPLIANCES', label: 'Appliances' },
  { value: 'HEATING_VENTILATION', label: 'Heating & Ventilation' },
  { value: 'STRUCTURAL_BUILDING', label: 'Structural & Building' },
  { value: 'PEST_CONTROL', label: 'Pest Control' },
  { value: 'SECURITY_SAFETY', label: 'Security & Safety' },
  { value: 'EXTERNAL_AREAS', label: 'External Areas' },
  { value: 'COMMUNAL_AREAS', label: 'Communal Areas' },
  { value: 'CLEANING_GENERAL', label: 'Cleaning & General' },
  { value: 'OTHER_GENERAL_MAINTENANCE', label: 'Other / General Maintenance' },
];

export const STATUS_STYLES: Record<MaintenanceStatus, string> = {
  SUBMITTED: 'bg-red-100 text-red-700 ring-red-600/20',
  ASSIGNED: 'bg-blue-100 text-blue-700 ring-blue-600/20',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 ring-amber-600/20',
  COMPLETED: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
};

export const STATUS_DOT: Record<keyof typeof STATUS_STYLES, string> = {
  SUBMITTED: 'bg-red-500',
  ASSIGNED: 'bg-blue-500',
  IN_PROGRESS: 'bg-amber-500',
  COMPLETED: 'bg-emerald-500',
};

export const CATEGORY_META: Record<
  MaintenanceCategory,
  { icon: React.ElementType; classes: string }
> = {
  PLUMBING_WATER: {
    icon: Droplets,
    classes: 'bg-sky-100 text-sky-700 ring-sky-600/20',
  },
  HEATING_HOT_WATER: {
    icon: Thermometer,
    classes: 'bg-red-100 text-red-700 ring-red-600/20',
  },
  ELECTRICAL: {
    icon: Zap,
    classes: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
  },
  GAS: {
    icon: Flame,
    classes: 'bg-orange-100 text-orange-700 ring-orange-600/20',
  },
  ROOF_GUTTERING: {
    icon: House,
    classes: 'bg-stone-100 text-stone-700 ring-stone-600/20',
  },
  DAMP_MOULD_CONDENSATION: {
    icon: CloudRain,
    classes: 'bg-teal-100 text-teal-700 ring-teal-600/20',
  },
  DOORS_WINDOWS_LOCKS: {
    icon: DoorOpen,
    classes: 'bg-amber-100 text-amber-700 ring-amber-600/20',
  },
  BATHROOM: {
    icon: Bath,
    classes: 'bg-cyan-100 text-cyan-700 ring-cyan-600/20',
  },
  KITCHEN: {
    icon: CookingPot,
    classes: 'bg-lime-100 text-lime-700 ring-lime-600/20',
  },
  APPLIANCES: {
    icon: WashingMachine,
    classes: 'bg-indigo-100 text-indigo-700 ring-indigo-600/20',
  },
  HEATING_VENTILATION: {
    icon: Fan,
    classes: 'bg-rose-100 text-rose-700 ring-rose-600/20',
  },
  STRUCTURAL_BUILDING: {
    icon: Building2,
    classes: 'bg-slate-100 text-slate-700 ring-slate-600/20',
  },
  PEST_CONTROL: {
    icon: Bug,
    classes: 'bg-green-100 text-green-700 ring-green-600/20',
  },
  SECURITY_SAFETY: {
    icon: ShieldCheck,
    classes: 'bg-blue-100 text-blue-700 ring-blue-600/20',
  },
  EXTERNAL_AREAS: {
    icon: Trees,
    classes: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
  },
  COMMUNAL_AREAS: {
    icon: Users,
    classes: 'bg-violet-100 text-violet-700 ring-violet-600/20',
  },
  CLEANING_GENERAL: {
    icon: SprayCan,
    classes: 'bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-600/20',
  },
  OTHER_GENERAL_MAINTENANCE: {
    icon: Wrench,
    classes: 'bg-gray-100 text-gray-700 ring-gray-500/20',
  },
};

export const CATEGORY_STYLES = Object.fromEntries(
  Object.entries(CATEGORY_META).map(([key, { classes }]) => [key, classes]),
) as Record<MaintenanceCategory, string>;



export const MAX_FILES = 5;
export const MAX_FILE_SIZE_MB = 20;
export const ACCEPTED_FILE_TYPES = '.jpg,.jpeg,.png,.pdf';
