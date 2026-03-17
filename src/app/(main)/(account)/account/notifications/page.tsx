"use client";

import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="container max-w-2xl py-3 xs:py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Notifications</h1>
      <p className="text-sm text-muted-foreground mb-8">(0 Notifications Unread)</p>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Bell className="size-12 text-muted-foreground" aria-hidden />
        </div>
        <p className="text-muted-foreground">— No notifications found —</p>
      </div>
    </div>
  );
}
