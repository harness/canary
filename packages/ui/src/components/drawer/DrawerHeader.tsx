import { Children, forwardRef, HTMLAttributes, ReactNode } from 'react'

import { Button, IconV2, IconV2NamesType, LogoV2, LogoV2NamesType } from '@/components'
import { cn, getComponentDisplayName } from '@/utils'
import { Drawer as DrawerPrimitive } from 'vaul'

import { DrawerHeaderV2, type DrawerHeaderV2Props } from './drawer-header-v2'
import { DrawerTagline } from './Drawer.Tagline'

// `title` is reserved for the structured API below, so it is omitted from the passthrough
// HTML attributes on the legacy (composition) path.
type DrawerHeaderBaseProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> & {
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

/**
 * Legacy composition API — pass `Drawer.Title`, `Drawer.Tagline`, `Drawer.Description` etc. as children.
 */
export type DrawerHeaderLegacyProps = DrawerHeaderBaseProps &
  (DrawerHeaderIconOnlyProps | DrawerHeaderLogoOnlyProps | DrawerHeaderNoIconOrLogoProps)

/**
 * Structured API — a single standardized header driven by props (tagline, description,
 * actions, tabs, loading state). Prefer this for new usage.
 */
export type DrawerHeaderStructuredProps = DrawerHeaderV2Props

export type DrawerHeaderProps = DrawerHeaderLegacyProps | DrawerHeaderStructuredProps

/** Structured mode is selected when a `title` prop is provided; otherwise children compose the header. */
const isStructured = (props: DrawerHeaderProps): props is DrawerHeaderStructuredProps =>
  'title' in props && props.title != null

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>((props, ref) => {
  if (isStructured(props)) {
    return <DrawerHeaderV2 ref={ref} {...props} />
  }

  const { className, children, icon, logo, hideClose = false, ...rest } = props
  const IconOrLogoComp =
    (!!icon && <IconV2 className="cn-drawer-header-icon cn-drawer-header-icon-color" name={icon} size="lg" />) ||
    (!!logo && <LogoV2 className="cn-drawer-header-icon" name={logo} size="sm" />) ||
    null

  const { taglineChildren, titleChildren, otherChildren } = Children.toArray(children).reduce<{
    taglineChildren: ReactNode[]
    titleChildren: ReactNode[]
    otherChildren: ReactNode[]
  }>(
    (acc, child) => {
      const displayName = getComponentDisplayName(child)

      if (displayName === DrawerTagline.displayName) {
        acc.taglineChildren.push(child)
      } else if (displayName === DrawerPrimitive.Title.displayName) {
        acc.titleChildren.push(child)
      } else {
        acc.otherChildren.push(child)
      }
      return acc
    },
    { taglineChildren: [], titleChildren: [], otherChildren: [] }
  )

  const hasTitleGroup = !!taglineChildren.length || !!titleChildren.length || !!IconOrLogoComp

  return (
    <div className={cn('cn-drawer-header', className)} ref={ref} {...rest}>
      {hasTitleGroup ? (
        <div className="cn-drawer-header-top">
          {/* Tagline spans above; the icon/logo sits inline with the title (matches the V2 header). */}
          <div className="cn-drawer-header-strings">
            {taglineChildren}
            <div className="cn-drawer-header-title-line">
              {IconOrLogoComp}
              {titleChildren}
            </div>
          </div>
          {!hideClose && (
            <DrawerPrimitive.Close asChild>
              <Button className="cn-drawer-close-button" variant="ghost" iconOnly ignoreIconOnlyTooltip>
                <IconV2 className="cn-drawer-close-button-icon" name="xmark" skipSize />
              </Button>
            </DrawerPrimitive.Close>
          )}
          {/* Description and any other composed children render full-width, one row below the
              title group (8px down) — not squeezed into the column beside the close button. */}
          {otherChildren.length > 0 && <div className="cn-drawer-header-content">{otherChildren}</div>}
        </div>
      ) : (
        otherChildren
      )}
    </div>
  )
})
DrawerHeader.displayName = 'DrawerHeader'
