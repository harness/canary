import { cn } from '@/lib/utils'
import { CheckIcon } from '@radix-ui/react-icons'

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

function Root({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-6">{children}</div>
}

function Left({ children }: { children: React.ReactNode }) {
  return <div className="flex grow items-center gap-6">{children}</div>
}

function Right({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-6">{children}</div>
}

function Dropdown({ title, items, onChange, selectedValue }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-tertiary-background hover:text-primary flex cursor-pointer items-center gap-1.5 duration-100 ease-in-out">
        {selectedValue && <span className="bg-primary size-[4px] rounded-full"></span>}
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

/**
 * @deprecated
 */
export { Root, Left, Right, Dropdown }

/**
 * @deprecated
 */
export type { DropdownItemProps, DropdownProps }
