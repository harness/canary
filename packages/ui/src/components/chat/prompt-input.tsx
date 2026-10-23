import { ChangeEvent, ComponentProps, HTMLAttributes, KeyboardEventHandler } from 'react'

import { Button } from '@components/button'
import { Textarea } from '@components/form-primitives'
import { IconV2, IconV2NamesType } from '@components/icon-v2'
import { Tag } from '@components/tag'
import { Toggle, type ToggleProps } from '@components/toggle'
import { cn } from '@utils/cn'

import { shouldBlockEnterForIme, useImeCompositionSession } from './ime-keyboard'

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
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  className,
  placeholder = 'What would you like to know?',
  ...props
}: PromptInputTextareaProps) => {
  const {
    composingRef,
    onCompositionStart: trackCompositionStart,
    onCompositionEnd: trackCompositionEnd
  } = useImeCompositionSession()

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = e => {
    onKeyDown?.(e)
    if (e.defaultPrevented) return

    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return
      }
      if (shouldBlockEnterForIme(e, composingRef.current)) {
        return
      }
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
      onCompositionStart={e => {
        trackCompositionStart(e)
        onCompositionStart?.(e)
      }}
      onCompositionEnd={e => {
        trackCompositionEnd(e)
        onCompositionEnd?.(e)
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

export type PromptInputSubmitProps = ComponentProps<typeof Button> & {
  status?: 'streaming'
}

export const PromptInputSubmit = ({ status, children, ...props }: PromptInputSubmitProps) => {
  let Icon = <IconV2 name="arrow-up" />

  if (status === 'streaming') {
    Icon = <IconV2 name="stop-solid" />
  }
  return (
    <Button rounded iconOnly type="submit" size="xs" {...props}>
      {children ?? Icon}
    </Button>
  )
}

export type PromptInputButtonProps = ToggleProps
export const PromptInputButton = ({ variant = 'outline', size = 'xs', ...props }: PromptInputButtonProps) => {
  return <Toggle {...props} variant={variant} size={size} iconOnly />
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
