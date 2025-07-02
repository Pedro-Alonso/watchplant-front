export enum NotificationType {
  WATERING = "watering",
  HARVESTING = "harvesting",
}

export interface NotificationKey {
  userEmail: string;
  plantedPlantKey: {
    perenualPlantId: number;
    plantationDate: string;
    plantationKey: {
      userEmail: string;
      name: string;
    };
  };
}

export interface Notification {
  key: NotificationKey;
  creationDate: string;
  message: string;
  seenAt: string | null;
  type: NotificationType;
}

export interface GetAllNotificationsResponseDTO {
  notifications: Notification[];
}

export interface PatchNotificationSeenRequestDto {
  key: NotificationKey;
  seenAt: string;
}

export interface INotification {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  markAsSeen: (notification: Notification) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}
