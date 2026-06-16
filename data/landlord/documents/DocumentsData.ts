import {
  DocCategory,
  FilterTab,
  PropertyDocument,
} from "@/types/landlord/Documents/DocumentTypes";

export const filterTabs: FilterTab[] = [
  "All",
  "Mortgage",
  "Tenancy",
  "Certificates",
  "Insurance",
  "Legal",
];

export const tabCategoryMap: Record<FilterTab, DocCategory[]> = {
  All: [],
  Mortgage: ["mortgage"],
  Tenancy: ["tenancy"],
  Certificates: ["certificate"],
  Insurance: ["insurance"],
  Legal: ["legal"],
};

export const documents: PropertyDocument[] = [
  {
    id: 1,
    name: "Tenancy Agreement - Sarah Johnson",
    property: "14 Oak Street",
    category: "tenancy",
    sizeMB: 1.2,
  },
  {
    id: 2,
    name: "Mortgage Offer - Halifax",
    property: "14 Oak Street",
    category: "mortgage",
    sizeMB: 2.4,
  },
  {
    id: 3,
    name: "HMO Licence Certificate",
    property: "42 Maple Avenue",
    category: "certificate",
    sizeMB: 0.8,
  },
  {
    id: 4,
    name: "Property Inspection Photos",
    property: "42 Maple Avenue",
    category: "photo",
    sizeMB: 15.6,
  },
  {
    id: 5,
    name: "Building Insurance Policy",
    property: "8 Pine Road",
    category: "insurance",
    sizeMB: 3.1,
  },
  {
    id: 6,
    name: "Commercial Lease Agreement",
    property: "23 Elm Drive",
    category: "legal",
    sizeMB: 4.5,
  },
  {
    id: 7,
    name: "Gas Safety Certificate 2024",
    property: "14 Oak Street",
    category: "certificate",
    sizeMB: 0.5,
  },
  {
    id: 8,
    name: "Repair Invoice - Boiler",
    property: "8 Pine Road",
    category: "invoice",
    sizeMB: 0.3,
  },
  {
    id: 9,
    name: "EPC Certificate",
    property: "7 Cedar Lane",
    category: "certificate",
    sizeMB: 0.6,
  },
  {
    id: 10,
    name: "Landlord Insurance Policy",
    property: "42 Maple Avenue",
    category: "insurance",
    sizeMB: 2.8,
  },
  {
    id: 11,
    name: "Tenancy Agreement - James Patel",
    property: "8 Pine Road",
    category: "tenancy",
    sizeMB: 1.4,
  },
  {
    id: 12,
    name: "Mortgage Statement Q1 2024",
    property: "23 Elm Drive",
    category: "mortgage",
    sizeMB: 0.9,
  },
];
