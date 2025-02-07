import { FC } from 'react'

import { Badge, Button, Icon } from '@/components'
import { cn } from '@utils/cn'

const widgetSubheadingClass = 'text-foreground-4 text-10 font-medium leading-tight uppercase'
const widgetIssueStatusClass = 'rounded-[3px] w-full h-1'
const widgetSuggestionButtonClass =
  'text-14 text-foreground-2 hover:bg-background-4 hover:text-foreground-1 relative h-auto justify-start whitespace-normal rounded pr-2.5 pl-[22px] py-[7px] text-left font-medium leading-tight'

const SecurityWidget: FC = () => {
  return (
    <div className="rounded-10 border-borders-4 bg-background-2 after:bg-widget-bg-gradient relative mt-3 overflow-hidden border p-3 shadow-[0_8px_16px_0_hsl(var(--canary-box-shadow-1))] after:pointer-events-none after:absolute after:-top-14 after:left-5 after:z-10 after:size-[310px] after:rounded-[100%]">
      <div className="relative z-[18] min-h-[480px]">
        <span className="text-foreground-1 text-16 block font-semibold leading-snug">Security test results</span>
        <div className="mt-[22px] flex flex-col items-center">
          <span className="after:bg-widget-number-bg-gradient relative after:absolute after:left-1/2 after:top-1/2 after:z-10 after:size-[64px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-[100%] after:blur-[20px]">
            <span className="bg-widget-number-gradient relative z-[18] bg-clip-text text-[64px] font-medium leading-none text-transparent">
              4
            </span>
          </span>
          <span className="text-12 text-foreground-5 mt-1.5 leading-none">Total issues detected</span>
          <div className="mx-1 mt-4 flex w-full items-center gap-x-1">
            <span className={cn(widgetIssueStatusClass, 'bg-label-foreground-red')} />
            <span className={cn(widgetIssueStatusClass, 'bg-label-foreground-orange')} />
            <span className={cn(widgetIssueStatusClass, 'bg-label-foreground-yellow')} />
            <span className={cn(widgetIssueStatusClass, 'bg-label-foreground-purple')} />
          </div>
        </div>

        <Separator className="mt-2.5" />

        <div className="flex flex-col">
          <div className="mt-3 flex items-center justify-between">
            <span className={cn(widgetSubheadingClass)}>Issues</span>
            <Button className="h-auto px-0" variant="custom" aria-label="Collapse/Expend issues">
              <Icon className="text-icons-1" name="chevron-fill-down" size={6} />
            </Button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Badge
              className="bg-label-background-red text-label-foreground-red h-[18px] rounded border-none"
              size="sm"
              theme="destructive"
            >
              Critical
            </Badge>
            <div className="flex items-center">
              <Button className="-ml-1.5 h-auto p-1" variant="custom" aria-label="Prev issue">
                <Icon className="text-icons-6 rotate-90" name="arrow-short" size={12} />
              </Button>
              <span className="text-10 text-foreground-3 mx-[5px]">1 of 4</span>
              <Button className="-mr-1.5 h-auto p-1" variant="custom" aria-label="Next issue">
                <Icon className="text-icons-1 -rotate-90" name="arrow-short" size={12} />
              </Button>
            </div>
          </div>

          <div className="text-14 mt-1.5 leading-snug">
            <span className="text-foreground-1 font-medium">SQL Injection</span>
            <p className="text-foreground-3 mt-1">
              Unsanitized user input in the comment section allows potential malicious script execution.
            </p>
            <p className="text-foreground-2 mt-4 flex items-center gap-x-1.5 leading-tight">
              <Icon className="text-icons-9" name="file" size={16} />
              <span>src/database/queries.js</span>
            </p>
          </div>
        </div>

        <Separator className="mt-3" />

        <div className="mt-2">
          <span className={cn(widgetSubheadingClass)}>Smart suggestions</span>
          <div className="mt-1 flex flex-col gap-y-1">
            <Button className={cn(widgetSuggestionButtonClass)} variant="custom">
              <Icon className="text-icons-9 absolute -left-3 -top-1" name="sparks-gradient" size={42} />
              Sanitize user input using prepared statements or ORM.
            </Button>
            <Button className={cn(widgetSuggestionButtonClass)} variant="custom">
              <Icon className="text-icons-9 absolute -left-3 -top-1" name="sparks-gradient" size={42} />
              Fix all issues with AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SeparatorProps {
  className?: string
}

const Separator = ({ className }: SeparatorProps) => {
  return <span className={cn('bg-borders-5 block h-px', className)} aria-hidden />
}

export const Widget = {
  SecurityWidget,
  Separator
}
