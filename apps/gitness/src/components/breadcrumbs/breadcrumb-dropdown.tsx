import { Link } from 'react-router-dom'

import {
  BreadcrumbItem,
  BreadcrumbLink,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon
} from '@harnessio/canary'

export interface BreadcrumbDropdownProps {
  items: { path: string; label: string; value: string | number; key: string }[]
  selectedValue?: string | number
  selectedItem?: { path: string; label: string; value: string | number; key: string }
  placeholder?: string
}

export const BreadcrumbDropdown = (props: BreadcrumbDropdownProps) => {
  const { items, selectedValue, selectedItem: selectedItemProps, placeholder = 'Select item' } = props
  const selectedItem = selectedItemProps ?? items.find(item => item.value === selectedValue)

  return (
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger className="group flex items-center gap-2 outline-none">
          <BreadcrumbLink asChild className={'flex items-center gap-x-1'}>
            {selectedItem ? (
              <Link to={selectedItem.path}>
                {selectedItem.label} <Icon name="chevron-down" size={10} />
              </Link>
            ) : (
              <>
                {placeholder} <Icon name="chevron-down" size={10} />
              </>
            )}
          </BreadcrumbLink>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="mt-1.5">
          <>
            {items.map(item => {
              const isSelected = item.value === selectedItem?.value
              return (
                <DropdownMenuItem key={item.value} asChild>
                  <Link to={item.path}>
                    <div className="mr-1 w-4">{isSelected && <Icon name="tick" size={12} />}</div>
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  )
}
