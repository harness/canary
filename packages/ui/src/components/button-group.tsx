import { ComponentProps, FC, forwardRef, ReactNode, Ref } from 'react'

import { Button, ButtonProps, DropdownMenu, TooltipProps } from '@/components'
import { cn } from '@utils/cn'
import omit from 'lodash-es/omit'

type BaseButtonProps = Omit<ButtonProps, 'size' | 'theme' | 'asChild' | 'rounded' | 'type'>

type DropdownPropsType = {
  content: ReactNode
  contentProps?: ComponentProps<typeof DropdownMenu.Content>
}

export type ButtonGroupButtonProps = BaseButtonProps & {
  ref?: Ref<HTMLButtonElement>
  dropdownProps?: DropdownPropsType
}

export interface ButtonGroupProps extends Pick<ButtonProps, 'size'> {
  orientation?: 'horizontal' | 'vertical'
  buttonsProps: ButtonGroupButtonProps[]
  className?: string
  iconOnly?: boolean
}

interface WrapperProps {
  children: ReactNode
  dropdownProps?: DropdownPropsType
  orientation: 'horizontal' | 'vertical'
}

const Wrapper: FC<WrapperProps> = ({ children, dropdownProps, orientation }) => {
  if (dropdownProps) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
        <DropdownMenu.Content side={orientation === 'vertical' ? 'right' : 'bottom'} {...dropdownProps?.contentProps}>
          {dropdownProps.content}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    )
  }

  return <>{children}</>
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ orientation = 'horizontal', buttonsProps, size = 'md', iconOnly: iconOnlyProp, className }, ref) => {
    return (
      <div
        className={cn(
          'cn-button-group',
          orientation === 'vertical' ? 'cn-button-group-vertical' : 'cn-button-group-horizontal',
          className
        )}
        ref={ref}
      >
        {buttonsProps.map((buttonProps, index) => {
          const { className, variant, iconOnly: iconOnlyRest, ref: buttonRef, ...restButtonProps } = buttonProps
          const tooltipProps = 'tooltipProps' in buttonProps ? buttonProps.tooltipProps : undefined
          const dropdownProps = 'dropdownProps' in buttonProps ? buttonProps.dropdownProps : undefined
          const iconOnly = iconOnlyProp ?? iconOnlyRest ?? false
          const mergedTooltip = tooltipProps
            ? {
                ...tooltipProps,
                side: orientation === 'vertical' ? 'right' : ('top' as TooltipProps['side'])
              }
            : undefined

          return (
            <Wrapper key={index} dropdownProps={dropdownProps} orientation={orientation}>
              <Button
                ref={buttonRef}
                className={cn(
                  className,
                  { 'cn-button-group-first': !index },
                  { 'cn-button-group-last': index === buttonsProps.length - 1 }
                )}
                variant={variant ?? 'outline'}
                size={size}
                {...omit(restButtonProps, ['tooltipProps', 'dropdownProps'])}
                iconOnly={iconOnly}
                tooltipProps={mergedTooltip}
              />
            </Wrapper>
          )
        })}
      </div>
    )
  }
)
ButtonGroup.displayName = 'ButtonGroup'

export type { BaseButtonProps as ButtonGroupBaseButtonProps }
