import { type FC, type ReactNode } from 'react'

import { cn } from '../../utils/cn'
import { IconV2, type IconV2NamesType } from '../icon-v2'
import { Layout } from '../layout'
import { Tabs } from '../tabs'
import { Text } from '../text'

export interface HeaderV2TabItem {
  label: string
  value: string
  icon?: IconV2NamesType
  counter?: number
  disabled?: boolean
}

export interface PageHeaderV2Props {
  breadcrumbs?: ReactNode
  title: string | ReactNode
  iconName?: IconV2NamesType
  description?: string
  actions?: ReactNode
  tabs?: HeaderV2TabItem[]
  children?: ReactNode
  className?: string
}

interface TitleSectionProps {
  title: string | ReactNode
  iconName?: IconV2NamesType
  description?: string
  actions?: ReactNode
}

const TitleSection: FC<TitleSectionProps> = ({ title, iconName, description, actions }) => {
  const titleElement =
    typeof title === 'string' ? (
      <Text as="h1" variant="heading-hero" truncate>
        {title}
      </Text>
    ) : (
      title
    )

  return (
    <Layout.Vertical gap="xs">
      <Layout.Horizontal align="center">
        <Layout.Horizontal gap="xs" align="center" className="min-w-0 flex-1">
          {iconName && <IconV2 name={iconName} size="md" />}
          {titleElement}
        </Layout.Horizontal>
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

const TabsSection: FC<{ items: HeaderV2TabItem[] }> = ({ items }) => {
  return (
    <Tabs.NavRoot>
      <Tabs.List variant="underlined">
        {items.map(tab => (
          <Tabs.Trigger key={tab.value} value={tab.value} icon={tab.icon} counter={tab.counter} disabled={tab.disabled}>
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.NavRoot>
  )
}

export const HeaderV2: FC<PageHeaderV2Props> = ({
  title,
  iconName,
  description,
  actions,
  breadcrumbs,
  tabs,
  children,
  className
}) => {
  return (
    <Layout.Vertical gap="none" className={cn('w-full', tabs ? 'mb-0' : 'mb-cn-lg', className)}>
      {breadcrumbs}
      <Layout.Vertical gap="lg" className={breadcrumbs ? 'mt-cn-xs' : undefined}>
        <TitleSection title={title} iconName={iconName} description={description} actions={actions} />
        {(children || tabs) && (
          <Layout.Vertical gap="none">
            {children}
            {tabs && tabs.length > 0 && <TabsSection items={tabs} />}
          </Layout.Vertical>
        )}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
HeaderV2.displayName = 'PageHeaderV2'
