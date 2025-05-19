import { forwardRef, HTMLAttributes, ReactNode, useState } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Icon } from './icon'
import { Logo } from './logo'
import { ScrollArea } from './scroll-area'

const contentVariants = cva('cn-modal-dialog-content', {
  variants: {
    size: {
      sm: '',
      md: 'cn-modal-size-md',
      lg: 'cn-modal-size-lg'
    }
  },
  defaultVariants: {
    size: 'sm'
  }
})

export interface ModalDialogRootProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

const Root = ({ open, defaultOpen, onOpenChange, children }: ModalDialogRootProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : uncontrolledOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      {children}
    </Dialog.Root>
  )
}

const Trigger = Dialog.Trigger
const Close = Dialog.Close

interface ContentProps extends Dialog.DialogContentProps, VariantProps<typeof contentVariants> {
  size?: 'sm' | 'md' | 'lg'
  hideClose?: boolean
}

const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, className, size = 'sm', hideClose = false, ...props }, ref) => (
    <Dialog.Portal>
      <Dialog.Overlay className="cn-modal-dialog-overlay" />
      <Dialog.Content ref={ref} className={cn(contentVariants({ size }), className)} {...props}>
        {!hideClose && (
          <Close className="cn-modal-dialog-close">
            <Icon name="close-2" size={16} />
          </Close>
        )}
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  )
)
Content.displayName = 'ModalDialog.Content'

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  icon?: React.ComponentProps<typeof Icon>['name']
  logo?: React.ComponentProps<typeof Logo>['name']
  theme?: 'default' | 'warning' | 'danger'
}

const Header = ({ className, icon, logo, theme = 'default', children, ...props }: HeaderProps) => {
  if (icon && logo) {
    console.warn('ModalDialog.Header: Cannot use both icon and logo props together')
    return null
  }

  return (
    <div className={cn('cn-modal-dialog-header', `cn-theme-${theme}`, className)} {...props}>
      {icon && (
        <div className="cn-modal-dialog-header-icon">
          <Icon name={icon as any} size={24} />
        </div>
      )}
      {logo && (
        <div className="cn-modal-dialog-header-logo">
          <Logo name={logo as any} />
        </div>
      )}
      {children}
    </div>
  )
}

const Title = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <Dialog.Title className={cn('cn-modal-dialog-title', className)} {...props} />
)

const Description = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <Dialog.Description className={cn('cn-modal-dialog-description', className)} {...props} />
)

interface BodyProps {
  className?: string
  children: ReactNode
}

const Body = ({ className, children, ...props }: BodyProps) => (
  <ScrollArea className={cn('cn-modal-dialog-body', className)} {...props}>
    {children}
  </ScrollArea>
)

const Footer = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('cn-modal-dialog-footer', className)} {...props} />
)

const ModalDialog = {
  Root,
  Trigger,
  Content,
  Close,
  Header,
  Title,
  Description,
  Body,
  Footer
}

export { ModalDialog }
