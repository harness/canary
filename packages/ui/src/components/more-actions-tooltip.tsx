import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@components/dropdown-menu'
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
}

/**
 * A component for displaying a button that, when clicked, shows a tooltip with a list of actions.
 */
export const MoreActionsTooltip: FC<MoreActionsTooltipProps> = ({ actions }) => {
  if (!actions.length) return <></>

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="text-icons-1 hover:text-icons-2 data-[state=open]:text-icons-2" variant="custom" size="icon">
          <Icon name="vertical-ellipsis" size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[180px]"
        align="end"
        sideOffset={-6}
        alignOffset={10}
        onCloseAutoFocus={event => event.preventDefault()} // Prevent focus on hidden content
      >
        <DropdownMenuGroup>
          {actions.map((action, idx) =>
            action.to ? (
              <Link key={`${action.title}-${idx}`} to={action.to} replace>
                <DropdownMenuItem>
                  <span className={cn('truncate text-sm', { 'text-foreground-danger': action.isDanger })}>
                    {action.title}
                  </span>
                </DropdownMenuItem>
              </Link>
            ) : (
              <DropdownMenuItem key={`${action.title}-${idx}`} onClick={() => action?.onClick?.()}>
                <span className={cn('truncate text-sm', { 'text-foreground-danger': action.isDanger })}>
                  {action.title}
                </span>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
