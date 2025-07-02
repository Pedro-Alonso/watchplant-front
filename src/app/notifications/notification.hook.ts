"use client";

import { useEffect, useState, useRef } from "react";
import {
  GetAllNotificationsResponseDTO,
  INotification,
  Notification,
} from "./notification.types";
import { ApiError, useApiWithLoader } from "@/services/api";

export const useNotification = (): INotification => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const httpClient = useApiWithLoader();

  // Store API client in a ref to avoid dependency issues
  const httpClientRef = useRef(httpClient);
  const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set up initial fetch and interval only once when component mounts
  useEffect(() => {
    // Flag to prevent state updates after unmount
    let isMounted = true;

    // Stable fetch function that uses the ref
    const fetchNotifications = async () => {
      if (!isMounted) return;

      try {
        console.log("Fetching notifications...");
        const response =
          await httpClientRef.current.get<GetAllNotificationsResponseDTO>(
            "/notification/new"
          );
        console.log("Notifications fetched:", response.data.notifications);

        if (isMounted) {
          setNotifications(response.data.notifications);
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        console.error("Failed to fetch notifications:", apiError.message);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Set up interval (every 5 minutes)
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 5 * 60 * 1000);

    // Store the interval ID for cleanup
    notificationIntervalRef.current = intervalId;

    // Cleanup function
    return () => {
      isMounted = false;
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
        notificationIntervalRef.current = null;
      }
    };
  }, []); // Empty dependency array so it only runs once

  const markAsSeen = async (notification: Notification): Promise<void> => {
    if (notification.seenAt) return; // Already seen

    try {
      const payload = {
        key: notification.key,
        seenAt: new Date().toISOString(),
      };

      await httpClientRef.current.patch("/notification/seen", payload);

      // Update the notification in the local state
      setNotifications(
        notifications.map((n) =>
          n.key.plantedPlantKey.perenualPlantId ===
            notification.key.plantedPlantKey.perenualPlantId &&
          n.key.plantedPlantKey.plantationDate ===
            notification.key.plantedPlantKey.plantationDate
            ? { ...n, seenAt: new Date().toISOString() }
            : n
        )
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Failed to mark notification as seen:", apiError.message);
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.seenAt).length;

  // Public fetch function
  const fetchNotifications = async (): Promise<void> => {
    try {
      console.log("Manual fetch notifications...");
      const response =
        await httpClientRef.current.get<GetAllNotificationsResponseDTO>(
          "/notification/new"
        );
      setNotifications(response.data.notifications);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Failed to fetch notifications:", apiError.message);
    }
  };

  return {
    notifications,
    unreadCount,
    isOpen,
    setIsOpen,
    markAsSeen,
    fetchNotifications,
  };
};
