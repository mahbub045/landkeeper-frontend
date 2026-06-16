"use client";

import { UserPlus } from "lucide-react";
import Members from "./Members/Members";

export default function TeamAccessContainer() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Team Access
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage professional access to your portfolio
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          <UserPlus className="size-4" />
          Invite User
        </button>
      </div>

      {/* MemberList */}
      <Members />
    </div>
  );
}
