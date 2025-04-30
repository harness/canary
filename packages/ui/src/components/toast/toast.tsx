import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactElement } from 'react'

import { Icon } from '@components/icon'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitives.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 gap-y-2 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[427px]',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'pointer-events-auto relative flex h-12 w-full items-center justify-between overflow-hidden rounded border py-2 pl-3.5 pr-2 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'border-cn-borders-2 bg-cn-background-3',
        destructive: 'border-transparent bg-toast-background-danger',
        success: 'border-cn-borders-2 bg-cn-background-3',
        failed: 'border-cn-borders-2 bg-cn-background-3'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const ToastRoot = forwardRef<
  ElementRef<typeof ToastPrimitives.Root>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
})
ToastRoot.displayName = ToastPrimitives.Root.displayName

const ToastAction = forwardRef<
  ElementRef<typeof ToastPrimitives.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'hover:text-foreground-8 hover:border-borders-6 focus:ring-ring group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-borders-2 bg-transparent text-foreground-2 px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50 w-[84px]',
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitives.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute flex items-center justify-center right-1 my-auto size-8 rounded-md focus:outline-none focus:ring-1',
      className
    )}
    toast-close=""
    {...props}
  >
    <Icon name="cross" size={12} />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitives.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn('text-sm leading-tight text-cn-foreground-1', className)} {...props} />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitives.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm leading-tight text-cn-foreground-1', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = ComponentPropsWithoutRef<typeof ToastRoot>

type ToastActionElement = ReactElement<typeof ToastAction>

const Toast = {
  Root: ToastRoot,
  Action: ToastAction,
  Close: ToastClose,
  Title: ToastTitle,
  Description: ToastDescription,
  Viewport: ToastViewport,
  Provider: ToastProvider
}

export { Toast, type ToastActionElement, type ToastProps }
