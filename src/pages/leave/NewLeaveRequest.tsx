// src/pages/leave/NewLeaveRequest.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function NewLeaveRequest() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLeaveType, setSelectedLeaveType] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const { data: leaveBalances = [] } = useQuery({
    queryKey: ['leaveBalances'],
    queryFn: () => employeeApi.getLeaveBalance()
  });

  const createLeaveRequestMutation = useMutation({
    mutationFn: (data) => employeeApi.createLeaveRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] });
      navigate('/dashboard');
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to create leave request');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !selectedLeaveType) {
      setError('Please fill in all required fields');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before end date');
      return;
    }

    createLeaveRequestMutation.mutate({
      leave_type_id: parseInt(selectedLeaveType),
      start_date: startDate,   // The date string is already in YYYY-MM-DD format
      end_date: endDate,       // The date string is already in YYYY-MM-DD format
      reason
    });
  };

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>New Leave Request</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Leave Type
              </label>
              <select
                value={selectedLeaveType}
                onChange={(e) => setSelectedLeaveType(e.target.value)}
                className="w-full rounded-md border border-input px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select Leave Type</option>
                {leaveBalances.map((balance) => (
                  <option 
                    key={balance.leave_type_id} 
                    value={balance.leave_type_id}
                  >
                    {balance.leave_type_name} ({balance.balance} days remaining)
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={today}
                  className="w-full rounded-md border border-input px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || today}
                  className="w-full rounded-md border border-input px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-md border border-input px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={createLeaveRequestMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createLeaveRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}