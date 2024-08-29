import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { Text } from './text'
import { Icon } from './icon'

interface DropdownProps {
  title: string
  items: {
    name: string
  }[]
}

function Root({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-6 justify-between">{children}</div>
}

function Left({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-grow gap-6 items-center">{children}</div>
}

function Right({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-6 items-center">{children}</div>
}

function Dropdown({ title, items }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center text-tertiary-background gap-1.5 hover:text-primary cursor-pointer ease-in-out duration-100">
        <Text size={2} className="text-primary/80">
          {title}
        </Text>
        <Icon name="chevron-down" size={12} />
      </DropdownMenuTrigger>
      {items && (
        <DropdownMenuContent align="end">
          {items.map((i, i_idx) => {
            return <DropdownMenuItem key={i_idx}>{i.name}</DropdownMenuItem>
          })}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}

export { Root, Left, Right, Dropdown }
