import { type FC, type ReactNode } from 'react'

import { Layout } from '../layout'
import { Text } from '../text'

export interface ContainerHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export const ContainerHeader: FC<ContainerHeaderProps> = ({ title, description, actions, className }) => {
  return (
    <Layout.Vertical gap="4xs" className={className}>
      <Layout.Horizontal align="center">
        <Text as="span" className="min-w-0 flex-1 truncate" variant="heading-base">
          {title}
        </Text>
        {actions && (
          <Layout.Horizontal gap="xs" align="center">
            {actions}
          </Layout.Horizontal>
        )}
      </Layout.Horizontal>
      {description && <Text color="foreground-3">{description}</Text>}
    </Layout.Vertical>
  )
}
ContainerHeader.displayName = 'ContainerHeader'
