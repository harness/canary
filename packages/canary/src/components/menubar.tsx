import * as React from 'react'

import { cn } from '@/lib/utils'
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from '@radix-ui/react-icons'
import {
  CheckboxItem,
  Content,
  Group,
  Item,
  ItemIndicator,
  Label,
  Menu,
  Portal,
  RadioGroup,
  RadioItem,
  Root,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  Trigger
} from '@radix-ui/react-menubar'

const Menubar = React.forwardRef<React.ElementRef<typeof Root>, React.ComponentPropsWithoutRef<typeof Root>>(
  ({ className, ...props }, ref) => (
    <Root
      ref={ref}
      className={cn('bg-background flex h-9 items-center space-x-1 rounded-md border p-1 shadow-sm', className)}
      {...props}
    />
  )
)
Menubar.displayName = Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof Trigger>,
  React.ComponentPropsWithoutRef<typeof Trigger>
>(({ className, ...props }, ref) => (
  <Trigger
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none',
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof SubTrigger>,
  React.ComponentPropsWithoutRef<typeof SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <SubTrigger
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto size-4" />
  </SubTrigger>
))
MenubarSubTrigger.displayName = SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof SubContent>,
  React.ComponentPropsWithoutRef<typeof SubContent>
>(({ className, ...props }, ref) => (
  <SubContent
    ref={ref}
    className={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg',
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  React.ComponentPropsWithoutRef<typeof Content>
>(({ className, align = 'start', alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <Portal>
    <Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] overflow-hidden rounded-md border p-1 shadow-md',
        className
      )}
      {...props}
    />
  </Portal>
))
MenubarContent.displayName = Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof Item>,
  React.ComponentPropsWithoutRef<typeof Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <Item
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <CheckboxItem
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <ItemIndicator>
        <CheckIcon className="size-4" />
      </ItemIndicator>
    </span>
    {children}
  </CheckboxItem>
))
MenubarCheckboxItem.displayName = CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioItem>,
  React.ComponentPropsWithoutRef<typeof RadioItem>
>(({ className, children, ...props }, ref) => (
  <RadioItem
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <ItemIndicator>
        <DotFilledIcon className="size-4 fill-current" />
      </ItemIndicator>
    </span>
    {children}
  </RadioItem>
))
MenubarRadioItem.displayName = RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <Label ref={ref} className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)} {...props} />
))
MenubarLabel.displayName = Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator ref={ref} className={cn('bg-muted -mx-1 my-1 h-px', className)} {...props} />
))
MenubarSeparator.displayName = Separator.displayName

const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)} {...props} />
}
MenubarShortcut.displayname = 'MenubarShortcut'

export {
  Menubar,
  Menu as MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  RadioGroup as MenubarRadioGroup,
  MenubarRadioItem,
  Portal as MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  Group as MenubarGroup,
  Sub as MenubarSub,
  MenubarShortcut
}
