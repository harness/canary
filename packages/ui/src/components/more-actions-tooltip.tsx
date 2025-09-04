import { FC } from 'react'

import { useRouterContext } from '@/context'
import { Button, ButtonVariants } from '@components/button'
import { DropdownMenu } from '@components/dropdown-menu'
import { IconV2, type IconPropsV2 } from '@components/icon-v2'
import { cn } from '@utils/cn'

import { Text } from './text'

export interface ActionData {
  iconName?: IconPropsV2['name']
  to?: string
  title: string
  onClick?: () => void
  isDanger?: boolean
}

export interface MoreActionsTooltipProps {
  actions: ActionData[]
  isInTable?: boolean
  iconName?: IconPropsV2['name']
  sideOffset?: number
  alignOffset?: number
  className?: string
  buttonVariant?: ButtonVariants
}

/**
 * A component for displaying a button that, when clicked, shows a tooltip with a list of actions.
 */
export const MoreActionsTooltip: FC<MoreActionsTooltipProps> = ({
  actions,
  iconName = 'more-vert',
  sideOffset = 2,
  alignOffset = 0,
  className,
  buttonVariant = 'ghost'
}) => {
  const { Link } = useRouterContext()
  if (!actions.length) return <></>

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          className={cn('text-icons-1 hover:text-icons-2 data-[state=open]:text-icons-2')}
          variant={buttonVariant}
          iconOnly
          size="md"
          aria-label="Show more actions"
          ignoreIconOnlyTooltip
        >
          <IconV2 name={iconName} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className={cn('min-w-[208px]', className)}
        align="end"
        sideOffset={sideOffset}
        alignOffset={alignOffset}
      >
        {actions.map((action, idx) =>
          action.to ? (
            <Link
              key={`${action.title}-${idx}`}
              to={action.to}
              onClick={e => {
                e.stopPropagation()
              }}
            >
              {action.iconName ? (
                <DropdownMenu.IconItem
                  icon={action.iconName}
                  iconClassName={cn({ 'text-cn-danger': action.isDanger })}
                  title={
                    <Text color={action.isDanger ? 'danger' : 'foreground-2'} truncate>
                      {action.title}
                    </Text>
                  }
                />
              ) : (
                <DropdownMenu.Item
                  title={
                    <Text color={action.isDanger ? 'danger' : 'foreground-2'} truncate>
                      {action.title}
                    </Text>
                  }
                />
              )}
            </Link>
          ) : action.iconName ? (
            <DropdownMenu.IconItem
              icon={action.iconName}
              title={
                <Text color={action.isDanger ? 'danger' : 'foreground-2'} truncate>
                  {action.title}
                </Text>
              }
              iconClassName={cn({ 'text-cn-danger': action.isDanger })}
              key={`${action.title}-${idx}`}
              onClick={e => {
                e.stopPropagation()
                action?.onClick?.()
              }}
            />
          ) : (
            <DropdownMenu.Item
              title={
                <Text color={action.isDanger ? 'danger' : 'foreground-2'} truncate>
                  {action.title}
                </Text>
              }
              key={`${action.title}-${idx}`}
              onClick={e => {
                e.stopPropagation()
                action?.onClick?.()
              }}
            />
          )
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
MoreActionsTooltip.displayName = 'MoreActionsTooltip'
