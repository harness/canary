import { ReactElement } from 'react'

import { Layout } from '@components/layout'
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
    <Layout.Horizontal gap="xs" align="center">
      {props?.icon}
      <Text as="h3" variant="body-single-line-strong" className={cn('text-cn-foreground-1', props?.textClassName)}>
        {props?.text}
      </Text>
    </Layout.Horizontal>
  )
}

export const LineDescription = ({ ...props }: LineDescriptionProps) => {
  return (
    <Text className="ml-6" variant="body-normal" color="foreground-3">
      {props.text}
    </Text>
  )
}
