"use client";

import { useNotification } from "@/app/notifications/notification.hook";
import { NotificationLayout } from "@/app/notifications/notification.layout";

export const NotificationBell = () => {
  const props = useNotification();
  return <NotificationLayout {...props} />;
};
