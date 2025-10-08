import { forwardRef } from 'react'

import { useRouterContext } from '@/context'
import { Button, ButtonProps, ButtonSizes, ButtonVariants } from '@components/button'
import { DropdownMenu } from '@components/dropdown-menu'
import { IconV2, type IconPropsV2 } from '@components/icon-v2'
import { Tooltip, TooltipProps } from '@components/tooltip'
import { cn } from '@utils/cn'

import { Text } from './text'

export interface ActionData {
  iconName?: IconPropsV2['name']
  to?: string
  title: string
  onClick?: () => void
  isDanger?: boolean
  disabled?: boolean
  tooltip?: Pick<TooltipProps, 'title' | 'content'>
}

export interface MoreActionsTooltipProps {
  theme?: ButtonProps['theme']
  actions: ActionData[]
  isInTable?: boolean
  iconName?: IconPropsV2['name']
  sideOffset?: number
  alignOffset?: number
  className?: string
  buttonVariant?: ButtonVariants
  buttonSize?: ButtonSizes
  disabled?: boolean
}

/**
 * A component for displaying a button that, when clicked, shows a tooltip with a list of actions.
 */
export const MoreActionsTooltip = forwardRef<HTMLButtonElement, MoreActionsTooltipProps>(
  (
    {
      theme,
      actions,
      iconName = 'more-vert',
      sideOffset = 2,
      alignOffset = 0,
      className,
      buttonVariant = 'ghost',
      buttonSize = 'md',
      disabled = false
    },
    ref
  ) => {
    const { Link } = useRouterContext()
    if (!actions.length) return <></>

    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger ref={ref} disabled={disabled} asChild>
          <Button
            theme={theme}
            className={cn('text-icons-1 hover:text-icons-2 data-[state=open]:text-icons-2')}
            variant={buttonVariant}
            iconOnly
            size={buttonSize}
            aria-label="Show more actions"
            tooltipProps={{
              content: 'Show more actions'
            }}
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
          {actions.map((action, idx) => {
            const actionItem = action.to ? (
              <Link
                key={`${action.title}-${idx}`}
                to={action.to}
                onClick={e => {
                  e.stopPropagation()
                }}
                style={{ pointerEvents: action.disabled ? 'none' : undefined }}
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
                    disabled={action.disabled}
                  />
                ) : (
                  <DropdownMenu.Item
                    title={
                      <Text color={action.isDanger ? 'danger' : 'foreground-2'} truncate>
                        {action.title}
                      </Text>
                    }
                    disabled={action.disabled}
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
                disabled={action.disabled}
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
                disabled={action.disabled}
              />
            )

            return action.tooltip ? <Tooltip {...action.tooltip}>{actionItem}</Tooltip> : actionItem
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    )
  }
)
MoreActionsTooltip.displayName = 'MoreActionsTooltip'
