import { HTMLAttributes } from 'react'

import { cn } from '@utils/cn'

export interface InputOrientationProp {
  orientation?: 'vertical' | 'horizontal'
}

interface BaseControlGroupProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'button' | 'input'
}

export interface ControlGroupProps extends BaseControlGroupProps, Partial<InputOrientationProp> {}

/**
 * A container component that groups form control elements together.
 * @example
 * <ControlGroup type="button">
 *   <Button>Button</Button>
 * </ControlGroup>
 */
const ControlGroupRoot = ({
  children,
  type = 'input',
  className,
  orientation = 'vertical',
  ...props
}: ControlGroupProps) => {
  const isInputType = type === 'input'

  return (
    <div
      className={cn(
        'cn-control-group',
        isInputType && orientation === 'horizontal' && 'cn-control-group-horizontal',
        className
      )}
      role="group"
      aria-label={isInputType ? 'Input control group' : 'Button control group'}
      {...props}
    >
      {children}
    </div>
  )
}
ControlGroupRoot.displayName = 'ControlGroupRoot'

const ControlGroupLabelWrapper = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('cn-control-group-label', className)} {...props}>
      {children}
    </div>
  )
}
ControlGroupLabelWrapper.displayName = 'ControlGroupLabelWrapper'

const ControlGroupInputWrapper = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('cn-control-group-input', className)} {...props}>
      {children}
    </div>
  )
}
ControlGroupInputWrapper.displayName = 'ControlGroupInputWrapper'

export const ControlGroup = Object.assign((props: ControlGroupProps) => <ControlGroupRoot {...props} />, {
  Root: ControlGroupRoot,
  LabelWrapper: ControlGroupLabelWrapper,
  InputWrapper: ControlGroupInputWrapper
})
