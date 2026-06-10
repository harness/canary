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
  exact?: boolean
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
      {/* Fixed height prevents layout shift when actions prop is present vs absent */}
      <Layout.Horizontal align="center" className="h-[var(--cn-btn-size-md)]">
        <Layout.Horizontal gap="xs" align="center" className="text-cn-1 min-w-0 flex-1">
          {iconName && <IconV2 name={iconName} size="xl" />}
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

const TabsSection: FC<{ items: HeaderV2TabItem[] }> = ({ items }) => (
  <Tabs.NavRoot>
    <Tabs.List variant="underlined">
      {items.map(tab => (
        <Tabs.Trigger
          key={tab.value}
          value={tab.value}
          icon={tab.icon}
          counter={tab.counter}
          disabled={tab.disabled}
          exact={tab.exact}
        >
          {tab.label}
        </Tabs.Trigger>
      ))}
    </Tabs.List>
  </Tabs.NavRoot>
)

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
  const hasTabs = tabs && tabs.length > 0
  return (
    <Layout.Vertical gap="md" className={cn('w-full', hasTabs ? 'mb-0' : 'mb-cn-md', className)}>
      {breadcrumbs}
      <TitleSection title={title} iconName={iconName} description={description} actions={actions} />
      {children}
      {hasTabs && <TabsSection items={tabs} />}
    </Layout.Vertical>
  )
}
HeaderV2.displayName = 'PageHeaderV2'
