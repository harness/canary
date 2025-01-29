import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@components/button'
import { DropdownMenu } from '@components/dropdown-menu'
import { Icon } from '@components/icon'
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
}

/**
 * A component for displaying a button that, when clicked, shows a tooltip with a list of actions.
 */
export const MoreActionsTooltip: FC<MoreActionsTooltipProps> = ({ actions, isInTable = false }) => {
  if (!actions.length) return <></>

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          className={cn('text-icons-1 hover:text-icons-2 data-[state=open]:text-icons-2', {
            '-mr-2.5 -my-0.5': isInTable
          })}
          variant="custom"
          size="icon"
        >
          <Icon name="vertical-ellipsis" size={14} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="w-[180px]"
        align="end"
        sideOffset={-6}
        alignOffset={10}
        onCloseAutoFocus={event => event.preventDefault()} // Prevent focus on hidden content
      >
        <DropdownMenu.Group>
          {actions.map((action, idx) =>
            action.to ? (
              <Link key={`${action.title}-${idx}`} to={action.to}>
                <DropdownMenu.Item>
                  <span className={cn('truncate text-sm', { 'text-foreground-danger': action.isDanger })}>
                    {action.title}
                  </span>
                </DropdownMenu.Item>
              </Link>
            ) : (
              <DropdownMenu.Item key={`${action.title}-${idx}`} onClick={() => action?.onClick?.()}>
                <span className={cn('truncate text-sm', { 'text-foreground-danger': action.isDanger })}>
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
