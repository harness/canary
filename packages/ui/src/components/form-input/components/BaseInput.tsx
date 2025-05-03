import { cloneElement, forwardRef, InputHTMLAttributes, isValidElement, ReactElement, ReactNode } from 'react'

import { Icon, IconProps } from '@/components'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

export interface BaseInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'>,
    VariantProps<typeof inputVariants> {}

const inputVariants = cva('cn-input-container', {
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

// const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
//   ({ className, type, variant, size, theme, ...props }, ref) => {
//     return <input className={cn(inputVariants({ variant, size, theme }), className)} type={type} ref={ref} {...props} />
//   }
// )

// BaseInput.displayName = 'BaseInput'

export interface BaseInputWithWrapperProps extends BaseInputProps {
  children: ReactNode
}

/**
 * TODO: The component needs to be refined to cover all conditions.
 */
// const BaseInputWithWrapper = forwardRef<HTMLInputElement, BaseInputWithWrapperProps>(
//   ({ className, type, variant, size, theme, children, ...props }, ref) => {
//     return (
//       <div className={cn(inputVariants({ variant, size, theme }), 'p-0 flex items-center', className)}>
//         {children}
//         <input className="cn-input-input" type={type} ref={ref} {...props} />
//       </div>
//     )
//   }
// )

// BaseInputWithWrapper.displayName = 'BaseInputWithWrapper'

export interface InputProps extends BaseInputProps {
  label?: string
  caption?: string
  error?: string
  warningMessage?: string
  optional?: boolean
  className?: string
  wrapperClassName?: string
  inputIconName?: IconProps['name']
  prefix?: ReactNode
  suffix?: ReactNode
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
const BaseInput = forwardRef<HTMLInputElement, InputProps>(
  ({ theme, type, size, className, wrapperClassName, variant, prefix = null, suffix = null, ...props }, ref) => {
    // const InputComponent = customContent ? BaseInputWithWrapper : BaseInput
    // const InputComponent = BaseInputWithWrapper

    // const baseInputComp = (
    //   <InputComponent
    //     className={cn(className, {
    //       'pl-8': !!inputIconName,
    //       'border-none': !!rightElement
    //     })}
    //     id={id}
    //     ref={ref}
    //     theme={theme}
    //     disabled={disabled}
    //     {...props}
    //   >
    //     {customContent}
    //   </InputComponent>
    // )

    // Check if prefix/suffix is a valid React element
    const isPrefixComponent = isValidElement(prefix)
    const isSuffixComponent = isValidElement(suffix)

    // Create wrapped versions with classes if they are components
    const wrappedPrefix = isPrefixComponent
      ? cloneElement(prefix as ReactElement, {
          className: cn('h-full border-0 border-r rounded-r-none', (prefix as ReactElement).props?.className)
        })
      : prefix

    const wrappedSuffix = isSuffixComponent
      ? cloneElement(suffix as ReactElement, {
          className: cn('h-full border-0 border-l rounded-l-none', (suffix as ReactElement).props?.className)
        })
      : suffix

    return (
      <div className={cn(inputVariants({ variant, size, theme }), wrapperClassName)}>
        {wrappedPrefix}
        <input className={cn('cn-input-input', className)} type={type} ref={ref} {...props} />
        {wrappedSuffix}
      </div>
    )

    // return inputIconName ? (
    //   <span className="relative">
    //     <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-icons-9" name={inputIconName} size={14} />
    //     {baseInputComp}
    //   </span>
    // ) : (
    //   baseInputComp
    // )
  }
)

BaseInput.displayName = 'BaseInput'

export { BaseInput }
