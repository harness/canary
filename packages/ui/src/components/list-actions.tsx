import { ReactNode } from 'react'

import { cn } from '@utils/cn'

import { DropdownMenu } from './dropdown-menu'
import { IconV2 } from './icon-v2'
import { Text } from './text'

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
  return <div className={cn('flex items-center justify-between gap-6', className)}>{children}</div>
}
Root.displayName = 'ListActions.Root'

function Left({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex grow items-center gap-6', className)}>{children}</div>
}

function Right({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex items-center gap-6', className)}>{children}</div>
}

function Dropdown({ title, items, onChange, selectedValue }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex cursor-pointer items-center gap-1.5 text-cn-3 duration-100 ease-in-out hover:text-cn-1">
        {selectedValue && <span className="size-[4px] rounded-full bg-cn-brand"></span>}
        <Text
          className={cn('text-cn-1/80', {
            ['font-bold']: selectedValue
          })}
        >
          {title}
        </Text>
        <IconV2 name="nav-arrow-down" />
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
