import { ReactElement, ReactNode } from 'react'

import { Layout } from '@harnessio/ui/components'
import { Text } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'

interface LineTitleProps {
  text?: string
  icon?: ReactElement
  textClassName?: string
}

interface LineDescriptionProps {
  text?: string | ReactNode
}

export const LineTitle = ({ ...props }: LineTitleProps) => {
  return (
    <Layout.Horizontal gap="2xs" align="center">
      {props?.icon}
      <Text as="h3" variant="body-single-line-strong" className={cn('text-cn-1', props?.textClassName)}>
        {props?.text}
      </Text>
    </Layout.Horizontal>
  )
}

export const LineDescription = ({ ...props }: LineDescriptionProps) => {
  return (
    // TODO: Replace ml-[28px] with a proper spacing token when available
    <Text className="ml-[28px]" variant="body-normal" color="foreground-3">
      {props.text}
    </Text>
  )
}
