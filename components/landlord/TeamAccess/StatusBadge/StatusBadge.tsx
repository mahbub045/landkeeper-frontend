import { MemberStatus } from "@/types/landlord/TeamAccess/TeamAccessTypes";

export function StatusBadge({ status }: { status: MemberStatus }) {
  if (status === "Active") {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
        <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
      <span className="inline-block size-1.5 rounded-full bg-amber-400" />
      Pending
    </span>
  );
}
