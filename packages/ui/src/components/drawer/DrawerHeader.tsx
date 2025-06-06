import { Children, HTMLAttributes, ReactNode } from 'react'

import { IconPropsV2, IconV2, Logo, LogoProps } from '@/components'
import { cn, getComponentDisplayName } from '@/utils'
import { Drawer as DrawerPrimitive } from 'vaul'

import { DrawerTagline } from './Drawer.Tagline'

type DrawerHeaderBaseProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode
}

type DrawerHeaderIconOnlyProps = {
  icon: IconPropsV2['name']
  logo?: never
}

type DrawerHeaderLogoOnlyProps = {
  logo: LogoProps['name']
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
    (!!icon && <IconV2 className="cn-drawer-header-icon cn-drawer-header-icon-color" name={icon} skipSize />) ||
    (!!logo && <Logo className="cn-drawer-header-icon" name={logo} />) ||
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
