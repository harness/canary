import { type FC, type ReactNode } from 'react'

import { cn } from '../../utils/cn'
import { IconV2, type IconV2NamesType } from '../icon-v2'
import { Layout } from '../layout'
import { Tabs } from '../tabs'
import { Text } from '../text'
import { usePageScrollable } from './page'

export interface HeaderV2TabItem {
  label: string
  value: string
  icon?: IconV2NamesType
  counter?: number
  disabled?: boolean
  exact?: boolean
}

type HeaderV2TabsVariant = 'underlined' | 'ghost'

export interface PageHeaderV2Props {
  breadcrumbs?: ReactNode
  title: string | ReactNode
  iconName?: IconV2NamesType
  description?: string
  actions?: ReactNode
  tabs?: HeaderV2TabItem[]
  /** `ghost` renders tabs inline in the title row; `underlined` (default) renders below. */
  tabsVariant?: HeaderV2TabsVariant
  contentTabs?: boolean
  children?: ReactNode
  className?: string
}

interface TitleSectionProps {
  title: string | ReactNode
  iconName?: IconV2NamesType
  description?: string
  actions?: ReactNode
  /** When set, tabs render inline in the title row (ghost variant). */
  inlineTabs?: HeaderV2TabItem[]
}

const TitleSection: FC<TitleSectionProps> = ({ title, iconName, description, actions, inlineTabs }) => {
  const titleElement =
    typeof title === 'string' ? (
      <Text as="h1" variant="heading-hero" truncate>
        {title}
      </Text>
    ) : (
      title
    )

  const actionsElement = actions ? (
    <Layout.Horizontal gap="xs" align="center" className={inlineTabs ? 'shrink-0' : undefined}>
      {actions}
    </Layout.Horizontal>
  ) : null

  return (
    <Layout.Vertical gap="xs">
      {/* Fixed height prevents layout shift when actions prop is present vs absent */}
      <Layout.Horizontal
        align="center"
        justify={inlineTabs ? 'between' : undefined}
        className={inlineTabs ? 'h-[var(--cn-btn-size-sm)]' : 'h-[var(--cn-btn-size-md)]'}
      >
        <Layout.Horizontal
          gap="xs"
          align="center"
          className={cn('text-cn-1 min-w-0', inlineTabs ? 'shrink-0' : 'flex-1')}
        >
          {iconName && <IconV2 name={iconName} size="xl" />}
          {titleElement}
        </Layout.Horizontal>
        {inlineTabs ? (
          <Layout.Horizontal gap="md" align="center" className="min-w-0">
            <NavTabsSection items={inlineTabs} variant="ghost" />
            {actionsElement}
          </Layout.Horizontal>
        ) : (
          actionsElement
        )}
      </Layout.Horizontal>
      {description && <Text color="foreground-3">{description}</Text>}
    </Layout.Vertical>
  )
}

const NavTabsSection: FC<{ items: HeaderV2TabItem[]; variant?: HeaderV2TabsVariant }> = ({
  items,
  variant = 'underlined'
}) => (
  <Tabs.NavRoot>
    <Tabs.List variant={variant}>
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

const ContentTabsSection: FC<{ items: HeaderV2TabItem[] }> = ({ items }) => (
  <Tabs.List variant="underlined">
    {items.map(tab => (
      <Tabs.Trigger key={tab.value} value={tab.value} icon={tab.icon} counter={tab.counter} disabled={tab.disabled}>
        {tab.label}
      </Tabs.Trigger>
    ))}
  </Tabs.List>
)

export const HeaderV2: FC<PageHeaderV2Props> = ({
  title,
  iconName,
  description,
  actions,
  breadcrumbs,
  tabs,
  tabsVariant = 'underlined',
  contentTabs,
  children,
  className
}) => {
  const scrollable = usePageScrollable()
  const hasTabs = tabs && tabs.length > 0
  const showInlineTabs = hasTabs && tabsVariant === 'ghost' && !contentTabs
  const showSeparateTabs = hasTabs && !showInlineTabs
  return (
    <Layout.Vertical
      gap="md"
      className={cn(
        'w-full',
        showSeparateTabs ? 'mb-0' : 'mb-cn-lg',
        // In scrollable mode, Page.Root uses `display: contents` on the wrapper,
        // so this header must own its own padding and sticky positioning.
        scrollable && 'sticky top-0 z-10 bg-cn-1 cn-page-content cn-page-content-pt',
        className
      )}
    >
      {breadcrumbs}
      <TitleSection
        title={title}
        iconName={iconName}
        description={description}
        actions={actions}
        inlineTabs={showInlineTabs ? tabs : undefined}
      />
      {children}
      {showSeparateTabs && contentTabs && <ContentTabsSection items={tabs} />}
      {showSeparateTabs && !contentTabs && <NavTabsSection items={tabs} />}
    </Layout.Vertical>
  )
}
HeaderV2.displayName = 'PageHeaderV2'
