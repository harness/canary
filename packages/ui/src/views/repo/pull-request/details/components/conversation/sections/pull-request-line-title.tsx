import { ReactElement } from 'react'

import { Text } from '@components/text'
import { cn } from '@utils/cn'

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
      <Text as="h3" variant="body-single-line-strong" className={cn('text-cn-foreground-1', props?.textClassName)}>
        {props?.text}
      </Text>
    </div>
  )
}

export const LineDescription = ({ ...props }: LineDescriptionProps) => {
  return (
    <div className="ml-6 inline-flex items-center gap-2">
      <Text variant="body-single-line-normal" className="text-cn-foreground-4">
        {props.text}
      </Text>
    </div>
  )
}
