import { ReactNode, useEffect, useState } from 'react'

import { DropdownMenu } from '@components/dropdown-menu'
import { Icon } from '@components/icon'
import { cn } from '@utils/cn'

interface FiltersProps {
  handleRemoveFilter: () => void
  shouldOpen: boolean
  filterLabel: string
  valueLabel?: string
  contentClassName?: string
  children?: ReactNode
}

const FilterBoxWrapper = ({
  handleRemoveFilter,
  shouldOpen,
  children,
  filterLabel,
  valueLabel,
  contentClassName
}: FiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (shouldOpen) {
      setIsOpen(true)
    }
  }, [shouldOpen])

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger className="bg-background-3 hover:bg-background-8 flex h-8 items-center gap-x-3 whitespace-nowrap rounded pl-2.5 pr-2 transition-colors duration-200">
        <div className="text-13 flex items-center gap-x-1.5">
          <span className="text-foreground-1">
            {filterLabel}
            {!!valueLabel && ': '}
          </span>
          <span className="text-foreground-4">{valueLabel}</span>
        </div>
        <Icon className="chevron-down text-icons-1" name="chevron-down" size={10} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className={cn('w-[276px] p-0', contentClassName)} align="start">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex w-full items-center justify-between gap-x-2">
            <div className="flex items-center gap-x-2">
              <span className="text-14 text-foreground-4">{filterLabel}</span>
            </div>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="group flex h-[18px] items-center px-1">
                <Icon
                  className="text-icons-1 group-hover:text-foreground-1 transition-colors duration-200"
                  name="more-dots-fill"
                  size={12}
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="start">
                <DropdownMenu.Item
                  className="text-foreground-4 hover:text-foreground-danger data-[highlighted]:text-foreground-danger duration-200 data-[highlighted]:bg-transparent data-[highlighted]:outline-none"
                  onSelect={() => handleRemoveFilter()}
                >
                  <button className="text-14 flex items-center gap-x-1.5">
                    <Icon name="trash" size={12} />
                    Delete filter
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>

        <div>{children}</div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default FilterBoxWrapper
