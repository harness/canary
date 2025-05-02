import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'

import { Caption, ControlGroup, Icon, IconProps, Label, Message, MessageTheme } from '@/components'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

export interface BaseInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const inputVariants = cva('cn-input', {
  variants: {
    variant: {
      // default:
      //   'flex w-full rounded border text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-cn-foreground-3 focus-visible:rounded focus-visible:outline-none',
      // extended: 'grow border-none focus-visible:outline-none'
    },
    size: {
      default: '',
      sm: 'cn-input-sm'
    },
    theme: {
      default: '',
      danger: 'cn-input-danger',
      warning: 'cn-input-warning',
      success: 'cn-input-success'
    }
  },
  defaultVariants: {
    variant: undefined,
    theme: 'default',
    size: 'default'
  }
})

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, type, variant, size, theme, ...props }, ref) => {
    return <input className={cn(inputVariants({ variant, size, theme }), className)} type={type} ref={ref} {...props} />
  }
)

BaseInput.displayName = 'BaseInput'

export interface BaseInputWithWrapperProps extends BaseInputProps {
  children: ReactNode
}

/**
 * TODO: The component needs to be refined to cover all conditions.
 */
const BaseInputWithWrapper = forwardRef<HTMLInputElement, BaseInputWithWrapperProps>(
  ({ className, type, variant, size, theme, children, ...props }, ref) => {
    return (
      <div className={cn(inputVariants({ variant, size, theme }), 'p-0 flex items-center', className)}>
        {children}
        <input
          className={cn(inputVariants({ variant: 'extended', size, theme }), 'px-0')}
          type={type}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

BaseInputWithWrapper.displayName = 'BaseInputWithWrapper'

export interface InputProps extends BaseInputProps {
  label?: string
  caption?: string
  error?: string
  warningMessage?: string
  optional?: boolean
  className?: string
  wrapperClassName?: string
  inputIconName?: IconProps['name']
  rightElement?: ReactNode
  rightElementVariant?: 'default' | 'filled'
  customContent?: ReactNode
  theme?: VariantProps<typeof inputVariants>['theme']
}

/**
 * A form input component with support for labels, captions, and error messages.
 * @example
 * <Input
 *   label="Email"
 *   id="email"
 *   type="email"
 *   placeholder="Enter your email"
 *   caption="We'll never share your email"
 *   error='Invalid email format'
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      caption,
      error,
      warningMessage,
      id,
      theme,
      disabled,
      optional,
      className,
      wrapperClassName,
      inputIconName,
      rightElement,
      rightElementVariant,
      customContent,
      ...props
    },
    ref
  ) => {
    const InputComponent = customContent ? BaseInputWithWrapper : BaseInput

    const baseInputComp = (
      <InputComponent
        className={cn(className, {
          'pl-8': !!inputIconName,
          'border-none': !!rightElement
        })}
        id={id}
        ref={ref}
        theme={error ? 'danger' : theme}
        disabled={disabled}
        {...props}
      >
        {customContent}
      </InputComponent>
    )

    const renderInput = () => {
      if (rightElement) {
        return (
          <div
            className={cn(
              'flex items-center text-cn-foreground-3 rounded border',
              rightElementVariant === 'filled' ? 'bg-cn-background-softgray border-l' : '',
              className
            )}
          >
            {baseInputComp}
            {rightElement}
          </div>
        )
      }

      return inputIconName ? (
        <span className="relative">
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-icons-9" name={inputIconName} size={14} />
          {baseInputComp}
        </span>
      ) : (
        baseInputComp
      )
    }

    return (
      <ControlGroup className={wrapperClassName}>
        {!!label && (
          <Label disabled={disabled} optional={optional} htmlFor={id}>
            {label}
          </Label>
        )}

        {renderInput()}

        {/* {!!error && (
          <Message className="mt-0.5" theme={MessageTheme.ERROR}>
            {error}
          </Message>
        )} */}

        <Caption theme={theme} message={caption} errorMessage={error} warningMessage={warningMessage} showIcon />
      </ControlGroup>
    )
  }
)

Input.displayName = 'Input'

export { Input }
