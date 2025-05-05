import { forwardRef, TextareaHTMLAttributes, useCallback, useEffect, useState } from 'react'

import { ControlGroup, FormCaption, Label } from '@/components'
import { anyTypeOf } from '@/utils'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

const textareaVariants = cva('cn-textarea', {
  variants: {
    theme: {
      default: '',
      danger: 'cn-textarea-danger'
    }
  },
  defaultVariants: {
    theme: 'default'
  }
})

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  theme?: VariantProps<typeof textareaVariants>['theme']
  caption?: string
  error?: string
  optional?: boolean
  resizable?: boolean
  maxCharacters?: number
}

/**
 * A forward-ref Textarea component with support for labels, captions, and error messages.
 * @example
 * <Textarea name="textarea" label="Textarea" placeholder="Enter text here" />
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { id, disabled, label, theme, caption, error, optional, className, maxCharacters, resizable = false, ...props },
    ref
  ) => {
    const [counter, setCounter] = useState(0)

    const setCharactersCount = useCallback((value: string) => setCounter(value.length), [])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharactersCount(e.target.value)
      props?.onChange?.(e)
    }

    // Set initial count
    useEffect(() => {
      if (anyTypeOf(props.defaultValue, ['number', 'string'])) {
        setCharactersCount(String(props.defaultValue))
      }

      if (anyTypeOf(props.value, ['number', 'string'])) {
        setCharactersCount(String(props.value))
      }
    }, [props.defaultValue, props.value, setCharactersCount])

    return (
      <ControlGroup>
        <div className="cn-textarea-label-wrapper">
          {label && (
            <Label disabled={disabled} optional={optional} htmlFor={id}>
              {label}
            </Label>
          )}

          {maxCharacters && (
            <span
              className={cn('cn-textarea-counter', {
                'cn-textarea-counter-danger': theme === 'danger',
                'cn-textarea-counter-disabled': disabled
              })}
              role="status"
            >
              {counter} / {maxCharacters}
            </span>
          )}
        </div>

        <textarea
          id={id}
          ref={ref}
          className={cn('cn-scrollbar', textareaVariants({ theme }), { 'resize-y': resizable }, className)}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />

        {(disabled || caption) && <FormCaption disabled={disabled}>{caption}</FormCaption>}

        {!disabled && error && <FormCaption theme="danger">{error}</FormCaption>}
      </ControlGroup>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
