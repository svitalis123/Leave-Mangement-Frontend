// src/store/leaveStore.ts
import { create } from 'zustand'
import { LeaveRequest, LeaveType, LeaveBalance } from '@/types'

interface LeaveState {
  leaveRequests: LeaveRequest[]
  leaveTypes: LeaveType[]
  leaveBalances: LeaveBalance[]
  setLeaveRequests: (requests: LeaveRequest[]) => void
  setLeaveTypes: (types: LeaveType[]) => void
  setLeaveBalances: (balances: LeaveBalance[]) => void
  addLeaveRequest: (request: LeaveRequest) => void
  updateLeaveRequest: (id: number, status: string) => void
}

export const useLeaveStore = create<LeaveState>((set) => ({
  leaveRequests: [],
  leaveTypes: [],
  leaveBalances: [],
  setLeaveRequests: (requests) => set({ leaveRequests: requests }),
  setLeaveTypes: (types) => set({ leaveTypes: types }),
  setLeaveBalances: (balances) => set({ leaveBalances: balances }),
  addLeaveRequest: (request) =>
    set((state) => ({
      leaveRequests: [...state.leaveRequests, request],
    })),
  updateLeaveRequest: (id, status) =>
    set((state) => ({
      leaveRequests: state.leaveRequests.map((request) =>
        request.id === id ? { ...request, status } : request
      ),
    })),
}))
