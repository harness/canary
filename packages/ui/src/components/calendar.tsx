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
        caption_label: 'text-cn-size-2 font-medium select-none',
        nav: 'space-x-cn-3xs flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-cn-3xs',
        nav_button_next: 'absolute right-cn-3xs',
        table: 'w-full border-collapse space-y-cn-3xs',
        head_row: 'flex',
        head_cell: 'text-cn-3 rounded-cn-3 w-8 font-normal text-cn-size-1 select-none',
        row: 'flex w-full mt-cn-xs',
        cell: cn(
          'relative p-0 text-center text-cn-size-2 focus-within:relative focus-within:z-20',
          props.mode === 'range'
            ? '[&:has([aria-selected])]:bg-cn-brand-primary/10 [&:has([aria-selected].day-outside)]:bg-cn-brand-primary/5 [&:has([aria-selected].day-range-end)]:rounded-r-cn-3 [&:has(>.day-range-end)]:rounded-r-cn-3 [&:has(>.day-range-start)]:rounded-l-cn-3 first:[&:has([aria-selected])]:rounded-l-cn-3 last:[&:has([aria-selected])]:rounded-r-cn-3'
            : '[&:has([aria-selected])]:rounded-cn-3'
        ),
        day: cn(buttonVariants({ variant: 'ghost' }), 'h-8 w-8 p-0 font-normal aria-selected:opacity-100'),
        day_range_start: 'day-range-start rounded-l-cn-3',
        day_range_end: 'day-range-end rounded-r-cn-3',
        day_selected:
          'cn-calendar-day-selected !bg-cn-brand-primary hover:!bg-cn-brand-primary-hover focus-visible:!bg-cn-brand-primary-selected rounded-cn-3',
        day_today: 'cn-calendar-day-today rounded-cn-3',
        day_outside:
          'day-outside text-cn-3 opacity-50  aria-selected:bg-cn-3/50 aria-selected:text-cn-3 aria-selected:opacity-30',
        day_disabled: 'text-cn-3 opacity-50',
        day_range_middle: 'cn-calendar-day-range-middle !bg-transparent text-cn-1! aria-selected:opacity-100',
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
