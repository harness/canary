import { Children, HTMLAttributes, isValidElement, ReactNode } from 'react'

import { Icon, IconProps, Logo, LogoProps } from '@/components'
import { cn } from '@/utils'
import { Drawer as DrawerPrimitive } from 'vaul'

type DrawerHeaderBaseProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode
}

type DrawerHeaderIconOnlyProps = {
  icon: IconProps['name']
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
    (!!icon && <Icon className="cn-drawer-header-icon cn-drawer-header-icon-color" name={icon} skipSize />) ||
    (!!logo && <Logo className="cn-drawer-header-icon" name={logo} />) ||
    null

  const { titleChild, otherChildren } = Children.toArray(children).reduce<{
    titleChild: ReactNode | null
    otherChildren: ReactNode[]
  }>(
    (acc, child) => {
      if (isValidElement(child) && child.type === DrawerPrimitive.Title) {
        acc.titleChild = child
      } else {
        acc.otherChildren.push(child)
      }
      return acc
    },
    { titleChild: null, otherChildren: [] }
  )

  return (
    <div className={cn('cn-drawer-header', className)} {...props}>
      <div
        className={cn('cn-drawer-header-top', {
          'cn-drawer-header-top-with-icon': !!IconOrLogoComp
        })}
      >
        {IconOrLogoComp}
        {titleChild}
      </div>
      {otherChildren}
    </div>
  )
}
DrawerHeader.displayName = 'DrawerHeader'
