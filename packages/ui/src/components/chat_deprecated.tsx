import { ChangeEvent, KeyboardEvent, ReactNode, RefObject } from 'react'

import { Button, Icon, Input, Text } from '@/components'
import { cn } from '@/utils/cn'

// Root Container
const Root: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="flex size-full flex-col overflow-y-auto">{children}</div>
}

// Body
const Body: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="mb-3 flex flex-1 flex-col gap-6 p-6">{children}</div>
}

// Footer
const Footer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="sticky bottom-0 bg-cn-background p-6 pt-0">{children}</div>
}

// Message Component
interface MessageProps {
  self?: boolean
  time?: string
  avatar?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

const Message: React.FC<MessageProps> = ({ self, time, avatar, actions, children }) => {
  return (
    <div
      className={cn('flex gap-x-3 content-center items-start', {
        'place-content-end': self
      })}
    >
      <div className="mt-0.5">{!self && avatar}</div>
      <div
        className={cn('flex flex-col gap-1.5', {
          'w-[85%] items-end': self,
          'w-full': !self
        })}
      >
        <div
          className={cn('text-cn-foreground-3 leading-relaxed', {
            'px-3 py-2 bg-cn-background-8 rounded-lg': self
          })}
        >
          {children}
        </div>
        <div className="mt-1 flex items-center justify-between gap-3">
          <div>{actions && <div className="flex items-center justify-start gap-1">{actions}</div>}</div>
          {time && (
            <Text size={1} className="text-cn-foreground-1 opacity-20">
              {time}
            </Text>
          )}
        </div>
      </div>
    </div>
  )
}

// Typing Indicator
interface TypingProps {
  avatar?: ReactNode
}

const Typing: React.FC<TypingProps> = ({ avatar }) => {
  return (
    <div className="mt-3 flex items-center gap-3">
      {avatar}
      <div className="flex gap-1 text-lg font-medium text-cn-foreground-success" aria-live="polite">
        <span className="dot animate-bounce">&middot;</span>
        <span className="dot animate-bounce" style={{ animationDelay: '0.15s' }}>
          &middot;
        </span>
        <span className="dot animate-bounce" style={{ animationDelay: '0.3s' }}>
          &middot;
        </span>
      </div>
    </div>
  )
}

// Separator (For Date Breaks)
interface SeparatorProps {
  title: string
}

const Separator: React.FC<SeparatorProps> = ({ title }) => {
  return <div className="text-center text-2 font-medium opacity-50">{title}</div>
}

// Input Field
interface InputFieldProps {
  value?: string
  inputRef?: RefObject<HTMLInputElement>
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
  onSend?: () => void
  placeholder?: string
  disabled?: boolean
  sendIcon?: React.ReactNode
}

const InputField: React.FC<InputFieldProps> = ({
  value = '',
  inputRef,
  onChange = () => {},
  onKeyDown = () => {},
  onSend = () => {},
  placeholder = 'Type a message...',
  disabled = false,
  sendIcon = <Icon name="chevron-up" size={16} />
}) => {
  return (
    <div className="sticky bottom-0 flex items-center gap-2 bg-cn-background">
      <Input
        ref={inputRef}
        className="flex-1 rounded-lg px-4 pb-16 pt-6 focus:ring-0"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Chat input"
      />
      <Button
        onClick={onSend}
        variant="surface"
        theme="muted"
        size="sm"
        disabled={disabled}
        className="absolute bottom-3.5 right-3.5 z-10 size-6"
      >
        {sendIcon}
      </Button>
    </div>
  )
}

export const Chat = {
  Root,
  Body,
  Footer,
  Message,
  Typing,
  Separator,
  Input: InputField
}
