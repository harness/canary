import { ChangeEvent, KeyboardEvent, ReactNode, RefObject } from 'react'

import { Button, Icon, Input } from '@/components'
import ChatAvatarIcon from '@/icons/chat-avatar.svg'
import { cn } from '@/utils/cn'

// Root Container
const Root: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="w-full h-full overflow-y-auto flex flex-col bg-background-1">{children}</div>
}

// Body
const Body: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col gap-y-7 mb-5 px-6 py-4">
      <div className="flex items-center justify-between">
        <p className="text-foreground-1 text-16 font-medium">AI Assistant</p>
        <Button size="icon" variant="custom" className="text-icons-4 -mr-2 hover:text-icons-2">
          <Icon name="close" size={16} />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      {children}
    </div>
  )
}

// Footer
const Footer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="sticky bottom-0 p-6">{children}</div>
}

// Message Component
interface MessageProps {
  self?: boolean
  avatar?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

const Message: React.FC<MessageProps> = ({ self, avatar, actions, children }) => {
  return (
    <div
      className={cn('flex gap-x-3 content-center items-start', {
        'place-content-end': self
      })}
    >
      {!self && <div className="mt-0.5">{avatar ? avatar : <ChatAvatarIcon />}</div>}
      <div
        className={cn('flex flex-col gap-3', {
          'w-[85%] items-end': self,
          'w-full': !self
        })}
      >
        <div
          className={cn('text-14 text-foreground-1 leading-relaxed', {
            'px-3.5 py-2 bg-background-8 rounded-[8px_8px_2px_8px]': self
          })}
        >
          {children}
        </div>
        {actions && (
          <div className="flex gap-3 items-center justify-between mt-1">
            <div className="flex gap-1 items-center justify-start">{actions}</div>
          </div>
        )}
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
    <div className="flex items-center gap-x-3.5 mt-3">
      {avatar || <ChatAvatarIcon />}
      <span className="w-2.5 h-2.5 rounded-full bg-foreground-2" aria-hidden />
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
  sendIcon = <Icon name="arrow" size={12} />
}) => {
  return (
    <div className="sticky bottom-0 flex items-center gap-2">
      <Input
        ref={inputRef}
        className="flex-1 h-11 px-3 rounded-lg focus:ring-0 focus-visible:rounded-lg focus-visible:h-16 focus-visible:pb-8"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Chat input"
      />
      <Button
        className="absolute right-3 bottom-2 z-10 size-7 rounded-full"
        onClick={onSend}
        size="icon"
        disabled={disabled}
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
