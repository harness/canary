import * as React from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'

import { cn } from '@utils/cn'

import { buttonVariants } from './button'
import { IconV2 } from './icon-v2'

export type CalendarProps = React.ComponentProps<typeof DayPicker>
export type CalendarDateRange = DateRange

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-cn-sm', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-cn-md sm:space-x-cn-md sm:space-y-0',
        month: 'space-y-cn-md',
        caption: 'flex justify-center pt-cn-3xs relative items-center',
        caption_label: 'text-cn-size-2 font-medium',
        nav: 'space-x-cn-3xs flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-cn-3xs',
        nav_button_next: 'absolute right-cn-3xs',
        table: 'w-full border-collapse space-y-cn-3xs',
        head_row: 'flex',
        head_cell: 'text-cn-3 rounded-cn-3 w-8 font-normal text-cn-size-1',
        row: 'flex w-full mt-cn-xs',
        cell: cn(
          'relative p-0 text-center text-cn-size-2 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-cn-3 [&:has([aria-selected].day-outside)]:bg-cn-3/50 [&:has([aria-selected].day-range-end)]:rounded-r-cn-3',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-cn-3 [&:has(>.day-range-start)]:rounded-l-cn-3 first:[&:has([aria-selected])]:rounded-l-cn-3 last:[&:has([aria-selected])]:rounded-r-cn-3'
            : '[&:has([aria-selected])]:rounded-cn-3'
        ),
        day: cn(buttonVariants({ variant: 'ghost' }), 'h-8 w-8 p-0 font-normal aria-selected:opacity-100'),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-cn-brand text-cn-brand hover:bg-cn-brand-hover hover:text-cn-brand focus:bg-cn-brand focus:text-cn-brand',
        day_today: 'bg-cn-3 text-cn-1',
        day_outside:
          'day-outside text-cn-3 opacity-50  aria-selected:bg-cn-3/50 aria-selected:text-cn-3 aria-selected:opacity-30',
        day_disabled: 'text-cn-3 opacity-50',
        day_range_middle: 'aria-selected:bg-cn-3 aria-selected:text-cn-1',
        day_hidden: 'invisible',
        ...classNames
      }}
      components={{
        IconLeft: () => <IconV2 name="nav-arrow-left" />,
        IconRight: () => <IconV2 name="nav-arrow-right" />
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
