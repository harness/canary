import { type FC, type ReactNode } from 'react'

import { cn } from '@/utils'
import { Drawer as DrawerPrimitive } from 'vaul'

import { Button } from '../button'
import { ContainerHeader } from '../container-header'
import { IconV2, type IconV2NamesType } from '../icon-v2'
import { LogoV2, type LogoV2NamesType } from '../logo-v2'
import { type HeaderV2TabItem } from '../page/page-header-v2'
import { Skeleton } from '../skeletons'
import { Tabs } from '../tabs'

export interface DrawerHeaderV2Props {
  title: string
  description?: string
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
        <Tabs.Trigger key={tab.value} value={tab.value} icon={tab.icon} counter={tab.counter} disabled={tab.disabled}>
          {tab.label}
        </Tabs.Trigger>
      ))}
    </Tabs.List>
  )
}

export const DrawerHeaderV2: FC<DrawerHeaderV2Props> = ({
  title,
  description,
  icon,
  actions,
  tabs,
  hideClose = false,
  isLoading = false,
  children,
  className
}) => {
  const IconOrLogoComp =
    (!!icon && typeof icon === 'object' && (
      <LogoV2 className="cn-drawer-header-v2-icon" name={icon.logo} size="md" />
    )) ||
    (!!icon && typeof icon === 'string' && <IconV2 className="cn-drawer-header-v2-icon" name={icon} size="xl" />) ||
    null

  return (
    <div className={cn('cn-drawer-header-v2', tabs?.length && 'border-b-0', className)}>
      <div className="cn-drawer-header-v2-title-row">
        {IconOrLogoComp}
        <ContainerHeader
          title={title}
          description={description}
          actions={!isLoading ? actions : undefined}
          className="min-w-0 flex-1"
        />
        {!hideClose && (
          <DrawerPrimitive.Close asChild>
            <Button className="cn-drawer-close-button" variant="ghost" iconOnly ignoreIconOnlyTooltip>
              <IconV2 className="cn-drawer-close-button-icon" name="xmark" skipSize />
            </Button>
          </DrawerPrimitive.Close>
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
DrawerHeaderV2.displayName = 'DrawerHeaderV2'
