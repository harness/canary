import {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'

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
  autoResize?: boolean
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
      autoResize = false,
      labelSuffix,
      size,
      orientation,
      informerProps,
      informerContent,
      wrapperClassName,
      autoFocus,
      ...props
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [counter, setCounter] = useState(0)

    const isHorizontal = orientation === 'horizontal'

    const theme = error ? 'danger' : warning ? 'warning' : props.theme

    const id = useMemo(() => defaultId || `textarea-${generateAlphaNumericHash(10)}`, [defaultId])

    const supportsFieldSizing = useMemo(() => CSS.supports('field-sizing', 'content'), [])

    const autoResizeTextarea = useCallback(
      (textarea: HTMLTextAreaElement | null) => {
        if (!textarea || supportsFieldSizing || !autoResize) {
          // If field-sizing is supported, the CSS class will handle it
          return
        }

        // Fallback: programmatic height adjustment
        textarea.style.height = 'auto'
        const scrollHeight = textarea.scrollHeight
        textarea.style.height = scrollHeight + 'px'
      },
      [autoResize, supportsFieldSizing]
    )

    useLayoutEffect(() => {
      const textarea = textareaRef.current
      if (textarea && !supportsFieldSizing && autoResize) {
        setTimeout(() => {
          textarea.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          })
        }, 0)
      }
    }, [props.value, autoResizeTextarea, supportsFieldSizing, autoResize])

    // Auto-resize when value changes (for external updates, paste, undo, redo etc.)
    useEffect(() => {
      const textarea = textareaRef.current
      if (textarea && !supportsFieldSizing && autoResize) {
        autoResizeTextarea(textarea)
      }
    }, [props.value, autoResizeTextarea, supportsFieldSizing, autoResize])

    const setCharactersCount = useCallback(
      (value: string) => {
        if (maxCharacters === undefined) return

        setCounter(value.length)
      },
      [maxCharacters]
    )

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        autoResizeTextarea(textareaRef.current)
      }
      setCharactersCount(e.target.value)
      onChange?.(e)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && textareaRef.current) {
        const textarea = textareaRef.current
        const { selectionStart, selectionEnd, value } = textarea

        // Check if cursor is at the end of the text (bottom of textarea)
        if (selectionStart === selectionEnd && selectionStart === value.length) {
          // Use setTimeout to ensure the new line is added before scrolling
          setTimeout(() => {
            textarea.scrollTop = textarea.scrollHeight
          }, 0)
        }
      }

      props.onKeyDown?.(e)
    }

    const mergedRef = useMergeRefs<HTMLTextAreaElement>([
      node => {
        if (!node) return

        textareaRef.current = node

        if (isAnyTypeOf(node.value, ['number', 'string'])) {
          setCharactersCount(String(node.value))
        }
      },
      ref
    ])

    useEffect(() => {
      if (autoFocus && textareaRef.current) {
        const t = setTimeout(() => {
          textareaRef.current?.focus()
        }, 0)

        return () => clearTimeout(t)
      }
    }, [autoFocus])

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
            className={cn(
              textareaVariants({ theme, size }),
              { 'cn-textarea-resizable': resizable, 'field-sizing-content': supportsFieldSizing && autoResize },
              className
            )}
            disabled={disabled}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
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
