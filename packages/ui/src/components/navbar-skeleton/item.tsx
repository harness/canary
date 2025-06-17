import { forwardRef, ReactElement } from 'react'

import { Illustration, Text } from '@/components'
import { useTheme } from '@/context/theme'
import { cn } from '@utils/cn'

export interface ItemProps {
  icon?: ReactElement<SVGSVGElement>
  text: string
  description?: string
  active?: boolean
  className?: string
  submenuItem?: boolean
  onClick?: () => void
  isMainNav?: boolean
}

export const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ icon, text, description, active, submenuItem = false, className, isMainNav, ...props }, ref) => {
    const { isLightTheme } = useTheme()

    if (submenuItem) {
      return (
        <div
          ref={ref}
          className={cn(
            'group relative grid cursor-pointer select-none grid-cols-[auto_1fr] items-center gap-3 pb-[0.6875rem] pt-[0.5625rem] py-2.5 px-3 rounded-md',
            { 'gap-0': !icon },
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'group-hover:bg-cn-background-hover absolute z-0 h-full w-full rounded-[10px] bg-transparent transition-colors',
              { 'group-hover:bg-sidebar-background-2': isMainNav },
              { 'bg-cn-background-hover': active },
              { 'bg-sidebar-background-2': active && isMainNav }
            )}
          />
          <div className="z-10 col-start-1 row-span-full mt-px flex items-center">
            {icon ? (
              <div
                className={cn(
                  'sub-menu-icon-bg relative flex size-8 place-content-center place-items-center rounded border border-cn-borders-2 bg-cn-background-2',
                  { 'border-sidebar-border-3 bg-sidebar-background-7': isMainNav }
                )}
              >
                <Illustration
                  className={cn('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-cn-foreground-3', {
                    'text-sidebar-icon-2': isMainNav
                  })}
                  name="sub-menu-ellipse"
                  size={18}
                />
                {icon}
              </div>
            ) : (
              <div />
            )}
          </div>
          <div className="col-start-2 flex min-w-0 flex-col items-start">
            <Text
              variant="body-strong"
              truncate
              className={cn(
                'text-cn-foreground-2 group-hover:text-cn-foreground-1 z-10 w-full duration-0 ease-in-out',
                { 'text-sidebar-foreground-2 group-hover:text-sidebar-foreground-1': isMainNav },
                { 'text-cn-foreground-1': active },
                { 'text-sidebar-foreground-1': active && isMainNav }
              )}
            >
              {text}
            </Text>
            {!!description && (
              <Text
                variant="body-single-line-normal"
                className={cn('z-10 w-full duration-0 ease-in-out', {
                  'text-sidebar-foreground-4': isMainNav
                })}
                truncate
              >
                {description}
              </Text>
            )}
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'group relative grid cursor-pointer select-none grid-cols-[auto_1fr] gap-2.5 py-1.5 px-2.5 rounded-md',
          { 'gap-0': !icon },
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'absolute z-0 h-full w-full rounded-[4px] bg-transparent transition-colors',
            { 'group-hover:bg-sidebar-background-2': isMainNav && isLightTheme },
            { 'bg-cn-background-hover': active },
            { 'bg-sidebar-background-3': active && isMainNav }
          )}
        />
        {icon && (
          <div
            className={cn(
              'text-icons-4 group-hover:text-icons-2 relative z-10 flex h-3.5 w-3.5 min-w-3.5 mt-0.5 items-center duration-100 ease-in-out',
              { 'text-sidebar-icon-3 group-hover:text-sidebar-icon-1': isMainNav },
              { 'text-icons-2': active },
              { 'text-sidebar-icon-1': active && isMainNav }
            )}
          >
            {active && <span className="absolute left-1/2 top-1/2 z-[-1] size-7 -translate-x-1/2 -translate-y-1/2" />}
            {icon}
          </div>
        )}
        <Text
          variant="heading-small"
          align="left"
          color="foreground-3"
          className={cn(
            'group-hover:text-cn-foreground-1 relative z-10 duration-100 ease-in-out',
            { 'text-sidebar-foreground-2 group-hover:text-sidebar-foreground-1': isMainNav },
            { 'text-cn-foreground-1': active },
            { 'text-sidebar-foreground-1': active && isMainNav }
          )}
        >
          {text}
        </Text>
      </div>
    )
  }
)

Item.displayName = 'NavbarSkeletonItem'
