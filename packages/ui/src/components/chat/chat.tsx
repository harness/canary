import { ChangeEvent, FC, HTMLAttributes, KeyboardEvent, PropsWithChildren, ReactNode, RefObject } from 'react'

import { Button, Icon, Input } from '@/components'
import { useTheme } from '@/context'
import ChatAvatarIconLightTheme from '@/icons/chat-avatar-light-theme.svg'
import ChatAvatarIcon from '@/icons/chat-avatar.svg'
import { cn } from '@utils/cn'

const Root: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return <div className="bg-background-1 flex size-full max-w-[460px] flex-col">{children}</div>
}

const Header: FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="bg-background-1 sticky top-0 flex items-center justify-between px-6 py-4">
      <p className="text-16 text-foreground-1 font-medium">Harness AI</p>
      <Button size="icon" variant="custom" className="text-icons-4 hover:text-icons-2 -mr-2" onClick={onClose}>
        <Icon name="close" size={16} />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  )
}

const Body: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return (
    <div className="scrollbar-hidden flex flex-1 flex-col gap-y-7 overflow-y-auto overflow-x-hidden px-6 py-2">
      {children}
    </div>
  )
}

const Footer: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return <div className="bg-background-1 sticky bottom-0 px-6 py-3">{children}</div>
}

interface MessageProps extends PropsWithChildren<HTMLAttributes<HTMLElement>> {
  self?: boolean
  avatar?: ReactNode
  actions?: ReactNode
}

const Message: FC<MessageProps> = ({ self, avatar, actions, children }) => {
  const { isLightTheme } = useTheme()

  return (
    <div
      className={cn('flex gap-x-3 content-center items-start', {
        'place-content-end': self
      })}
    >
      {!self && (
        <div className="mt-0.5">
          {avatar ? avatar : isLightTheme ? <ChatAvatarIconLightTheme /> : <ChatAvatarIcon />}
        </div>
      )}
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

const CodeBlock: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return (
    <code
      className={cn(
        'inline-block rounded-[3px] border border-borders-2 bg-background-8 px-1.5 text-13 leading-[18px]',
        className
      )}
    >
      {children}
    </code>
  )
}

interface TypingProps {
  avatar?: ReactNode
}

const Typing: FC<TypingProps> = ({ avatar }) => {
  const { isLightTheme } = useTheme()

  return (
    <div className="mt-3 flex items-center gap-x-3.5">
      {avatar || (isLightTheme ? <ChatAvatarIconLightTheme /> : <ChatAvatarIcon />)}
      <span className="bg-foreground-2 size-2.5 rounded-full" aria-hidden />
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
        <span className="text-20 text-foreground-4 block font-semibold leading-none">Hello Steven,</span>
        <span className="text-20 text-foreground-1 mt-[3px] block font-semibold leading-none">how can I help?</span>
      </div>
      <div>
        <span className="text-14 text-foreground-2 leading-relaxed">
          Here are some suggestions to enhance your CI/CD pipeline:
        </span>
        <ul className="mt-3 flex flex-col gap-y-1.5">
          {emptyStateButtons.map(({ text }, index) => (
            <li key={index}>
              <Button
                className="bg-background-3 text-foreground-1 hover:bg-background-12 w-full justify-start rounded-lg px-3.5"
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
        wrapperClassName="flex-row"
        value={value}
        onChange={onChange}
        onKeyDown={event => {
          onKeyDown(event)
          if (event.code === 'Enter') {
            onSend()
          }
        }}
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
  Header,
  Footer,
  Message,
  Typing,
  CodeBlock,
  Separator,
  EmptyState,
  Input: InputField
}
