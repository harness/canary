import { ChangeEvent, FC, HTMLAttributes, KeyboardEvent, PropsWithChildren, ReactNode, RefObject } from 'react'

import { Button, Icon, Input } from '@/components'
import ChatAvatarIcon from '@/icons/chat-avatar.svg'
import { cn } from '@utils/cn'

const Root: FC = ({ children }: PropsWithChildren<HTMLAttributes<HTMLElement>>) => {
  return (
    <div className="flex size-full max-w-[460px] flex-col bg-background-1">
      <div className="sticky top-0 flex items-center justify-between bg-background-1 px-6 py-4">
        <p className="text-16 font-medium text-foreground-1">AI Assistant</p>
        <Button size="icon" variant="custom" className="-mr-2 text-icons-4 hover:text-icons-2">
          <Icon name="close" size={16} />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      {children}
    </div>
  )
}

const Body: FC = ({ children }: PropsWithChildren<HTMLAttributes<HTMLElement>>) => {
  return (
    <div className="scrollbar-hidden flex flex-1 flex-col gap-y-7 overflow-y-auto overflow-x-hidden px-6 py-2">
      {children}
    </div>
  )
}

const Footer: FC = ({ children }: PropsWithChildren<HTMLAttributes<HTMLElement>>) => {
  return <div className="sticky bottom-0 bg-background-1 px-6 py-3">{children}</div>
}

interface MessageProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
  self?: boolean
  avatar?: ReactNode
  actions?: ReactNode
}

const Message: FC<MessageProps> = ({ self, avatar, actions, children }) => {
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
        {actions && <div className="mt-1 flex items-center gap-1">{actions}</div>}
      </div>
    </div>
  )
}

interface TypingProps {
  avatar?: ReactNode
}

const Typing: FC<TypingProps> = ({ avatar }) => {
  return (
    <div className="mt-3 flex items-center gap-x-3.5">
      {avatar || <ChatAvatarIcon />}
      <span className="size-2.5 rounded-full bg-foreground-2" aria-hidden />
    </div>
  )
}

interface SeparatorProps {
  title: string
}

const Separator: FC<SeparatorProps> = ({ title }) => {
  return <div className="text-center text-xs font-medium opacity-50">{title}</div>
}

const emptyStateButtons = [
  {
    text: 'Pipeline design'
  },
  {
    text: 'Security reports'
  },
  {
    text: 'Error detection'
  },
  {
    text: 'Testing'
  }
]

const EmptyState: FC = () => {
  return (
    <div className="mt-auto flex flex-col gap-5">
      <div>
        <span className="block text-20 font-semibold leading-none text-foreground-4">Hello Steven,</span>
        <span className="mt-[3px] block text-20 font-semibold leading-none text-foreground-1">how can I help?</span>
      </div>
      <div>
        <span className="text-14 leading-relaxed text-foreground-2">
          Here are some suggestions to enhance your CI/CD pipeline:
        </span>
        <ul className="mt-3 flex flex-col gap-y-1.5">
          {emptyStateButtons.map(({ text }, index) => (
            <li key={index}>
              <Button
                className="w-full justify-start rounded-lg bg-background-3 px-3.5 text-foreground-1 hover:bg-background-12"
                size="lg"
              >
                {text}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

interface InputFieldProps {
  value?: string
  inputRef?: RefObject<HTMLInputElement>
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
  onSend?: () => void
  placeholder?: string
  disabled?: boolean
  sendIcon?: ReactNode
}

const InputField: FC<InputFieldProps> = ({
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
    <div className="relative">
      <Input
        ref={inputRef}
        className="h-11 flex-1 rounded-lg pl-3 pr-12 focus:ring-0 focus-visible:h-16 focus-visible:rounded-lg focus-visible:pb-8"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Chat input"
      />
      <Button
        className="absolute bottom-2 right-2 z-10 size-7 rounded-full"
        onClick={onSend}
        size="icon"
        disabled={disabled}
        aria-label="Send message"
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
  EmptyState,
  Input: InputField
}
