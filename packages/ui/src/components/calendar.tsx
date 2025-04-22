import * as React from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { cn } from '@utils/cn'

import { buttonVariants } from './button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>
export type CalendarDateRange = DateRange

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'surface' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-cn-foreground-3 rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-cn-background-3 [&:has([aria-selected].day-outside)]:bg-cn-background-3/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: cn(buttonVariants({ variant: 'ghost' }), 'h-8 w-8 p-0 font-normal aria-selected:opacity-100'),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-cn-background-accent text-cn-foreground-primary hover:bg-cn-background-accent hover:text-cn-foreground-primary focus:bg-cn-background-accent focus:text-cn-foreground-primary',
        day_today: 'bg-cn-background-3 text-cn-foreground-1',
        day_outside:
          'day-outside text-cn-foreground-3 opacity-50  aria-selected:bg-cn-background-3/50 aria-selected:text-cn-foreground-3 aria-selected:opacity-30',
        day_disabled: 'text-cn-foreground-3 opacity-50',
        day_range_middle: 'aria-selected:bg-cn-background-3 aria-selected:text-cn-foreground-1',
        day_hidden: 'invisible',
        ...classNames
      }}
      components={{
        IconLeft: () => <ChevronLeftIcon className="size-4" />,
        IconRight: () => <ChevronRightIcon className="size-4" />
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
