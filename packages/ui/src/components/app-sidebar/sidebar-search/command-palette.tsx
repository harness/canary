import React, { PropsWithChildren } from 'react'

import { Dialog } from '@components/dialog'
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
    className={cn('flex h-full w-full flex-col overflow-hidden rounded-[10px] text-cn-1', className)}
    {...props}
  />
))
Root.displayName = 'Root'

const CommandPaletteDialog = ({ children, open, onOpenChange }: PropsWithChildren<DialogProps>) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Content hideClose>
      <Dialog.Body>
        <Root className="[&_[cmdk-group-heading]]:px-cn-xs [&_[cmdk-group-heading]]:text-cn-3 [&_[cmdk-group]]:px-cn-xs [&_[cmdk-item]]:py-cn-2xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-cn-sm [&_[cmdk-item]_svg]:h-auto [&_[cmdk-item]_svg]:w-5">
          {children}
        </Root>
      </Dialog.Body>
    </Dialog.Content>
  </Dialog.Root>
)
CommandPaletteDialog.displayName = 'CommandPaletteDialog'

const Dropdown = ({ children, open, onOpenChange }: PropsWithChildren<DialogProps>) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Content>
      <Dialog.Body>
        <Root className="[&_[cmdk-group-heading]]:px-cn-xs [&_[cmdk-group-heading]]:text-cn-3 [&_[cmdk-group]]:px-cn-xs [&_[cmdk-item]]:py-cn-2xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-cn-sm [&_[cmdk-item]_svg]:h-auto [&_[cmdk-item]_svg]:w-5">
          {children}
        </Root>
      </Dialog.Body>
    </Dialog.Content>
  </Dialog.Root>
)
Dropdown.displayName = 'Dropdown'

const Input = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="px-cn-md flex items-center border-b">
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-3 bg-transparent py-cn-sm text-3 text-cn-1 outline-none placeholder:text-cn-3 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-0 focus-visible:outline-none',
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
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="py-cn-xl text-center text-2" {...props} />)
Empty.displayName = 'Empty'

const Group = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden mt-cn-xs p-cn-3xs text-cn-3 text-2 [&_[cmdk-group-heading]]:px-cn-sm [&_[cmdk-group-heading]]:py-cn-2xs [&_[cmdk-group-heading]]:text-2 [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:text-cn-3',
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
      'relative flex cursor-default gap-0 select-none items-center font-normal rounded-2 px-cn-lg py-0 text-2 text-cn-1 outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-cn-hover data-[selected=true]:text-cn-1 data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
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
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-cn-3xs h-px bg-cn-separator-subtle', className)}
    {...props}
  />
))
Separator.displayName = 'Separator'

const Shortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto px-cn-2xs flex gap-cn-4xs rounded-1 text-2 tracking-tight border border-cn-2 bg-cn-3 text-cn-2',
        className
      )}
      {...props}
    />
  )
}
Shortcut.displayName = 'Shortcut'

export const CommandPalette = {
  Root,
  Dialog: CommandPaletteDialog,
  Dropdown,
  Input,
  Empty,
  Group,
  List,
  Item,
  Separator,
  Shortcut
}
