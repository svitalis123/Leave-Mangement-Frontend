// src/pages/dashboard/AdminDashboard.tsx
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { LeaveRequest, User } from '@/types'

export function AdminDashboard() {
  const { data: pendingUsers = [] } = useQuery({
    queryKey: ['pendingUsers'],
    queryFn: () => adminApi.getPendingUsers()
  })

  const { data: leaveRequests = [] } = useQuery({
    queryKey: ['leaveRequests'],
    queryFn: () => adminApi.getAllLeaveRequests()
  })

  const pendingLeaveRequests = leaveRequests.filter((req) => req.status === 'pending')

  const leaveStats = leaveRequests.reduce(
    (acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const chartData = Object.entries(leaveStats).map(([status, count]) => ({
    status,
    count,
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingUsers.length}</div>
            <p className="text-sm text-muted-foreground">Users awaiting approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingLeaveRequests.length}</div>
            <p className="text-sm text-muted-foreground">Pending requests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leaveRequests.length}</div>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingLeaveRequests.slice(0, 5).map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{request.leave_type_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.start_date} - {request.end_date}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adminApi.updateLeaveRequest(request.id, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => adminApi.updateLeaveRequest(request.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}