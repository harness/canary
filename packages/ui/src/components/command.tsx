import * as React from 'react'

import { Dialog, IconV2, ScrollArea, ScrollAreaProps } from '@/components'
import { type DialogProps } from '@radix-ui/react-dialog'
import { cn } from '@utils/cn'
import { Command as CommandPrimitive } from 'cmdk'

const CommandRoot = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn('bg-cn-2 text-cn-1 flex h-full w-full flex-col overflow-hidden rounded', className)}
    {...props}
  />
))
CommandRoot.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog.Root {...props}>
      <Dialog.Content className="overflow-hidden p-0">
        <CommandRoot className="[&_[cmdk-group-heading]]:text-cn-3 [&_[cmdk-group-heading]]:px-cn-xs [&_[cmdk-group]]:px-cn-xs [&_[cmdk-item]]:px-cn-xs [&_[cmdk-item]]:py-cn-sm [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]_svg]:size-5">
          {children}
        </CommandRoot>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  // eslint-disable-next-line react/no-unknown-property
  <div className="px-cn-sm flex items-center border-b" cmdk-input-wrapper="">
    <IconV2 name="search" className="mr-cn-xs shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'placeholder:text-cn-3 flex h-10 w-full rounded-cn-3 bg-transparent py-cn-sm text-cn-size-2 outline-none disabled:cursor-not-allowed focus-visible:outline-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> & {
    scrollAreaProps?: Omit<ScrollAreaProps, 'children'>
  }
>(({ className, children, scrollAreaProps, ...props }, ref) => (
  <CommandPrimitive.List ref={ref} className={cn('flex flex-col', className)} {...props}>
    <ScrollArea {...scrollAreaProps} className={cn('max-h-[300px]', scrollAreaProps?.className)}>
      {children}
    </ScrollArea>
  </CommandPrimitive.List>
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="text-cn-3 px-cn-xs py-cn-md text-cn-size-2 text-center" {...props} />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'text-cn-1 [&_[cmdk-group-heading]]:text-cn-3 overflow-hidden p-cn-3xs [&_[cmdk-group-heading]]:px-cn-xs [&_[cmdk-group-heading]]:py-cn-2xs [&_[cmdk-group-heading]]:text-cn-size-2 [&_[cmdk-group-heading]]:font-medium',
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('bg-cn-separator-subtle -mx-cn-3xs h-px', className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'data-[selected=true]:bg-cn-hover data-[selected=true]:text-cn-1 relative flex cursor-default select-none items-center rounded px-cn-xs py-cn-2xs text-cn-size-2 outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn('text-cn-3 ml-auto text-cn-size-2 tracking-cn-widest', className)} {...props} />
}
CommandShortcut.displayName = 'CommandShortcut'

const CommandLoading = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Loading>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Loading>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Loading
    ref={ref}
    className={cn('relative select-none rounded px-cn-xs py-cn-2xs text-cn-size-2 outline-none', className)}
    {...props}
  />
))

CommandLoading.displayName = CommandPrimitive.Loading.displayName

const Command = {
  Root: CommandRoot,
  Dialog: CommandDialog,
  Input: CommandInput,
  List: CommandList,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Item: CommandItem,
  Shortcut: CommandShortcut,
  Separator: CommandSeparator,
  Loading: CommandLoading
}

export { Command }
