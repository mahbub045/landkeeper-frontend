import {
  Certificate,
  ComplianceBreakdownItem,
  Expiration,
} from "@/types/landlord/Compliance/ComplianceTypes";
import { Droplets, Flame, Zap } from "lucide-react";

export const certificates: Certificate[] = [
  {
    id: 1,
    property: "14 Oak Street",
    type: "Gas Safety Certificate",
    issueDate: "15/05/2024",
    expiryDate: "15/05/2025",
    status: "Expired",
  },
  {
    id: 2,
    property: "14 Oak Street",
    type: "EPC Certificate",
    issueDate: "10/01/2023",
    expiryDate: "10/01/2033",
    status: "Valid",
  },
  {
    id: 3,
    property: "42 Maple Avenue",
    type: "HMO Licence",
    issueDate: "01/02/2024",
    expiryDate: "01/02/2027",
    status: "Valid",
  },
  {
    id: 4,
    property: "42 Maple Avenue",
    type: "Gas Safety Certificate",
    issueDate: "20/06/2024",
    expiryDate: "20/06/2025",
    status: "Expired",
  },
  {
    id: 5,
    property: "8 Pine Road",
    type: "EPC Certificate",
    issueDate: "15/03/2024",
    expiryDate: "15/03/2034",
    status: "Valid",
  },
  {
    id: 6,
    property: "8 Pine Road",
    type: "Electrical Safety Certificate",
    issueDate: "20/01/2024",
    expiryDate: "20/01/2029",
    status: "Valid",
  },
  {
    id: 7,
    property: "23 Elm Drive",
    type: "Fire Risk Assessment",
    issueDate: "10/04/2024",
    expiryDate: "10/04/2025",
    status: "Expired",
  },
  {
    id: 8,
    property: "7 Cedar Lane",
    type: "EPC Certificate",
    issueDate: "20/05/2022",
    expiryDate: "20/05/2032",
    status: "Valid",
  },
];

export const upcomingExpirations: Expiration[] = [
  {
    id: 1,
    title: "Gas Safety Certificate",
    subtitle: "14 Oak Street - Expired 3 days ago",
    icon: Flame,
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-500",
  },
  {
    id: 2,
    title: "EPC Certificate",
    subtitle: "42 Maple Avenue - Expires in 14 days",
    icon: Zap,
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-500",
  },
  {
    id: 3,
    title: "Fire Risk Assessment",
    subtitle: "8 Pine Road - Expires in 45 days",
    icon: Droplets,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-500",
  },
];

export const complianceBreakdown: ComplianceBreakdownItem[] = [
  { label: "Gas Safety", current: 4, total: 5, color: "bg-amber-400" },
  { label: "EPC", current: 5, total: 5, color: "bg-emerald-500" },
  { label: "Electrical", current: 5, total: 5, color: "bg-emerald-500" },
];
