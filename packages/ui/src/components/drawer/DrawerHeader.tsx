import { Children, HTMLAttributes, ReactNode } from 'react'

import { IconV2, IconV2NamesType, LogoV2, LogoV2NamesType } from '@/components'
import { cn, getComponentDisplayName } from '@/utils'
import { Drawer as DrawerPrimitive } from 'vaul'

import { DrawerTagline } from './Drawer.Tagline'

type DrawerHeaderBaseProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode
}

type DrawerHeaderIconOnlyProps = {
  icon: IconV2NamesType
  logo?: never
}

type DrawerHeaderLogoOnlyProps = {
  logo: LogoV2NamesType
  icon?: never
}

type DrawerHeaderNoIconOrLogoProps = {
  icon?: never
  logo?: never
}

export type DrawerHeaderProps = DrawerHeaderBaseProps &
  (DrawerHeaderIconOnlyProps | DrawerHeaderLogoOnlyProps | DrawerHeaderNoIconOrLogoProps)

export const DrawerHeader = ({ className, children, icon, logo, ...props }: DrawerHeaderProps) => {
  const IconOrLogoComp =
    (!!icon && <IconV2 className="cn-drawer-header-icon cn-drawer-header-icon-color" name={icon} size="xl" />) ||
    (!!logo && <LogoV2 className="cn-drawer-header-icon" name={logo} size="md" />) ||
    null

  const { titleChildren, otherChildren } = Children.toArray(children).reduce<{
    titleChildren: ReactNode[]
    otherChildren: ReactNode[]
  }>(
    (acc, child) => {
      const displayName = getComponentDisplayName(child)

      if (displayName === DrawerPrimitive.Title.displayName || displayName === DrawerTagline.displayName) {
        acc.titleChildren.push(child)
      } else {
        acc.otherChildren.push(child)
      }
      return acc
    },
    { titleChildren: [], otherChildren: [] }
  )

  return (
    <div className={cn('cn-drawer-header', className)} {...props}>
      {(!!titleChildren.length || !!IconOrLogoComp) && (
        <div className="cn-drawer-header-top">
          {IconOrLogoComp}
          <div className="cn-drawer-header-title">{titleChildren}</div>
        </div>
      )}
      {otherChildren}
    </div>
  )
}
DrawerHeader.displayName = 'DrawerHeader'
