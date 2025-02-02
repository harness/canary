import { ChangeEvent, KeyboardEvent, ReactNode, RefObject } from 'react'

import { Button, Icon, Input, Text } from '@/components'
import { cn } from '@/utils/cn'

// Root Container
const Root: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="w-full h-full overflow-y-auto flex flex-col">{children}</div>
}

// Body
const Body: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="flex-1 flex flex-col gap-6 mb-3 p-6">{children}</div>
}

// Footer
const Footer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="sticky bottom-0 p-6 pt-0 bg-background">{children}</div>
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
          className={cn('text-foreground-3 leading-relaxed', {
            'px-3 py-2 bg-background-8 rounded-lg': self
          })}
        >
          {children}
        </div>
        <div className="flex gap-3 items-center justify-between mt-1">
          <div>{actions && <div className="flex gap-1 items-center justify-start">{actions}</div>}</div>
          {time && (
            <Text size={1} className="text-primary opacity-20">
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
    <div className="flex items-center gap-3 mt-3">
      {avatar}
      <div className="flex gap-1 text-success text-lg font-medium" aria-live="polite">
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
  return <div className="text-center text-xs font-medium opacity-50">{title}</div>
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
    <div className="sticky bottom-0 bg-background flex items-center gap-2">
      <Input
        ref={inputRef}
        className="flex-1 pt-6 px-4 pb-16 rounded-lg focus:ring-0"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Chat input"
      />
      <Button
        onClick={onSend}
        variant="outline"
        size="icon"
        disabled={disabled}
        className="absolute right-3.5 bottom-3.5 z-10 w-6 h-6"
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
