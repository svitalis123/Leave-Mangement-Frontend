// src/pages/dashboard/EmployeeDashboard.tsx
import { useQuery } from '@tanstack/react-query'
import { employeeApi } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LeaveRequest, LeaveBalance } from '@/types'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function EmployeeDashboard() {
  const navigate = useNavigate()
  
  const { data: leaveRequests = [] } = useQuery({
    queryKey: ['employeeLeaveRequests'],
    queryFn: () => employeeApi.getLeaveRequests()
  })

  const { data: leaveBalances = [] } = useQuery({
    queryKey: ['leaveBalances'],
    queryFn: () => employeeApi.getLeaveBalance()
  })

  const pendingRequests = leaveRequests.filter((req) => req.status === 'pending')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate('/leave/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Leave Request
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {leaveBalances.map((balance) => (
          <Card key={balance.id}>
            <CardHeader>
              <CardTitle>{balance.leave_type_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{balance.balance}</div>
              <p className="text-sm text-muted-foreground">Days remaining</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaveRequests.slice(0, 5).map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{request.leave_type_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.start_date} - {request.end_date}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {request.reason}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  request.status === 'approved' 
                    ? 'bg-green-100 text-green-800'
                    : request.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}