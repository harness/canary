import { type FC, type ReactElement, type ReactNode } from 'react'

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
  /** Optional wrapper for the title element (e.g. DrawerPrimitive.Title asChild). */
  renderTitle?: (title: ReactElement) => ReactNode
  /** Optional wrapper for the description element (e.g. DrawerPrimitive.Description asChild). */
  renderDescription?: (description: ReactElement) => ReactNode
}

export const ContainerHeader: FC<ContainerHeaderProps> = ({
  title,
  caption,
  description,
  actions,
  className,
  descriptionClassName,
  renderTitle,
  renderDescription
}) => {
  const titleElement = (
    <Text as="span" className="min-w-0 flex-1 truncate" variant="heading-base">
      {title}
    </Text>
  )

  const descriptionElement = description ? (
    <Text color="foreground-3" className={descriptionClassName}>
      {description}
    </Text>
  ) : null

  return (
    <Layout.Vertical gap="4xs" className={className}>
      {caption}
      <Layout.Horizontal align="center">
        {renderTitle ? renderTitle(titleElement) : titleElement}
        {actions && (
          <Layout.Horizontal gap="xs" align="center">
            {actions}
          </Layout.Horizontal>
        )}
      </Layout.Horizontal>
      {descriptionElement && (renderDescription ? renderDescription(descriptionElement) : descriptionElement)}
    </Layout.Vertical>
  )
}
ContainerHeader.displayName = 'ContainerHeader'
