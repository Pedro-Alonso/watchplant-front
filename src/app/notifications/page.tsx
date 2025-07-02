"use client";

import { NotificationLayout } from "./notification.layout";
import { useNotification } from "./notification.hook";

const NotificationComponent = () => {
  const props = useNotification();
  return <NotificationLayout {...props} />;
};

export default NotificationComponent;
