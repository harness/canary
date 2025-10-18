import { ChangeEvent, FC, HTMLAttributes, KeyboardEvent, PropsWithChildren, ReactNode, RefObject } from 'react'

import { Button, IconV2, Illustration, Input } from '@/components'
import { cn } from '@utils/cn'

const Root: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return <div className="bg-cn-1 flex size-full max-w-[460px] flex-col">{children}</div>
}

const Header: FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="bg-cn-1 px-cn-xl py-cn-md sticky top-0 flex items-center justify-between">
      <p className="text-16 text-cn-1 font-medium">Harness AI</p>
      <Button size="sm" iconOnly variant="ghost" onClick={onClose} ignoreIconOnlyTooltip>
        <IconV2 name="xmark" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  )
}

const Body: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return (
    <div className="scrollbar-hidden px-cn-xl py-cn-xs flex flex-1 flex-col gap-y-7 overflow-y-auto overflow-x-hidden">
      {children}
    </div>
  )
}

const Footer: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return <div className="bg-cn-1 px-cn-xl py-cn-sm sticky bottom-0 z-10">{children}</div>
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
      {!self && (
        <div className="mt-cn-4xs">
          {avatar ? avatar : <Illustration size={16} name="chat-avatar" themeDependent />}
        </div>
      )}
      <div
        className={cn('flex flex-col gap-3', {
          'w-[85%] items-end': self,
          'w-full': !self
        })}
      >
        <div
          className={cn('text-2 text-cn-1 leading-relaxed', {
            'px-cn-sm py-cn-xs bg-cn-gray-secondary rounded-[8px_8px_2px_8px]': self
          })}
        >
          {children}
        </div>
        {actions && <div className="mt-cn-3xs flex items-center gap-1">{actions}</div>}
      </div>
    </div>
  )
}

const CodeBlock: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return (
    <code
      className={cn(
        'inline-block rounded-[3px] border border-cn-2 bg-cn-gray-secondary px-cn-2xs text-2 leading-[18px]',
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
  return (
    <div className="mt-cn-sm flex items-center gap-x-3.5">
      {avatar || <Illustration size={16} name="chat-avatar" themeDependent />}
      <span className="bg-cn-3 size-2.5 rounded-full" aria-hidden />
    </div>
  )
}

interface SeparatorProps {
  title: string
}

const Separator: FC<SeparatorProps> = ({ title }) => {
  return <div className="text-2 text-center font-medium opacity-50">{title}</div>
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
        <span className="text-5 text-cn-2 block font-semibold leading-none">Hello Steven,</span>
        <span className="text-5 text-cn-1 mt-cn-3xs block font-semibold leading-none">how can I help?</span>
      </div>
      <div>
        <span className="text-2 text-cn-2 leading-relaxed">
          Here are some suggestions to enhance your CI/CD pipeline:
        </span>
        <ul className="mt-cn-sm flex flex-col gap-y-1.5">
          {emptyStateButtons.map(({ text }, index) => (
            <li key={index}>
              <Button className="w-full justify-start" variant="secondary">
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
  sendIcon = <IconV2 name="arrow-up" size="2xs" />
}) => {
  return (
    <div className="relative">
      <Input
        ref={inputRef}
        // TODO: Review and remove arbitrary values
        className="rounded-4 pl-cn-sm focus-visible:rounded-4 focus-visible:pb-cn-2xl h-11 flex-1 pr-[60px] focus:ring-0 focus-visible:h-16"
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
        className="absolute bottom-2 right-2 z-10 size-7"
        rounded
        onClick={onSend}
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
