export type DocCategory =
  | "mortgage"
  | "tenancy"
  | "certificate"
  | "insurance"
  | "legal"
  | "photo"
  | "invoice";
export type FilterTab =
  | "All"
  | "Mortgage"
  | "Tenancy"
  | "Certificates"
  | "Insurance"
  | "Legal";

export interface PropertyDocument {
  id: number;
  name: string;
  property: string;
  category: DocCategory;
  sizeMB: number;
}
