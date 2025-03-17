import { ReactElement } from 'react'

import { cn } from '@/utils'

interface LineTitleProps {
  text?: string
  icon?: ReactElement
  textClassName?: string
}

interface LineDescriptionProps {
  text?: string
}

export const LineTitle = ({ ...props }: LineTitleProps) => {
  return (
    <div className="inline-flex items-center gap-2">
      {props?.icon}
      <h3 className={cn('text-14 font-medium leading-snug', props?.textClassName)}>{props?.text}</h3>
    </div>
  )
}

export const LineDescription = ({ ...props }: LineDescriptionProps) => {
  return (
    <div className="ml-6 inline-flex items-center gap-2">
      <p className="text-14 font-normal leading-snug text-foreground-4">{props.text}</p>
    </div>
  )
}
