import { Children, createContext, FC, ReactNode, useContext } from 'react'
import type { LinkProps } from 'react-router-dom'

import { Layout, Link, ScrollArea, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils'

interface WidgetsContextProps {
  isTwoColumn: boolean
}

const WidgetsContext = createContext<WidgetsContextProps>({
  isTwoColumn: false
})

export interface WidgetsRootProps extends Partial<WidgetsContextProps> {
  children: ReactNode
}

const Root: FC<WidgetsRootProps> = ({ children, isTwoColumn: isTwoColumnProp = false }) => {
  const isTwoColumn = isTwoColumnProp && Children.count(children) > 1

  return (
    <WidgetsContext.Provider value={{ isTwoColumn }}>
      <div className={cn('gap-[var(--cn-spacing-10)]', isTwoColumn ? 'columns-2' : 'flex flex-col')}>{children}</div>
    </WidgetsContext.Provider>
  )
}

export interface WidgetsItemProps {
  children: ReactNode
  title: string
  moreLink?: LinkProps
  isWidgetTable?: boolean
  className?: string
}

const Item: FC<WidgetsItemProps> = ({ children, title, moreLink, isWidgetTable = false, className }) => {
  const { isTwoColumn } = useContext(WidgetsContext)
  const { t } = useTranslation()

  return (
    <Layout.Vertical
      className={cn('overflow-hidden', { 'break-inside-avoid pb-[var(--cn-spacing-10)] last:pb-0': isTwoColumn })}
    >
      <Layout.Flex justify="between" gap="md" align="start">
        <Text as="h2" variant="heading-subsection" color="foreground-1">
          {title}
        </Text>
        {!!moreLink && (
          <Link className="shrink-0" {...moreLink} suffixIcon="nav-arrow-right">
            {t('component:widgets.viewMore', 'View more')}
          </Link>
        )}
      </Layout.Flex>
      <div
        className={cn(
          '[contain:inline-size]',
          { 'border border-cn-borders-3 rounded-3 p-[var(--cn-spacing-5)]': !isWidgetTable },
          className
        )}
      >
        <ScrollArea classNameContent="w-full">{children}</ScrollArea>
      </div>
    </Layout.Vertical>
  )
}

export const Widgets = {
  Root,
  Item
}
