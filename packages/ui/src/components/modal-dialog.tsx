import { Children, forwardRef, HTMLAttributes, isValidElement, ReactNode } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Button, ButtonProps } from './button'
import { IconV2, IconV2NamesType } from './icon-v2'
import { LogoV2, LogoV2NamesType } from './logo-v2'
import { ScrollArea } from './scroll-area'

const contentVariants = cva('cn-modal-dialog-content', {
  variants: {
    size: {
      sm: 'cn-modal-dialog-sm',
      md: 'cn-modal-dialog-md',
      lg: 'cn-modal-dialog-lg'
    }
  },
  defaultVariants: {
    size: 'sm'
  }
})

const headerVariants = cva('cn-modal-dialog-header', {
  variants: {
    theme: {
      default: 'cn-modal-dialog-theme-default',
      warning: 'cn-modal-dialog-theme-warning',
      danger: 'cn-modal-dialog-theme-danger'
    }
  },
  defaultVariants: {
    theme: 'default'
  }
})

export type ModalDialogRootProps = Pick<Dialog.DialogProps, 'open' | 'onOpenChange' | 'children'>

const Root = ({ children, ...props }: ModalDialogRootProps) => {
  return <Dialog.Root {...props}>{children}</Dialog.Root>
}

const Trigger = Dialog.Trigger

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
          <Dialog.Close asChild>
            <Button variant="transparent" className="cn-modal-dialog-close">
              <IconV2 name="xmark" skipSize />
            </Button>
          </Dialog.Close>
        )}
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  )
)
Content.displayName = 'ModalDialog.Content'

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  icon?: IconV2NamesType
  logo?: LogoV2NamesType
  theme?: 'default' | 'warning' | 'danger'
}

const Header = ({ className, icon, logo, theme = 'default', children, ...props }: HeaderProps) => {
  if (icon && logo) {
    console.warn('ModalDialog.Header: Cannot use both icon and logo props together')
    return null
  }

  // Find the title and description from children
  let title: React.ReactNode = null
  let description: React.ReactNode = null

  Children.forEach(children, child => {
    if (isValidElement(child)) {
      if (child.type === Title) {
        title = child
      } else if (child.type === Description) {
        description = child
      }
    }
  })

  return (
    <div className={cn(headerVariants({ theme }), className)} {...props}>
      <div className="cn-modal-dialog-header-title-row">
        {icon && (
          <div className="cn-modal-dialog-header-icon">
            <IconV2 name={icon} size={24} />
          </div>
        )}
        {logo && (
          <div className="cn-modal-dialog-header-logo">
            <LogoV2 size="lg" name={logo} />
          </div>
        )}
        {title}
      </div>
      {description}
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
  <ScrollArea className="flex flex-col" viewportClassName={cn('cn-modal-dialog-body', className)} {...props}>
    {children}
  </ScrollArea>
)

const Footer = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('cn-modal-dialog-footer', className)} {...props} />
)

const Close = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, ...props }, ref) => (
  <Dialog.Close asChild>
    <Button variant="secondary" className={className} {...props} ref={ref}>
      {children}
    </Button>
  </Dialog.Close>
))
Close.displayName = 'ModalDialog.Close'

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
