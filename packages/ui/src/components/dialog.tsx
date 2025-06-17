import { Children, forwardRef, HTMLAttributes, isValidElement, ReactNode } from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'
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

export type ModalDialogRootProps = Pick<DialogPrimitive.DialogProps, 'open' | 'onOpenChange' | 'children'>

const Root = ({ children, ...props }: ModalDialogRootProps) => {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>
}

const Trigger = DialogPrimitive.Trigger

interface ContentProps extends DialogPrimitive.DialogContentProps, VariantProps<typeof contentVariants> {
  size?: 'sm' | 'md' | 'lg'
  hideClose?: boolean
}

const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, className, size = 'sm', hideClose = false, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="cn-modal-dialog-overlay" />
      <DialogPrimitive.Content ref={ref} className={cn(contentVariants({ size }), className)} {...props}>
        {!hideClose && (
          <DialogPrimitive.Close asChild>
            <Button variant="transparent" className="cn-modal-dialog-close">
              <IconV2 name="xmark" skipSize />
            </Button>
          </DialogPrimitive.Close>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
)
Content.displayName = 'Dialog.Content'

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  icon?: IconV2NamesType
  logo?: LogoV2NamesType
  theme?: 'default' | 'warning' | 'danger'
}

const Header = ({ className, icon, logo, theme = 'default', children, ...props }: HeaderProps) => {
  if (icon && logo) {
    console.warn('Dialog.Header: Cannot use both icon and logo props together')
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
            <IconV2 name={icon} size="lg" />
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
  <DialogPrimitive.Title className={cn('cn-modal-dialog-title', className)} {...props} />
)

const Description = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <DialogPrimitive.Description className={cn('cn-modal-dialog-description', className)} {...props} />
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
  <DialogPrimitive.Close asChild>
    <Button variant="secondary" className={className} {...props} ref={ref}>
      {children}
    </Button>
  </DialogPrimitive.Close>
))
Close.displayName = 'Dialog.Close'

const Dialog = {
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

export { Dialog }
