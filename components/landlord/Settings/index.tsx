"use client";

import NotificationSettings from "./Notificationsettings/Notificationsettings";
import ProfileSettings from "./ProfileSettings/ProfileSettings";
import SubscriptionSettings from "./Subscriptionsettings/Subscriptionsettings";

export default function SettingsContainer() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ProfileSettings />
        <NotificationSettings />
      </div>

      <SubscriptionSettings />
    </div>
  );
}
