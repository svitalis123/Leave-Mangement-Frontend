// src/pages/calendar/CalendarView.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useAuthStore } from '@/store/authStore'
import { employeeApi, adminApi } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { format } from 'date-fns'
import { LeaveRequest, User } from '@/types'
import { Badge } from '@/components/ui/Badge'

export function CalendarView() {
  const { isAdmin } = useAuthStore()
  const [selectedEvent, setSelectedEvent] = useState(null)

  const { data: leaveRequests = [] } = useQuery({
    queryKey: ['calendarLeaveRequests'],
    queryFn: () => (isAdmin() ? adminApi.getAllLeaveRequests() : employeeApi.getLeaveRequests())
  })

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminApi.getAllUsers(),
    enabled: isAdmin()
  })

  const columns = [
    {
      header: 'Employee',
      accessorKey: 'user_id',
      cell: ({ row }: any) => {
        const user = users.find(u => u.id === row.original.user_id)
        return (
          <div>
            <div className="font-medium">{user?.username}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        )
      },
    },
    {
      header: 'Leave Type',
      accessorKey: 'leave_type_name',
    },
    {
      header: 'Period',
      cell: ({ row }: any) => (
        <span>
          {format(new Date(row.original.start_date), 'PP')} -{' '}
          {format(new Date(row.original.end_date), 'PP')}
        </span>
      ),
    },
    {
      header: 'Duration',
      cell: ({ row }: any) => {
        const start = new Date(row.original.start_date)
        const end = new Date(row.original.end_date)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        return `${days} days`
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: any) => {
        const status = row.original.status
        return (
          <Badge variant={
            status === 'approved' ? 'success' :
            status === 'rejected' ? 'destructive' :
            'warning'
          }>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
      cell: ({ row }: any) => (
        <div className="max-w-[300px] truncate">{row.original.reason}</div>
      ),
    },
  ]

  const getUserColor = (userId: number) => {
    const colors = [
      { light: '#e0f2fe', dark: '#0284c7' },
      { light: '#f0fdf4', dark: '#16a34a' },
      { light: '#fef3c7', dark: '#d97706' },
      { light: '#ffe4e6', dark: '#e11d48' },
      { light: '#f3e8ff', dark: '#9333ea' },
      { light: '#fff1f2', dark: '#be123c' },
      { light: '#ecfeff', dark: '#0891b2' },
      { light: '#f7fee7', dark: '#4d7c0f' }
    ]
    return colors[userId % colors.length]
  }

  const events = leaveRequests.map((request) => {
    const userColor = getUserColor(request.user_id)
    const user = users.find(u => u.id === request.user_id)
    return {
      id: request.id.toString(),
      title: `${isAdmin() ? `${user?.username || 'User'} - ` : ''}${request.leave_type_name}`,
      start: request.start_date,
      end: request.end_date,
      backgroundColor: isAdmin() ? userColor.light : getStatusColor(request.status).light,
      borderColor: isAdmin() ? userColor.dark : getStatusColor(request.status).dark,
      textColor: isAdmin() ? userColor.dark : getStatusColor(request.status).dark,
      extendedProps: {
        ...request,
        user
      }
    }
  })

  function getStatusColor(status: string) {
    switch (status) {
      case 'approved': return { light: '#dcfce7', dark: '#16a34a' }
      case 'rejected': return { light: '#fee2e2', dark: '#dc2626' }
      case 'pending': return { light: '#fef3c7', dark: '#d97706' }
      default: return { light: '#f3f4f6', dark: '#6b7280' }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Leave Calendar</span>
            {isAdmin() && (
              <div className="flex flex-wrap gap-4 text-sm">
                {users.map(user => (
                  <div key={user.id} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getUserColor(user.id).dark }}
                    />
                    <span>{user.username}</span>
                  </div>
                ))}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={(info) => setSelectedEvent(info.event)}
            height="auto"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
          />
        </CardContent>
      </Card>

      {selectedEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Leave Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {isAdmin() && selectedEvent.extendedProps.user && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Employee Details</h3>
                  <p className="text-sm">
                    <span className="font-medium">Name:</span>{' '}
                    {selectedEvent.extendedProps.user.username}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span>{' '}
                    {selectedEvent.extendedProps.user.email}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <h3 className="font-semibold">Leave Details</h3>
                <p className="text-sm">
                  <span className="font-medium">Type:</span>{' '}
                  {selectedEvent.extendedProps.leave_type_name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{' '}
                  <Badge variant={
                    selectedEvent.extendedProps.status === 'approved' ? 'success' :
                    selectedEvent.extendedProps.status === 'rejected' ? 'destructive' :
                    'warning'
                  }>
                    {selectedEvent.extendedProps.status}
                  </Badge>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Period:</span>{' '}
                  {format(new Date(selectedEvent.start), 'PPP')} -{' '}
                  {format(new Date(selectedEvent.end), 'PPP')}
                </p>
                {selectedEvent.extendedProps.reason && (
                  <p className="text-sm">
                    <span className="font-medium">Reason:</span>{' '}
                    {selectedEvent.extendedProps.reason}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns}
            data={leaveRequests}
          />
        </CardContent>
      </Card>
    </div>
  )
}