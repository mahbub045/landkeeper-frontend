export type MemberStatus = "Active" | "Pending";

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  access: string;
  status: MemberStatus;
}
