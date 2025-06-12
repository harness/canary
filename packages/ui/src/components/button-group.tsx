import { FC, ReactNode } from 'react'

import { Button, ButtonProps, DropdownMenu, Tooltip, TooltipProps } from '@/components'
import { cn } from '@utils/cn'

type ButtonGroupTooltipProps = Pick<TooltipProps, 'title' | 'content' | 'side' | 'align'>

type BaseButtonProps = Omit<ButtonProps, 'variant' | 'size' | 'theme' | 'asChild' | 'iconOnly' | 'rounded' | 'type'>

type ButtonWithTooltip = BaseButtonProps & {
  tooltipProps: ButtonGroupTooltipProps
  dropdownContent?: undefined
}

type ButtonWithDropdown = BaseButtonProps & {
  dropdownContent: ReactNode
  tooltipProps?: undefined
}

export type ButtonGroupButtonProps = ButtonWithTooltip | ButtonWithDropdown

export interface ButtonGroupProps extends Pick<ButtonProps, 'size' | 'iconOnly'> {
  orientation?: 'horizontal' | 'vertical'
  buttonsProps: ButtonGroupButtonProps[]
  className?: string
}

interface WrapperProps {
  children: ReactNode
  tooltipProps?: ButtonGroupTooltipProps
  dropdownContent?: ReactNode
  orientation: 'horizontal' | 'vertical'
}

const Wrapper: FC<WrapperProps> = ({ children, tooltipProps, dropdownContent, orientation }) => {
  if (tooltipProps) {
    return (
      <Tooltip side={orientation === 'vertical' ? 'right' : 'top'} {...tooltipProps}>
        {children}
      </Tooltip>
    )
  }

  if (dropdownContent) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
        <DropdownMenu.Content side={orientation === 'vertical' ? 'right' : 'bottom'}>
          {dropdownContent}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    )
  }

  return <>{children}</>
}

export const ButtonGroup: FC<ButtonGroupProps> = ({
  orientation = 'horizontal',
  buttonsProps,
  size = 'default',
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
      {buttonsProps.map(({ tooltipProps, dropdownContent, className, ...restButtonProps }, index) => (
        <Wrapper key={index} tooltipProps={tooltipProps} dropdownContent={dropdownContent} orientation={orientation}>
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
      ))}
    </div>
  )
}
