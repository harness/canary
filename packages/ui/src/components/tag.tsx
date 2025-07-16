import { forwardRef, Ref, useImperativeHandle, useRef } from 'react'

import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Button } from './button'
import { IconV2, IconV2NamesType } from './icon-v2'

const tagVariants = cva('cn-tag', {
  variants: {
    variant: {
      outline: 'cn-tag-outline',
      secondary: 'cn-tag-secondary'
    },
    size: {
      md: '',
      sm: 'cn-tag-sm'
    },
    theme: {
      gray: 'cn-tag-gray',
      blue: 'cn-tag-blue',
      brown: 'cn-tag-brown',
      cyan: 'cn-tag-cyan',
      green: 'cn-tag-green',
      indigo: 'cn-tag-indigo',
      lime: 'cn-tag-lime',
      mint: 'cn-tag-mint',
      orange: 'cn-tag-orange',
      pink: 'cn-tag-pink',
      purple: 'cn-tag-purple',
      red: 'cn-tag-red',
      violet: 'cn-tag-violet',
      yellow: 'cn-tag-yellow'
    },
    rounded: {
      true: 'cn-tag-rounded'
    }
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
    theme: 'gray'
  }
})

type TagProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'role' | 'tabIndex'> & {
  variant?: VariantProps<typeof tagVariants>['variant']
  size?: VariantProps<typeof tagVariants>['size']
  theme?: VariantProps<typeof tagVariants>['theme']
  rounded?: boolean
  icon?: IconV2NamesType
  label?: string
  value: string
  disabled?: boolean
}

type TagRef = {
  reset: () => void
  readonly right: HTMLDivElement | null
}

type TagSplitRef = {
  reset: () => void
  readonly left: HTMLDivElement | null
  readonly right: HTMLDivElement | null
}

const Tag = forwardRef<TagRef | TagSplitRef | HTMLDivElement, TagProps>(
  ({ variant, size, theme, rounded, icon, onReset, label, value, className, disabled = false, ...props }, ref) => {
    const resetRef = useRef<HTMLButtonElement>(null)
    const rightRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (resetRef.current) {
          resetRef.current.click()
        }
      },
      get right() {
        return rightRef.current
      }
    }))

    if (label && value) {
      return (
        <TagSplit
          {...{
            variant,
            size,
            theme,
            rounded,
            icon,
            showIcon,
            showReset,
            onReset,
            label: label,
            value,
            disabled,
            ref: ref as Ref<TagSplitRef>
          }}
        />
      )
    }

    return (
      <div
        ref={rightRef}
        tabIndex={-1}
        className={cn(
          tagVariants({ variant, size, theme, rounded }),
          { 'text-cn-foreground-disabled cursor-not-allowed': disabled },
          className
        )}
        {...props}
      >
        {icon && (
          <IconV2
            skipSize
            name={icon || 'label'}
            className={cn('cn-tag-icon', { 'text-cn-foreground-disabled': disabled })}
          />
        )}
        <span className={cn('cn-tag-text', { 'text-cn-foreground-disabled': disabled })} title={value || label}>
          {value || label}
        </span>
        {showReset && !disabled && (
          <button onClick={onReset} ref={resetRef}>
            <IconV2 skipSize name="xmark" className="cn-tag-reset-icon" />
          </button>
        )}
      </div>
    )
  }
)
Tag.displayName = 'Tag'

const TagSplit = forwardRef<TagSplitRef, TagProps>(
  ({ variant, size, theme, rounded, icon, showIcon, showReset, value, label = '', onReset, disabled = false }, ref) => {
    const sharedProps = { variant, size, theme, rounded, icon, disabled }

    const resetRef = useRef<HTMLButtonElement>(null)
    const leftRef = useRef<HTMLDivElement>(null)
    const rightRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (resetRef.current) {
          resetRef.current.click()
        }
      },
      get left() {
        return leftRef.current
      },
      get right() {
        return rightRef.current
      }
    }))

    return (
      <div className={cn('cn-tag-split flex w-fit items-center justify-center', { 'cursor-not-allowed': disabled })}>
        {/* LEFT TAG - should never have a Reset Icon */}
        <Tag {...sharedProps} ref={leftRef} icon={showIcon} value={label} className="cn-tag-split-left" />

        {/* RIGHT TAG - should never have a tag Icon */}
        <Tag
          {...sharedProps}
          ref={ref}
          showReset={showReset}
          onReset={onReset}
          value={value}
          className="cn-tag-split-right"
        />
      </div>
    )
  }
)
TagSplit.displayName = 'TagSplit'

export { Tag, type TagProps }
