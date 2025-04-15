import { FC } from 'react'

import { useRouterContext } from '@/context'
import { Button } from '@components/button'
import { DropdownMenu } from '@components/dropdown-menu'
import { Icon, IconProps } from '@components/icon'
import { cn } from '@utils/cn'

export interface ActionData {
  to?: string
  title: string
  onClick?: () => void
  isDanger?: boolean
}

export interface MoreActionsTooltipProps {
  actions: ActionData[]
  isInTable?: boolean
  iconName?: IconProps['name']
  sideOffset?: number
  alignOffset?: number
  className?: string
}

/**
 * A component for displaying a button that, when clicked, shows a tooltip with a list of actions.
 */
export const MoreActionsTooltip: FC<MoreActionsTooltipProps> = ({
  actions,
  isInTable = false,
  iconName = 'vertical-ellipsis',
  sideOffset = -6,
  alignOffset = 10,
  className
}) => {
  const { Link } = useRouterContext()
  if (!actions.length) return <></>

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          className={cn('text-icons-1 hover:text-icons-2 data-[state=open]:text-icons-2', {
            '-mr-2.5 -my-0.5': isInTable
          })}
          variant="ghost"
          iconOnly
          size="sm"
        >
          <Icon name={iconName} size={12} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className={cn('w-[180px]', className)}
        align="end"
        sideOffset={sideOffset}
        alignOffset={alignOffset}
      >
        <DropdownMenu.Group>
          {actions.map((action, idx) =>
            action.to ? (
              <Link
                key={`${action.title}-${idx}`}
                to={action.to}
                onClick={e => {
                  e.stopPropagation()
                }}
              >
                <DropdownMenu.Item>
                  <span className={cn('truncate text-sm', { 'text-cn-foreground-danger': action.isDanger })}>
                    {action.title}
                  </span>
                </DropdownMenu.Item>
              </Link>
            ) : (
              <DropdownMenu.Item
                key={`${action.title}-${idx}`}
                onClick={e => {
                  e.stopPropagation()
                  action?.onClick?.()
                }}
              >
                <span className={cn('truncate text-sm', { 'text-cn-foreground-danger': action.isDanger })}>
                  {action.title}
                </span>
              </DropdownMenu.Item>
            )
          )}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
