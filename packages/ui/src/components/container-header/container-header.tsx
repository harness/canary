import { type FC, type ReactNode } from 'react'

import { Layout } from '../layout'
import { Text } from '../text'

export interface ContainerHeaderProps {
  title: string
  /** Optional line rendered above the title (e.g. a tagline or breadcrumb). */
  caption?: ReactNode
  description?: string
  actions?: ReactNode
  className?: string
  /** Applied to the description text — e.g. to clamp it to a fixed number of lines. */
  descriptionClassName?: string
}

export const ContainerHeader: FC<ContainerHeaderProps> = ({
  title,
  caption,
  description,
  actions,
  className,
  descriptionClassName
}) => {
  return (
    <Layout.Vertical gap="4xs" className={className}>
      {caption}
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
      {description && (
        <Text color="foreground-3" className={descriptionClassName}>
          {description}
        </Text>
      )}
    </Layout.Vertical>
  )
}
ContainerHeader.displayName = 'ContainerHeader'
