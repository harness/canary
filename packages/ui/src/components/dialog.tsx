import { Children, forwardRef, HTMLAttributes, isValidElement, ReactNode, useCallback } from 'react'

import { DialogOpenContext, TriggerBase, usePortal, useRegisterDialog, useTranslation } from '@/context'
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
      lg: 'cn-modal-dialog-lg',
      max: 'cn-modal-dialog-max'
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

const Root = ({ children, open, ...props }: ModalDialogRootProps) => {
  return (
    <DialogOpenContext.Provider value={{ open }}>
      <DialogPrimitive.Root {...props} open={open}>
        {children}
      </DialogPrimitive.Root>
    </DialogOpenContext.Provider>
  )
}

interface ContentProps extends DialogPrimitive.DialogContentProps, VariantProps<typeof contentVariants> {
  size?: 'sm' | 'md' | 'lg' | 'max'
  hideClose?: boolean
}

const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, className, size = 'sm', hideClose = false, onCloseAutoFocus: _onCloseAutoFocus, ...props }, ref) => {
    const { portalContainer } = usePortal()
    const { handleCloseAutoFocus } = useRegisterDialog()

    const onCloseAutoFocus = useCallback(
      (e: Event) => {
        handleCloseAutoFocus()
        _onCloseAutoFocus?.(e)
      },
      [_onCloseAutoFocus, handleCloseAutoFocus]
    )

    return (
      <DialogPrimitive.Portal container={portalContainer}>
        {/* !!! */}
        {/* For the scroll to work when using the dialog in Shadow DOM, the Overlay needs to wrap the Content */}
        {/* Here’s the issue for the scroll bug in Shadow DOM - https://github.com/radix-ui/primitives/issues/3353 */}
        <DialogPrimitive.Overlay className="cn-modal-dialog-overlay">
          <DialogPrimitive.Content
            ref={ref}
            className={cn(contentVariants({ size }), className)}
            {...props}
            onCloseAutoFocus={onCloseAutoFocus}
          >
            {!hideClose && (
              <DialogPrimitive.Close asChild>
                <Button className="cn-modal-dialog-close" variant="transparent" iconOnly ignoreIconOnlyTooltip>
                  <IconV2 name="xmark" />
                </Button>
              </DialogPrimitive.Close>
            )}
            {children}
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    )
  }
)
Content.displayName = 'Dialog.Content'

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  icon?: IconV2NamesType
  logo?: LogoV2NamesType
  theme?: 'default' | 'warning' | 'danger'
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, icon, logo, theme = 'default', children, ...props }, ref) => {
    const { t } = useTranslation()
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
      <div className={cn(headerVariants({ theme }), className)} ref={ref} {...props}>
        <div className="cn-modal-dialog-header-title-row">
          {icon && (
            <div className="cn-modal-dialog-header-icon">
              <IconV2 name={icon} size="xl" />
            </div>
          )}
          {logo && (
            <div className="cn-modal-dialog-header-logo">
              <LogoV2 name={logo} size="md" />
            </div>
          )}
          {title}
        </div>
        {description ? (
          description
        ) : (
          <Description className="sr-only">
            {t('component:dialog.noDescription', 'No description available')}
          </Description>
        )}
      </div>
    )
  }
)
Header.displayName = 'Dialog.Header'

const Title = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title className={cn('cn-modal-dialog-title', className)} {...props} ref={ref} />
))
Title.displayName = 'Dialog.Title'

const Description = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description className={cn('cn-modal-dialog-description', className)} {...props} ref={ref} />
  )
)
Description.displayName = 'Dialog.Description'

interface BodyProps {
  className?: string
  classNameContent?: string
  children: ReactNode
}

const Body = forwardRef<HTMLDivElement, BodyProps>(({ className, classNameContent, children, ...props }, ref) => (
  <ScrollArea
    className={cn('cn-modal-dialog-body', className)}
    classNameContent={cn('cn-modal-dialog-body-content', classNameContent)}
    ref={ref}
    {...props}
  >
    {children}
  </ScrollArea>
))
Body.displayName = 'Dialog.Body'

const Footer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div className={cn('cn-modal-dialog-footer', className)} {...props} ref={ref} />
))
Footer.displayName = 'Dialog.Footer'

const Close = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, ...props }, ref) => (
  <DialogPrimitive.Close asChild>
    <Button variant="secondary" className={className} {...props} ref={ref}>
      {children}
    </Button>
  </DialogPrimitive.Close>
))
Close.displayName = 'Dialog.Close'

const Trigger = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLDivElement>>(({ children, ...props }, ref) => {
  return (
    <TriggerBase ref={ref} {...props} TriggerComponent={DialogPrimitive.Trigger}>
      {children}
    </TriggerBase>
  )
})
Trigger.displayName = 'DialogTrigger'

export const Dialog = {
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
