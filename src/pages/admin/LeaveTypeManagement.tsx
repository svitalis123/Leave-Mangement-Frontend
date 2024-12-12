// src/pages/admin/LeaveTypeManagement.tsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LeaveType } from '@/types'
import { Plus } from 'lucide-react'

export function LeaveTypeManagement() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState('')

  const { data: leaveTypes = [] } = useQuery({
    queryKey: ['leaveTypes'],
    queryFn: () => adminApi.getLeaveTypes()
  })

  const createMutation = useMutation({
    mutationFn: (data: Omit<LeaveType, 'id' | 'created_at'>) => 
      adminApi.createLeaveType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveTypes'] })
      setIsDialogOpen(false)
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to create leave type')
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    createMutation.mutate({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      default_allocation: parseInt(formData.get('default_allocation') as string),
      requires_balance: formData.get('requires_balance') === 'true'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leave Types</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Leave Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Leave Type</DialogTitle>
            </DialogHeader>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-input px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  className="w-full rounded-md border border-input px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Default Allocation (days)
                </label>
                <input
                  name="default_allocation"
                  type="number"
                  min="0"
                  required
                  className="w-full rounded-md border border-input px-3 py-2"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    name="requires_balance"
                    type="checkbox"
                    value="true"
                    defaultChecked
                    className="rounded border-input"
                  />
                  <span className="text-sm font-medium">Requires Balance</span>
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {leaveTypes.map((leaveType) => (
          <Card key={leaveType.id}>
            <CardHeader>
              <CardTitle>{leaveType.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {leaveType.description}
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Default Allocation:</span>{' '}
                  {leaveType.default_allocation} days
                </p>
                <p className="text-sm">
                  <span className="font-medium">Requires Balance:</span>{' '}
                  {leaveType.requires_balance ? 'Yes' : 'No'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}