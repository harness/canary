import { ReactNode } from 'react'

import { CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@utils/cn'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { Icon } from './icon'
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

function Root({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between gap-6">{children}</div>
}

function Left({ children }: { children: ReactNode }) {
  return <div className="flex grow items-center gap-6">{children}</div>
}

function Right({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-6">{children}</div>
}

function Dropdown({ title, items, onChange, selectedValue }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1.5 text-tertiary-background duration-100 ease-in-out hover:text-primary">
        {selectedValue && <span className="size-[4px] rounded-full bg-primary"></span>}
        <Text
          size={2}
          className={cn('text-primary/80', {
            ['font-bold']: selectedValue
          })}
        >
          {title}
        </Text>
        <Icon name="chevron-down" size={12} className="chevron-down" />
      </DropdownMenuTrigger>
      {items && (
        <DropdownMenuContent align="end">
          {items.map((i, i_idx) => {
            return (
              <DropdownMenuItem className="cursor-pointer" onClick={() => onChange?.(i.value ?? i.name)} key={i_idx}>
                <div className="mr-1 w-4">{Boolean(i.value) && selectedValue === i.value ? <CheckIcon /> : null}</div>
                {i.name}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}

export { Root, Left, Right, Dropdown }
export type { DropdownItemProps, DropdownProps }
