// src/pages/admin/UserLeaveManagement.tsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function UserLeaveManagement() {
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminApi.getAllUsers()
  })

  const { data: leaveTypes = [] } = useQuery({
    queryKey: ['leaveTypes'],
    queryFn: () => adminApi.getLeaveTypes()
  })

  const setBalanceMutation = useMutation({
    mutationFn: (data: { user_id: number; leave_type_id: number; balance: number }) => 
      adminApi.setLeaveBalance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] })
      setError('')
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to set leave balance')
    }
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employee Leave Balance Management</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            {users
              .filter(user => user.role === 'employee')
              .map(user => (
                <div key={user.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{user.username}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
                  
                  <div className="grid gap-4 sm:grid-cols-3">
                    {leaveTypes.map(leaveType => (
                      <div key={leaveType.id} className="space-y-2">
                        <label className="block text-sm font-medium">
                          {leaveType.name}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            className="w-24 rounded-md border border-input px-3 py-1"
                            defaultValue={leaveType.default_allocation || 0}
                          />
                          <Button
                            size="sm"
                            onClick={() => 
                              setBalanceMutation.mutate({
                                user_id: user.id,
                                leave_type_id: leaveType.id,
                                balance: leaveType.default_allocation || 0
                              })
                            }
                            disabled={setBalanceMutation.isPending}
                          >
                            Set
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
