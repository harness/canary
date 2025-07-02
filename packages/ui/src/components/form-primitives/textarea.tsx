import { ChangeEvent, forwardRef, TextareaHTMLAttributes, useCallback, useMemo, useState } from 'react'

import { CommonInputsProp, ControlGroup, FormCaption, Label } from '@/components'
import { cn, generateAlphaNumericHash, isAnyTypeOf, useMergeRefs } from '@/utils'
import { cva, VariantProps } from 'class-variance-authority'

const textareaVariants = cva('cn-textarea', {
  variants: {
    theme: {
      default: '',
      danger: 'cn-textarea-danger',
      warning: 'cn-textarea-warning'
    },
    size: {
      md: '',
      sm: 'cn-textarea-sm'
    }
  },
  defaultVariants: {
    theme: 'default',
    size: 'md'
  }
})

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, CommonInputsProp {
  theme?: VariantProps<typeof textareaVariants>['theme']
  size?: VariantProps<typeof textareaVariants>['size']
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
      id: defaultId,
      label,
      error,
      warning,
      caption,
      optional,
      disabled,
      onChange,
      className,
      maxCharacters,
      resizable = false,
      labelSuffix,
      size,
      orientation,
      informerProps,
      informerContent,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const [counter, setCounter] = useState(0)

    const isHorizontal = orientation === 'horizontal'

    const theme = error ? 'danger' : warning ? 'warning' : props.theme

    const id = useMemo(() => defaultId || `textarea-${generateAlphaNumericHash(10)}`, [defaultId])

    const setCharactersCount = useCallback(
      (value: string) => {
        if (maxCharacters === undefined) return

        setCounter(value.length)
      },
      [maxCharacters]
    )

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setCharactersCount(e.target.value)
      onChange?.(e)
    }

    const mergedRef = useMergeRefs<HTMLTextAreaElement>([
      node => {
        if (!node) return

        if (isAnyTypeOf(node.value, ['number', 'string'])) {
          setCharactersCount(String(node.value))
        }
      },
      ref
    ])

    return (
      <ControlGroup.Root className={wrapperClassName} orientation={orientation}>
        {(!!label || maxCharacters || (isHorizontal && !!caption)) && (
          <ControlGroup.LabelWrapper>
            <div className="cn-textarea-label-wrapper">
              {!!label && (
                <Label
                  disabled={disabled}
                  optional={optional}
                  htmlFor={id}
                  suffix={labelSuffix}
                  informerProps={informerProps}
                  informerContent={informerContent}
                >
                  {label}
                </Label>
              )}

              {!!maxCharacters && !isHorizontal && (
                <span className={cn('cn-textarea-counter', { 'cn-textarea-counter-disabled': disabled })} role="status">
                  {counter} / {maxCharacters}
                </span>
              )}
            </div>
            {isHorizontal && !!caption && <FormCaption disabled={disabled}>{caption}</FormCaption>}
          </ControlGroup.LabelWrapper>
        )}

        <ControlGroup.InputWrapper>
          {!!maxCharacters && isHorizontal && (
            <span className={cn('cn-textarea-counter', { 'cn-textarea-counter-disabled': disabled })} role="status">
              {counter} / {maxCharacters}
            </span>
          )}
          <textarea
            id={id}
            ref={mergedRef}
            className={cn(textareaVariants({ theme, size }), { 'cn-textarea-resizable': resizable }, className)}
            disabled={disabled}
            onChange={handleChange}
            {...props}
          />

          {error ? (
            <FormCaption disabled={disabled} theme="danger">
              {error}
            </FormCaption>
          ) : warning ? (
            <FormCaption disabled={disabled} theme="warning">
              {warning}
            </FormCaption>
          ) : caption && !isHorizontal ? (
            <FormCaption disabled={disabled}>{caption}</FormCaption>
          ) : null}
        </ControlGroup.InputWrapper>
      </ControlGroup.Root>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
