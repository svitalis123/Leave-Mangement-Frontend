// src/components/ui/DatePicker.tsx
import { forwardRef } from 'react'
import ReactDatePicker from 'react-datepicker'
import { cn } from '@/lib/utils'
import 'react-datepicker/dist/react-datepicker.css'

interface DatePickerProps {
  selected: Date | undefined
  onChange: (date: Date) => void
  minDate?: Date
  className?: string
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  ({ selected, onChange, minDate, className }, ref) => {
    return (
      <div ref={ref} className={cn('relative', className)}>
        <ReactDatePicker
          selected={selected}
          onChange={onChange}
          minDate={minDate}
          dateFormat="yyyy-MM-dd"
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
