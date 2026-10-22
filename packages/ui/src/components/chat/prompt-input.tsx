import { ChangeEvent, ComponentProps, HTMLAttributes, KeyboardEventHandler } from 'react'

import { Button } from '@components/button'
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
    // IME confirmation Enter (CJK) must not submit. keyCode 229 covers Safari.
    if (e.nativeEvent.isComposing || e.keyCode === 229) {
      return
    }
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

const SpeechMicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" aria-hidden className="size-3.5">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 1.75a2.25 2.25 0 0 0-2.25 2.25v3a2.25 2.25 0 1 0 4.5 0v-3A2.25 2.25 0 0 0 8 1.75Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.25 7.25a3.75 3.75 0 0 0 7.5 0M8 11v3.25M5.75 14.25h4.5"
    />
  </svg>
)

export type PromptInputSpeechProps = ComponentProps<typeof Button> & {
  listening?: boolean
}

export const PromptInputSpeech = ({
  listening = false,
  className,
  tooltipProps,
  disabled,
  children,
  ...props
}: PromptInputSpeechProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      rounded
      disabled={disabled}
      data-listening={listening ? 'true' : undefined}
      aria-pressed={listening}
      className={cn('cn-prompt-input-speech cn-button-icon-only', className)}
      tooltipProps={tooltipProps ?? { content: listening ? 'Stop listening' : 'Voice input' }}
      {...props}
    >
      {listening && (
        <>
          <span className="cn-prompt-input-speech-ring" aria-hidden />
          <span className="cn-prompt-input-speech-ring cn-prompt-input-speech-ring-delayed" aria-hidden />
        </>
      )}
      {children ?? <SpeechMicIcon />}
      <span className="sr-only">{listening ? 'Stop voice input' : 'Start voice input'}</span>
    </Button>
  )
}

export const PromptInput = {
  Root: PromptInputRoot,
  Tags: PromptInputTags,
  Textarea: PromptInputTextarea,
  Toolbar: PromptInputToolbar,
  Tools: PromptInputTools,
  Submit: PromptInputSubmit,
  Button: PromptInputButton,
  Speech: PromptInputSpeech
}
