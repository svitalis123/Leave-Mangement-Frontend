// src/store/notificationStore.ts
import { create } from 'zustand'
import { Notification } from '@/types'

interface NotificationState {
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
  markAsRead: (id: number) => void
  addNotification: (notification: Notification) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, is_read: true } : notification
      ),
    })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
}))