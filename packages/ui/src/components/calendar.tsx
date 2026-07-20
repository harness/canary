import * as React from 'react'

import { DayPicker, type DateRange } from '@daypicker/react'
import { cn } from '@utils/cn'

import { buttonVariants } from './button'
import { IconV2 } from './icon-v2'

export type CalendarProps = React.ComponentProps<typeof DayPicker>
export type CalendarDateRange = DateRange

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('rdp-root p-cn-sm', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-cn-md sm:space-x-cn-md sm:space-y-0',
        month: 'space-y-cn-md',
        month_caption: 'flex justify-center pt-cn-3xs relative items-center',
        caption_label: 'text-cn-size-2 font-medium select-none',
        nav: 'space-x-cn-3xs flex items-center',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-cn-3xs'
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-cn-3xs'
        ),
        month_grid: 'w-full border-collapse space-y-cn-3xs',
        weekdays: 'flex',
        weekday: 'text-cn-3 rounded-cn-3 w-8 font-normal text-cn-size-1 select-none',
        week: 'flex w-full mt-cn-xs',
        day: cn(
          'relative p-0 text-center text-cn-size-2 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-cn-brand-secondary-selected [&:has([aria-selected].day-outside)]:bg-cn-brand-secondary-selected [&:has([aria-selected].day-range-end)]:rounded-r-cn-3',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-cn-3 [&:has(>.day-range-start)]:rounded-l-cn-3 first:[&:has([aria-selected])]:rounded-l-cn-3 last:[&:has([aria-selected])]:rounded-r-cn-3'
            : '[&:has([aria-selected])]:rounded-cn-3'
        ),
        day_button: cn(buttonVariants({ variant: 'ghost' }), 'h-8 w-8 p-0 font-normal aria-selected:opacity-100'),
        range_start: 'day-range-start bg-cn-brand-primary !text-cn-brand-primary hover:!bg-cn-brand-primary-hover',
        range_end: 'day-range-end bg-cn-brand-primary !text-cn-brand-primary hover:!bg-cn-brand-primary-hover',
        selected:
          'bg-cn-brand-primary text-cn-brand-primary hover:!bg-cn-brand-primary-hover hover:text-cn-brand-primary focus:bg-cn-brand focus:text-cn-brand-primary',
        today: 'font-bold',
        outside:
          'day-outside text-cn-3 opacity-50  aria-selected:bg-cn-3/50 aria-selected:text-cn-3 aria-selected:opacity-30',
        disabled: 'text-cn-3 opacity-50',
        range_middle: '!bg-cn-brand-secondary-selected !rounded-none text-cn-1 hover:text-cn-brand-primary',
        hidden: 'invisible',
        ...classNames
      }}
      components={{
        Chevron: props => {
          if (props.orientation === 'left') {
            return <IconV2 name="nav-arrow-left" />
          }
          return <IconV2 name="nav-arrow-right" />
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
