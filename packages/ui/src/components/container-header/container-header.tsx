import { type FC, type ReactNode } from 'react'

import { Layout } from '../layout'
import { Text, type TextProps } from '../text'

export interface ContainerHeaderProps {
  title: string
  /** Optional line rendered above the title (e.g. a tagline or breadcrumb). */
  caption?: ReactNode
  description?: string
  actions?: ReactNode
  className?: string
  /** Applied to the description text — e.g. to clamp it to a fixed number of lines. */
  descriptionClassName?: string
  /** Typography variant for the title text. Defaults to `heading-base`. */
  titleVariant?: TextProps['variant']
  /** Element rendered inline before the title (e.g. an icon or logo), centered with it. */
  titleLeading?: ReactNode
}

export const ContainerHeader: FC<ContainerHeaderProps> = ({
  title,
  caption,
  description,
  actions,
  className,
  descriptionClassName,
  titleVariant = 'heading-base',
  titleLeading
}) => {
  const titleText = (
    <Text as="span" className="min-w-0 flex-1 truncate" variant={titleVariant}>
      {title}
    </Text>
  )

  return (
    <Layout.Vertical gap="4xs" className={className}>
      {caption}
      <Layout.Horizontal align="center">
        {titleLeading ? (
          <Layout.Horizontal gap="2xs" align="center" className="min-w-0 flex-1">
            {titleLeading}
            {titleText}
          </Layout.Horizontal>
        ) : (
          titleText
        )}
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
