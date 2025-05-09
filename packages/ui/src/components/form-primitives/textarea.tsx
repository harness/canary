import { forwardRef, TextareaHTMLAttributes, useCallback, useState } from 'react'

import { ControlGroup, FormCaption, Label } from '@/components'
import { anyTypeOf, useMergeRefs } from '@/utils'
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
    {
      id,
      label,
      theme,
      error,
      caption,
      optional,
      disabled,
      onChange,
      className,
      maxCharacters,
      resizable = false,
      ...props
    },
    ref
  ) => {
    const [counter, setCounter] = useState(0)

    const setCharactersCount = useCallback(
      (value: string) => {
        if (maxCharacters === undefined) return

        setCounter(value.length)
      },
      [maxCharacters]
    )

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharactersCount(e.target.value)
      onChange?.(e)
    }

    const mergedRef = useMergeRefs<HTMLTextAreaElement>([
      node => {
        if (!node) return

        if (anyTypeOf(node.value, ['number', 'string'])) {
          setCharactersCount(String(node.value))
        }
      },
      ref
    ])

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
          ref={mergedRef}
          className={cn(textareaVariants({ theme }), { 'cn-textarea-resizable': resizable }, className)}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />

        {error ? (
          <FormCaption theme="danger" disabled={disabled}>
            {error}
          </FormCaption>
        ) : caption ? (
          <FormCaption disabled={disabled}>{caption}</FormCaption>
        ) : null}
      </ControlGroup>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
