import { forwardRef, type FC, type ReactNode } from 'react'

import { useTranslation } from '@/context'
import { cn } from '@/utils'
import { Drawer as DrawerPrimitive } from 'vaul'

import { Button } from '../button'
import { IconV2, type IconV2NamesType } from '../icon-v2'
import { Layout } from '../layout'
import { LogoV2, type LogoV2NamesType } from '../logo-v2'
import { type HeaderV2TabItem } from '../page/page-header-v2'
import { Skeleton } from '../skeletons'
import { Tabs } from '../tabs'
import { Text } from '../text'
import { DrawerTagline } from './Drawer.Tagline'

export interface DrawerHeaderV2Props {
  title: ReactNode
  /** Tagline / breadcrumb rendered above the title. */
  tagline?: ReactNode
  description?: ReactNode
  icon?: IconV2NamesType | { logo: LogoV2NamesType }
  actions?: ReactNode
  tabs?: HeaderV2TabItem[]
  hideClose?: boolean
  isLoading?: boolean
  children?: ReactNode
  className?: string
}

const TabsSection: FC<{ items: HeaderV2TabItem[] }> = ({ items }) => {
  return (
    <Tabs.List variant="underlined">
      {items.map(tab => (
        <Tabs.Trigger
          key={tab.value}
          value={tab.value}
          icon={tab.icon}
          counter={tab.counter}
          badge={tab.badge}
          disabled={tab.disabled}
        >
          {tab.label}
        </Tabs.Trigger>
      ))}
    </Tabs.List>
  )
}

export const DrawerHeaderV2 = forwardRef<HTMLDivElement, DrawerHeaderV2Props>(
  (
    { title, tagline, description, icon, actions, tabs, hideClose = false, isLoading = false, children, className },
    ref
  ) => {
    const { t } = useTranslation()

    const IconOrLogoComp =
      (!!icon && typeof icon === 'object' && (
        <LogoV2 className="cn-drawer-header-v2-icon" name={icon.logo} size="sm" />
      )) ||
      (!!icon && typeof icon === 'string' && (
        <IconV2 className="cn-drawer-header-v2-icon cn-drawer-header-v2-icon-color" name={icon} size="lg" />
      )) ||
      null

    const closeButton = !hideClose ? (
      <DrawerPrimitive.Close asChild>
        <Button
          className="cn-drawer-close-button"
          variant="ghost"
          iconOnly
          ignoreIconOnlyTooltip
          aria-label={t('component:drawer.close', 'Close')}
        >
          <IconV2 className="cn-drawer-close-button-icon" name="xmark" skipSize />
        </Button>
      </DrawerPrimitive.Close>
    ) : null

    // The actions and the close button share one cluster (2px between them, matching the
    // Figma spec). It is placed in the grid's second column, spanning both rows and top-
    // anchored, so its height never dictates the title row — keeping the description exactly
    // 8px below the title even when the cluster is taller than a single-line title.
    const showActions = !isLoading && !!actions
    const headerActions =
      showActions || closeButton ? (
        <Layout.Horizontal gap="4xs" align="start" className="cn-drawer-header-v2-actions">
          {showActions && (
            <Layout.Horizontal gap="xs" align="center">
              {actions}
            </Layout.Horizontal>
          )}
          {closeButton}
        </Layout.Horizontal>
      ) : null

    // With neither a tagline nor a description, the header collapses to a single row.
    // In that case vertically center the title/icon with the actions + close cluster
    // instead of top-aligning them (top alignment is only needed when stacked tagline/
    // description content makes the header taller than the actions cluster).
    const centerContent = !tagline && !description

    // Keep the header's full-width bottom border even with tabs — it spans the whole drawer;
    // the underlined tab strip's own bottom border overlaps it, which is intentional.
    return (
      <div ref={ref} className={cn('cn-drawer-header-v2', className)}>
        <div
          className={cn('cn-drawer-header-v2-main', {
            'cn-drawer-header-v2-main-centered': centerContent
          })}
        >
          <Layout.Vertical gap="4xs" className="cn-drawer-header-v2-title-group min-w-0">
            {tagline ? <DrawerTagline>{tagline}</DrawerTagline> : null}
            <Layout.Horizontal gap="2xs" align="center" className="min-w-0">
              {IconOrLogoComp}
              <DrawerPrimitive.Title asChild>
                <Text
                  variant="heading-default"
                  color="foreground-1"
                  truncate
                  className="cn-drawer-title min-w-0 flex-1"
                >
                  {title}
                </Text>
              </DrawerPrimitive.Title>
            </Layout.Horizontal>
          </Layout.Vertical>
          {headerActions}
          {/* The description is optional. When present it renders visibly; when omitted we still
              emit a screen-reader-only Description so the dialog keeps an accessible description
              (matching Radix's optional-description contract) instead of warning about a missing one. */}
          {description ? (
            <DrawerPrimitive.Description asChild>
              <Text className="cn-drawer-header-v2-description" color="foreground-2">
                {description}
              </Text>
            </DrawerPrimitive.Description>
          ) : (
            <DrawerPrimitive.Description className="sr-only">
              {t('component:drawer.noDescription', 'No description available')}
            </DrawerPrimitive.Description>
          )}
        </div>
        {children && (
          <div className="cn-drawer-header-v2-metadata">
            {isLoading ? <Skeleton.Box className="h-10 w-full" /> : children}
          </div>
        )}
        {tabs && tabs.length > 0 && (
          <div className="cn-drawer-header-v2-tabs">
            <TabsSection items={tabs} />
          </div>
        )}
      </div>
    )
  }
)
DrawerHeaderV2.displayName = 'DrawerHeaderV2'
