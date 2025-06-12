import { FC, ReactNode } from 'react'

import { Button, ButtonProps, ButtonSizes, ButtonVariants, Tooltip, TooltipProps } from '@/components'
import { cn } from '@utils/cn'

type ButtonGroupTooltipProps = Pick<TooltipProps, 'title' | 'content' | 'side' | 'align'>

type ButtonGroupButtonProps = Omit<ButtonProps, 'variant' | 'size' | 'theme' | 'asChild' | 'rounded' | 'type'> & {
  tooltipProps?: ButtonGroupTooltipProps
}

export interface ButtonGroupProps {
  orientation?: 'horizontal' | 'vertical'
  buttonsProps: ButtonGroupButtonProps[]
  variant?: ButtonVariants
  size?: ButtonSizes
}

const TooltipWrapper: FC<{ children: ReactNode; tooltipProps?: ButtonGroupTooltipProps }> = ({
  children,
  tooltipProps
}) => (tooltipProps ? <Tooltip {...tooltipProps}>{children}</Tooltip> : <>{children}</>)

const ButtonGroup: FC<ButtonGroupProps> = ({
  orientation = 'horizontal',
  buttonsProps,
  variant = 'outline',
  size = 'default'
}) => {
  return (
    <div
      className={cn(
        'cn-button-group',
        orientation === 'vertical' ? 'cn-button-group-vertical' : 'cn-button-group-horizontal'
      )}
    >
      {buttonsProps.map(({ tooltipProps, ...restButtonProps }, index) => (
        <TooltipWrapper key={index} tooltipProps={tooltipProps}>
          <Button {...restButtonProps} variant={variant} size={size} />
        </TooltipWrapper>
      ))}
    </div>
  )
}

export default ButtonGroup
