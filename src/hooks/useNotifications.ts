// src/hooks/useNotifications.ts
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { employeeApi } from '@/services/api'
import { useNotificationStore } from '@/store/notificationStore'

export function useNotifications() {
  const { setNotifications, notifications } = useNotificationStore()

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => employeeApi.getNotifications(),
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  useEffect(() => {
    if (data) {
      setNotifications(data)
    }
  }, [data, setNotifications])

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.is_read).length
  }
}