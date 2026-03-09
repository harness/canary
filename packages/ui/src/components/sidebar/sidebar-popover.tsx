import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react'

import { cn } from '@utils/cn'

import { Popover } from '../popover'

const SIDEBAR_NESTED_POPOVER_CLASS = 'cn-sidebar-nested-popover'

/** Stable wrapper so Radix receives a consistent ref/onClick target; avoids infinite loops when trigger is a component that recreates (e.g. Sidebar.Item). */
const TriggerWrapper = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <div ref={ref} {...props} />
))
TriggerWrapper.displayName = 'SidebarPopoverTriggerWrapper'

type SidebarPopoverProps = Omit<ComponentPropsWithoutRef<typeof Popover.Root>, 'children'> &
  Omit<ComponentPropsWithoutRef<typeof Popover.Content>, 'children' | 'custom' | 'content'> & {
    /** The popover panel content */
    content: ReactNode
    /** The trigger element */
    children: ReactNode
  }

export function SidebarPopover({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  className,
  ...contentProps
}: SidebarPopoverProps) {
  return (
    <Popover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <TriggerWrapper>{children}</TriggerWrapper>
      </Popover.Trigger>
      <Popover.Content className={cn(SIDEBAR_NESTED_POPOVER_CLASS, className)} custom {...contentProps}>
        {content}
      </Popover.Content>
    </Popover.Root>
  )
}
