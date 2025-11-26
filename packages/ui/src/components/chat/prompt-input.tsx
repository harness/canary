import { ChangeEvent, ComponentProps, HTMLAttributes, KeyboardEventHandler } from 'react'

import { Button } from '@components/button'
import { Textarea } from '@components/form-primitives'
import { IconV2 } from '@components/icon-v2'
import { cn } from '@utils/cn'

export type PromptInputRootProps = HTMLAttributes<HTMLFormElement>
export const PromptInputRoot = ({ className, ...props }: PromptInputRootProps) => (
  <form className={cn('cn-prompt-input w-full overflow-hidden', className)} {...props} />
)

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
  <div className={cn('flex items-center justify-between', className)} {...props} />
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
    <Button iconOnly type="submit" size="xs" {...props}>
      {children ?? Icon}
    </Button>
  )
}

export type PromptInputButtonProps = ComponentProps<typeof Button>
export const PromptInputButton = ({ variant = 'outline', ...props }: PromptInputButtonProps) => {
  return <Button iconOnly size="xs" type="button" variant={variant} {...props} />
}

export const PromptInput = {
  Root: PromptInputRoot,
  Textarea: PromptInputTextarea,
  Toolbar: PromptInputToolbar,
  Tools: PromptInputTools,
  Submit: PromptInputSubmit,
  Button: PromptInputButton
}
