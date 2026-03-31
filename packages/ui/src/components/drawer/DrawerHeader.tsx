import { Children, forwardRef, HTMLAttributes, ReactNode } from 'react'

import { Button, IconV2, IconV2NamesType, LogoV2, LogoV2NamesType } from '@/components'
import { cn, getComponentDisplayName } from '@/utils'
import { Drawer as DrawerPrimitive } from 'vaul'

import { DrawerTagline } from './Drawer.Tagline'

type DrawerHeaderBaseProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode
  hideClose?: boolean
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

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, children, icon, logo, hideClose = false, ...props }, ref) => {
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
      <div className={cn('cn-drawer-header', className)} ref={ref} {...props}>
        {(!!titleChildren.length || !!IconOrLogoComp) && (
          <div className="cn-drawer-header-top gap-cn-xs flex items-center">
            {IconOrLogoComp}
            <div className="cn-drawer-header-title flex-1">{titleChildren}</div>
            {!hideClose && (
              <DrawerPrimitive.Close asChild>
                <Button className="cn-drawer-close-button" variant="ghost" iconOnly ignoreIconOnlyTooltip>
                  <IconV2 className="cn-drawer-close-button-icon" name="xmark" skipSize />
                </Button>
              </DrawerPrimitive.Close>
            )}
          </div>
        )}
        {otherChildren}
      </div>
    )
  }
)
DrawerHeader.displayName = 'DrawerHeader'
