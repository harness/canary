import React, { PropsWithChildren } from 'react'

import { Dialog as RadixDialog } from '@components/dialog'
import { Overlay } from '@radix-ui/react-dialog'
import { cn } from '@utils/cn'
import { Command as CommandPrimitive } from 'cmdk'

interface DialogProps {
  className?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const Root = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn('flex h-full w-full flex-col overflow-hidden rounded-[10px] text-popover-foreground', className)}
    {...props}
  />
))
Root.displayName = 'Root'

const Dialog = ({ children, open, onOpenChange }: PropsWithChildren<DialogProps>) => (
  <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
    <RadixDialog.Content isShowCloseIcon={false}>
      <Root className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2.5 [&_[cmdk-item]]:py-1.5 [&_[cmdk-item]_svg]:h-auto [&_[cmdk-item]_svg]:w-5">
        {children}
      </Root>
    </RadixDialog.Content>
  </RadixDialog.Root>
)
Dialog.displayName = 'Dialog'

const Dropdown = ({ children, className, open, onOpenChange }: PropsWithChildren<DialogProps>) => (
  <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
    <Overlay
      className={cn(
        'fixed inset-0 z-50 bg-cn-background-1/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
    />
    <RadixDialog.Content className="absolute left-6 top-[58px] z-50 grid w-full max-w-[300px] gap-4 rounded-[10px] border bg-cn-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
      <Root className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2.5 [&_[cmdk-item]]:py-1.5 [&_[cmdk-item]_svg]:h-auto [&_[cmdk-item]_svg]:w-5">
        {children}
      </Root>
    </RadixDialog.Content>
  </RadixDialog.Root>
)
Dropdown.displayName = 'Dropdown'

const Input = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-4">
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md bg-transparent py-3 text-base text-cn-foreground-1 outline-none placeholder:text-cn-foreground-3 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-0 focus-visible:outline-none',
        className
      )}
      {...props}
    />
    <Shortcut>
      <span>ESC</span>
    </Shortcut>
  </div>
))
Input.displayName = 'Input'

const List = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[calc(385px-48px)] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
))
List.displayName = 'List'

const Empty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />)
Empty.displayName = 'Empty'

const Group = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden mt-2.5 p-1 text-cn-foreground-3 text-sm [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:text-cn-foreground-3',
      className
    )}
    {...props}
  />
))
Group.displayName = 'Group'

const Item = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default gap-0 select-none items-center font-normal rounded-[4px] px-5 py-0 text-sm text-cn-foreground-1 outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-foreground-4/10 data-[selected=true]:text-cn-foreground-1 data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      className
    )}
    {...props}
  />
))
Item.displayName = 'Item'

const Separator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn('-mx-1 h-px bg-border', className)} {...props} />
))
Separator.displayName = 'Separator'

const Shortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto px-[6px] flex gap-0.5 rounded-sm text-xs tracking-tight border border-cn-borders-2 bg-cn-background-3 text-cn-foreground-2',
        className
      )}
      {...props}
    />
  )
}
Shortcut.displayName = 'Shortcut'

export const CommandPalette = {
  Root,
  Dialog,
  Dropdown,
  Input,
  Empty,
  Group,
  List,
  Item,
  Separator,
  Shortcut
}
