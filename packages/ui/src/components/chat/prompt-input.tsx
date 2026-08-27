import { ChangeEvent, ComponentProps, HTMLAttributes, KeyboardEventHandler } from 'react'

import { Button, ButtonTooltipProps } from '@components/button'
import { Textarea } from '@components/form-primitives'
import { IconV2, IconV2NamesType } from '@components/icon-v2'
import { Tag } from '@components/tag'
import { Toggle, type ToggleProps } from '@components/toggle'
import { cn } from '@utils/cn'

export type PromptInputRootProps = HTMLAttributes<HTMLFormElement>
export const PromptInputRoot = ({ className, ...props }: PromptInputRootProps) => (
  <form className={cn('cn-prompt-input w-full overflow-hidden', className)} {...props} />
)

export interface PromptInputTag {
  id: string
  displayName: string
  icon?: IconV2NamesType
}

export type PromptInputTagsProps = HTMLAttributes<HTMLDivElement> & {
  tags: PromptInputTag[]
  onRemove?: (id: string) => void
}

export const PromptInputTags = ({ tags, onRemove, className, ...props }: PromptInputTagsProps) => {
  if (!tags.length) return null

  return (
    <div className={cn('flex shrink-0 flex-wrap gap-cn-xs', className)} {...props}>
      {tags.map(tag => (
        <Tag
          key={tag.id}
          value={tag.displayName}
          icon={tag.icon}
          variant="secondary"
          actionIcon="xmark"
          onActionClick={() => onRemove?.(tag.id)}
        />
      ))}
    </div>
  )
}

export type PromptInputTextareaProps = ComponentProps<typeof Textarea>

export const PromptInputTextarea = ({
  onChange,
  className,
  placeholder = 'What would you like to know?',
  ...props
}: PromptInputTextareaProps) => {
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = e => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow newline
        return
      }
      // Submit on Enter (without Shift)
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) {
        form.requestSubmit()
      }
    }
  }
  return (
    <Textarea
      name="message"
      autoResize={true}
      wrapperClassName="min-h-0 flex-1 overflow-hidden"
      className={className}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e)
      }}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      {...props}
    />
  )
}

export type PromptInputToolbarProps = HTMLAttributes<HTMLDivElement>

export const PromptInputToolbar = ({ className, ...props }: PromptInputToolbarProps) => (
  <div className={cn('flex shrink-0 items-center justify-between', className)} {...props} />
)

export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>
export const PromptInputTools = ({ className, ...props }: PromptInputToolsProps) => (
  <div className={cn('flex items-center gap-cn-xs', className)} {...props} />
)

export type PromptInputSubmitProps = Omit<
  ComponentProps<typeof Button>,
  'iconOnly' | 'tooltipProps' | 'ignoreIconOnlyTooltip' | 'aria-label' | 'aria-labelledby'
> & {
  status?: 'streaming'
  tooltipProps?: ButtonTooltipProps
  ignoreIconOnlyTooltip?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
}

export const PromptInputSubmit = ({
  status,
  children,
  tooltipProps,
  ignoreIconOnlyTooltip,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: PromptInputSubmitProps) => {
  let Icon = <IconV2 name="arrow-up" />
  const accessibleLabel = ariaLabel ?? (status === 'streaming' ? 'Stop response' : 'Send message')

  if (status === 'streaming') {
    Icon = <IconV2 name="stop-solid" />
  }

  if (ignoreIconOnlyTooltip) {
    return (
      <Button
        iconOnly
        rounded
        type="submit"
        size="xs"
        aria-label={accessibleLabel}
        aria-labelledby={ariaLabelledBy}
        ignoreIconOnlyTooltip
        {...props}
      >
        {children ?? Icon}
      </Button>
    )
  }

  return (
    <Button
      iconOnly
      rounded
      type="submit"
      size="xs"
      aria-label={accessibleLabel}
      aria-labelledby={ariaLabelledBy}
      tooltipProps={tooltipProps ?? { content: accessibleLabel }}
      {...props}
    >
      {children ?? Icon}
    </Button>
  )
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

export type PromptInputButtonProps = DistributiveOmit<Extract<ToggleProps, { iconOnly: true }>, 'iconOnly'>
export const PromptInputButton = ({ variant = 'outline', size = 'xs', ...props }: PromptInputButtonProps) => {
  return (
    <Toggle
      {...({
        ...props,
        variant,
        size,
        iconOnly: true
      } as ToggleProps)}
    />
  )
}

export const PromptInput = {
  Root: PromptInputRoot,
  Tags: PromptInputTags,
  Textarea: PromptInputTextarea,
  Toolbar: PromptInputToolbar,
  Tools: PromptInputTools,
  Submit: PromptInputSubmit,
  Button: PromptInputButton
}
