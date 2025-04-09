import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactElement } from 'react'

import { Cross2Icon } from '@radix-ui/react-icons'
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
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 gap-y-2 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[317px]',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded border py-3 pl-3.5 pr-12 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'border-cn-borders-2 bg-cn-background-3 text-cn-foreground [&_svg]:text-icons-1',
        destructive: 'border-cn-borders-danger bg-foreground-danger text-cn-foreground-1 [&_svg]:text-icons-2',
        success:
          'border-cn-borders-success border-tag-border-mint-1 bg-tag-background-mint-1 text-tag-foreground-mint-1 [&_svg]:text-icons-2'
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
      'hover:bg-cn-background-3 focus:ring-ring group-[.destructive]:border-cn-borders-1/40 group-[.destructive]:hover:border-cn-borders-danger/30 group-[.destructive]:hover:bg-cn-background-solidred group-[.destructive]:hover:text-cn-foreground-solidred group-[.destructive]:focus:ring-cn-borders-solidred inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50',
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
      'text-icons-2 absolute right-3.5 top-[15px] my-auto size-3 rounded-md focus:outline-none focus:ring-1',
      className
    )}
    toast-close=""
    {...props}
  >
    <Cross2Icon className="size-3" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitives.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm leading-tight tracking-tight [&+div]:text-xs', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitives.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn('text-sm opacity-90', className)} {...props} />
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

export { Toast, type ToastProps, type ToastActionElement }
