import { ReactNode } from 'react'

import { Button, DropdownMenu, IconV2 } from '@/components'
import { cn } from '@/utils'

interface DropdownItemProps {
  name: string
  value?: string
}

interface DropdownProps {
  title: string
  items: Array<DropdownItemProps>
  onChange?: (value: string) => void
  selectedValue?: string | null
}

function Root({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex items-center justify-between gap-cn-xl', className)}>{children}</div>
}
Root.displayName = 'ListActions.Root'

function Left({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex grow items-center gap-cn-xl', className)}>{children}</div>
}

function Right({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex items-center gap-cn-xl', className)}>{children}</div>
}

function Dropdown({ title, items, onChange, selectedValue }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="transparent">
          {title}
          <IconV2 name="nav-arrow-down" />
        </Button>
      </DropdownMenu.Trigger>
      {items && (
        <DropdownMenu.Content align="end">
          {items.map((i, i_idx) => {
            return (
              <DropdownMenu.Item
                onClick={() => onChange?.(i.value ?? i.name)}
                key={i_idx}
                title={i.name}
                checkmark={Boolean(i.value) && selectedValue === i.value}
              />
            )
          })}
        </DropdownMenu.Content>
      )}
    </DropdownMenu.Root>
  )
}

export { Root, Left, Right, Dropdown }
export type { DropdownItemProps, DropdownProps }
