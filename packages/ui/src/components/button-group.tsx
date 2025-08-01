import { ComponentProps, FC, ReactNode } from 'react'

import { Button, ButtonProps, DropdownMenu, Tooltip, TooltipProps } from '@/components'
import { cn } from '@utils/cn'

type ButtonGroupTooltipProps = Pick<TooltipProps, 'title' | 'content' | 'side' | 'align'>

type BaseButtonProps = Omit<ButtonProps, 'variant' | 'size' | 'theme' | 'asChild' | 'rounded' | 'type'>

type ButtonWithTooltip = BaseButtonProps & {
  tooltipProps: ButtonGroupTooltipProps
  dropdownProps?: undefined
}

type DropdownPropsType = {
  content: ReactNode
  contentProps?: ComponentProps<typeof DropdownMenu.Content>
}

type ButtonWithDropdown = BaseButtonProps & {
  dropdownProps: DropdownPropsType
  tooltipProps?: undefined
}

export type ButtonGroupButtonProps = ButtonWithTooltip | ButtonWithDropdown | BaseButtonProps

export interface ButtonGroupProps extends Pick<ButtonProps, 'size' | 'iconOnly'> {
  orientation?: 'horizontal' | 'vertical'
  buttonsProps: ButtonGroupButtonProps[]
  className?: string
}

interface WrapperProps {
  children: ReactNode
  tooltipProps?: ButtonGroupTooltipProps
  dropdownProps?: DropdownPropsType
  orientation: 'horizontal' | 'vertical'
}

const Wrapper: FC<WrapperProps> = ({ children, tooltipProps, dropdownProps, orientation }) => {
  if (tooltipProps) {
    return (
      <Tooltip side={orientation === 'vertical' ? 'right' : 'top'} {...tooltipProps}>
        {children}
      </Tooltip>
    )
  }

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

export const ButtonGroup: FC<ButtonGroupProps> = ({
  orientation = 'horizontal',
  buttonsProps,
  size = 'md',
  iconOnly,
  className
}) => {
  return (
    <div
      className={cn(
        'cn-button-group',
        orientation === 'vertical' ? 'cn-button-group-vertical' : 'cn-button-group-horizontal',
        className
      )}
    >
      {buttonsProps.map((buttonProps, index) => {
        const { className, ...restButtonProps } = buttonProps
        const tooltipProps = 'tooltipProps' in buttonProps ? buttonProps.tooltipProps : undefined
        const dropdownProps = 'dropdownProps' in buttonProps ? buttonProps.dropdownProps : undefined

        return (
          <Wrapper key={index} tooltipProps={tooltipProps} dropdownProps={dropdownProps} orientation={orientation}>
            <Button
              className={cn(
                className,
                { 'cn-button-group-first': !index },
                { 'cn-button-group-last': index === buttonsProps.length - 1 }
              )}
              variant="outline"
              size={size}
              iconOnly={iconOnly}
              {...restButtonProps}
            />
          </Wrapper>
        )
      })}
    </div>
  )
}
