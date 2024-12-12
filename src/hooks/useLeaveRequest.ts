// src/hooks/useLeaveRequest.ts
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeApi } from '@/services/api'
import { LeaveRequest, LeaveBalance } from '@/types'

export function useLeaveRequest() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string>('')

  const { data: leaveBalances = [] } = useQuery({
    queryKey: ['leaveBalances'],
    queryFn: () => employeeApi.getLeaveBalance()
  })

  const createLeaveRequestMutation = useMutation({
    mutationFn: (data: Omit<LeaveRequest, 'id' | 'user_id' | 'created_at' | 'status'>) =>
      employeeApi.createLeaveRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] })
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] })
      navigate('/dashboard')
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to create leave request')
    }
  })

  return {
    leaveBalances,
    createLeaveRequest: createLeaveRequestMutation.mutate,
    isLoading: createLeaveRequestMutation.isPending,
    error,
    setError
  }
}