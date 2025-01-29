import { forwardRef, Fragment, InputHTMLAttributes, ReactNode } from 'react'

import { Caption, ControlGroup, Icon, IconProps, Label, Message, MessageTheme } from '@/components'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

export interface BaseInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const inputVariants = cva(
  'bg-transparent px-3 py-1 text-foreground-1 disabled:cursor-not-allowed disabled:text-foreground-4',
  {
    variants: {
      variant: {
        default:
          'flex w-full rounded border text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground-4 focus-visible:rounded focus-visible:outline-none',
        extended: 'grow border-none focus-visible:outline-none'
      },
      size: {
        sm: 'h-8',
        md: 'h-9'
      },
      theme: {
        default:
          'border-borders-2 focus-visible:border-borders-3 disabled:border-borders-1 disabled:placeholder:text-foreground-9',
        danger: 'border-borders-danger'
      }
    },
    defaultVariants: {
      variant: 'default',
      theme: 'default',
      size: 'sm'
    }
  }
)

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, type, variant, size, theme, ...props }, ref) => {
    return <input className={cn(inputVariants({ variant, size, theme }), className)} type={type} ref={ref} {...props} />
  }
)

BaseInput.displayName = 'BaseInput'

interface InputProps extends BaseInputProps {
  label?: string
  caption?: ReactNode
  error?: string
  optional?: boolean
  className?: string
  wrapperClassName?: string
  inputIconName?: IconProps['name']
  rightElement?: React.ReactNode
  rightElementVariant?: 'default' | 'filled'
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
      id,
      theme,
      disabled,
      optional,
      className,
      wrapperClassName,
      inputIconName,
      rightElement,
      rightElementVariant,
      ...props
    },
    ref
  ) => {
    const isControlGroup = !!error || !!caption || !!label || !!wrapperClassName
    const InputWrapper = isControlGroup ? ControlGroup : Fragment
    const inputWrapperProps = isControlGroup
      ? {
          className: wrapperClassName
        }
      : {}

    const baseInputComp = (
      <BaseInput
        className={cn(className, {
          'pl-8': inputIconName
        })}
        id={id}
        ref={ref}
        theme={error ? 'danger' : theme}
        disabled={disabled}
        {...props}
      />
    )

    const renderInput = () => {
      if (rightElement) {
        return (
          <div
            className={cn(
              'flex items-center text-muted-foreground rounded border',
              rightElementVariant === 'filled' ? 'bg-muted border-l' : '',
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

    // disabled - dark
    return (
      <InputWrapper {...inputWrapperProps}>
        {label && (
          <Label className="mb-2.5" color="secondary" optional={optional} htmlFor={id}>
            {label}
          </Label>
        )}
        {renderInput()}
        {error && (
          <Message className={cn(caption ? 'mt-1' : 'absolute top-full translate-y-0.5')} theme={MessageTheme.ERROR}>
            {error}
          </Message>
        )}
        {caption && <Caption>{caption}</Caption>}
      </InputWrapper>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }
