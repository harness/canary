import { ReactElement } from 'react'

import { Icon, Text } from '@/components'
import { cn } from '@utils/cn'

export interface ItemProps {
  icon?: ReactElement<SVGSVGElement>
  text: string
  description?: string
  active?: boolean
  className?: string
  submenuItem?: boolean
  onClick?: () => void
}

export function Item({ icon, text, description, active, submenuItem, className }: ItemProps) {
  if (submenuItem) {
    return (
      <div
        className={cn(
          'group relative grid cursor-pointer select-none grid-cols-[auto_1fr] items-center gap-3 pb-[0.6875rem] pt-[0.5625rem]',
          { 'gap-0': !icon },
          className
        )}
      >
        <div
          className={cn(
            'group-hover:bg-background-4 absolute -inset-x-3 z-0 h-full w-auto rounded-[10px] bg-transparent',
            { 'bg-background-4': active }
          )}
        />
        <div className="z-10 col-start-1 row-span-full mt-px flex items-center">
          {icon ? (
            <div className="sub-menu-icon-bg relative flex size-8 place-content-center place-items-center rounded border border-borders-1 bg-background-2">
              <Icon
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground-3"
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
            size={2}
            truncate
            weight="medium"
            className={cn('text-foreground-2 group-hover:text-foreground-1 z-10 w-full duration-0 ease-in-out', {
              'text-foreground-1': active
            })}
          >
            {text}
          </Text>
          {!!description && (
            <Text className="z-10 w-full truncate leading-4 text-foreground-4 duration-0 ease-in-out" size={1} truncate>
              {description}
            </Text>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('group flex cursor-pointer select-none gap-2.5 py-1', { 'gap-0': !icon }, className)}>
      {icon && (
        <div
          className={cn(
            'text-icons-4 group-hover:text-icons-2 relative z-10 mt-1 flex h-3 w-3 min-w-3 items-center duration-100 ease-in-out',
            { 'text-icons-2': active }
          )}
        >
          {active && (
            <span
              className="absolute left-1/2 top-1/2 z-[-1] size-7 -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.11) 17.63%, rgba(255, 255, 255, 0.07) 40.23%, rgba(255, 255, 255, 0.03) 61.54%, rgba(255, 255, 255, 0.01) 80%, rgba(255, 255, 255, 0.00) 100%)'
              }}
            />
          )}
          {icon}
        </div>
      )}
      <Text
        size={2}
        weight="medium"
        className={cn('text-foreground-3 group-hover:text-foreground-1 z-10 text-left duration-100 ease-in-out', {
          'text-foreground-1': active
        })}
      >
        {text}
      </Text>
    </div>
  )
}
