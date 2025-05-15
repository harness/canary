import {
  cloneElement,
  forwardRef,
  InputHTMLAttributes,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode
} from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

function InputAffix({ children, isPrefix = false }: PropsWithChildren<{ isPrefix?: boolean }>) {
  if (!children) return null
  return <span className={cn('cn-input-affix', isPrefix ? 'cn-input-prefix' : 'cn-input-suffix')}>{children}</span>
}

export interface BaseInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'>,
    VariantProps<typeof inputVariants> {}

const inputVariants = cva('cn-input-container', {
  variants: {
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
    theme: 'default',
    size: 'default'
  }
})

export interface InputProps extends BaseInputProps {
  label?: string
  theme?: VariantProps<typeof inputVariants>['theme']
  className?: string
  inputContainerClassName?: string
  prefix?: ReactNode
  suffix?: ReactNode
}

const BaseInput = forwardRef<HTMLInputElement, InputProps>(
  ({ theme, size, className, inputContainerClassName, prefix = null, suffix = null, ...props }, ref) => {
    // Check if prefix/suffix is a valid React element
    const isPrefixComponent = isValidElement(prefix)
    const isSuffixComponent = isValidElement(suffix)

    // Create wrapped versions with classes if they are components
    const wrappedPrefix = isPrefixComponent ? (
      cloneElement(prefix as ReactElement, {
        className: cn('cn-input-prefix', (prefix as ReactElement).props?.className)
      })
    ) : (
      <InputAffix isPrefix>{prefix}</InputAffix>
    )

    const wrappedSuffix = isSuffixComponent ? (
      cloneElement(suffix as ReactElement, {
        className: cn('cn-input-suffix', (suffix as ReactElement).props?.className)
      })
    ) : (
      <InputAffix>{suffix}</InputAffix>
    )

    return (
      <div className={cn(inputVariants({ size, theme }), inputContainerClassName)}>
        {wrappedPrefix}
        <input className={cn('cn-input-input', className)} ref={ref} {...props} />
        {wrappedSuffix}
      </div>
    )
  }
)

BaseInput.displayName = 'BaseInput'

export { BaseInput }
