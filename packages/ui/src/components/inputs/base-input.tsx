import {
  cloneElement,
  forwardRef,
  InputHTMLAttributes,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
  useRef
} from 'react'

import { cn, useMergeRefs } from '@/utils'
import { Text } from '@components/text'
import { cva, type VariantProps } from 'class-variance-authority'

function InputAffix({
  children,
  isPrefix = false,
  className
}: PropsWithChildren<{ isPrefix?: boolean; className?: string }>) {
  if (!children) return null
  return (
    <span className={cn('cn-input-affix', isPrefix ? 'cn-input-prefix' : 'cn-input-suffix', className)}>
      {children}
    </span>
  )
}

export interface BaseInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'>,
    VariantProps<typeof inputVariants> {}

export const inputVariants = cva('cn-input-container', {
  variants: {
    size: {
      md: '',
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
    size: 'md'
  }
})

export interface InputProps extends BaseInputProps {
  label?: string
  theme?: VariantProps<typeof inputVariants>['theme']
  className?: string
  inputContainerClassName?: string
  prefix?: ReactNode
  prefixClassName?: string
  suffix?: ReactNode
  suffixClassName?: string
  leadingSuffix?: ReactNode
}

const BaseInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      theme,
      size,
      className,
      inputContainerClassName,
      prefix = null,
      suffix = null,
      leadingSuffix,
      autoFocus,
      prefixClassName,
      suffixClassName,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    const mergedRef = useMergeRefs<HTMLInputElement>([
      node => {
        if (!node) return

        inputRef.current = node
      },
      ref
    ])

    useEffect(() => {
      if (autoFocus && inputRef.current) {
        const t = setTimeout(() => inputRef.current?.focus(), 0)

        return () => clearTimeout(t)
      }
    }, [autoFocus])

    // Check if prefix/suffix/leadingSuffix is a valid React element
    const isPrefixComponent = isValidElement(prefix)
    const isSuffixComponent = isValidElement(suffix)
    const isLeadingSuffixComponent = isValidElement(leadingSuffix)

    // Create wrapped versions with classes if they are components
    const wrappedPrefix = isPrefixComponent ? (
      cloneElement(prefix as ReactElement, {
        className: cn('cn-input-prefix', (prefix as ReactElement).props?.className)
      })
    ) : (
      <InputAffix isPrefix className={prefixClassName}>
        {prefix}
      </InputAffix>
    )

    const wrappedLeadingSuffix = isLeadingSuffixComponent ? (
      cloneElement(leadingSuffix as ReactElement, {
        className: cn('mr-cn-2xs whitespace-nowrap', (leadingSuffix as ReactElement).props?.className)
      })
    ) : leadingSuffix ? (
      <Text variant="caption-strong" color="foreground-3" wrap="nowrap" className="mr-cn-2xs">
        {leadingSuffix}
      </Text>
    ) : null

    const wrappedSuffix = isSuffixComponent ? (
      cloneElement(suffix as ReactElement, {
        className: cn('cn-input-suffix', (suffix as ReactElement).props?.className)
      })
    ) : (
      <InputAffix className={suffixClassName}>{suffix}</InputAffix>
    )

    return (
      <div className={cn(inputVariants({ size, theme }), inputContainerClassName)}>
        {wrappedPrefix}
        <input className={cn('cn-input-input', className)} ref={mergedRef} {...props} />
        {wrappedLeadingSuffix}
        {wrappedSuffix}
      </div>
    )
  }
)

BaseInput.displayName = 'BaseInput'

export { BaseInput }
