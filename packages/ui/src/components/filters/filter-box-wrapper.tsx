import { ReactNode, useEffect, useState } from 'react'

import { Button } from '@components/button'
import { DropdownMenu } from '@components/dropdown-menu'
import { Icon } from '@components/icon'
import { cn } from '@utils/cn'
import { TFunction } from 'i18next'

interface FiltersProps {
  handleRemoveFilter: () => void
  defaultOpen: boolean
  filterLabel: string
  t: TFunction
  onOpenChange?: (open: boolean) => void
  valueLabel?: string
  contentClassName?: string
  children?: ReactNode
}

const FilterBoxWrapper = ({
  handleRemoveFilter,
  defaultOpen,
  children,
  filterLabel,
  valueLabel,
  onOpenChange,
  contentClassName,
  t
}: FiltersProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  useEffect(() => {
    // If the filter-box is open by default
    // Manually triggering the open change
    if (defaultOpen) {
      onOpenChange?.(true)
    }
  }, [])

  return (
    <DropdownMenu.Root
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open)
        onOpenChange?.(open)
      }}
    >
      {/* className="flex h-8 items-center gap-x-3 whitespace-nowrap rounded bg-background-3 pl-2.5 pr-2 transition-colors duration-200 hover:bg-background-8" */}
      <DropdownMenu.Trigger asChild>
        <Button className="bg-background-3 hover:bg-background-8 gap-x-3 pl-2.5 pr-2">
          <div className="flex items-center gap-x-1.5 text-13">
            <span className="text-foreground-1">
              {filterLabel}
              {!!valueLabel && ': '}
            </span>
            <span className="text-foreground-4">{valueLabel}</span>
          </div>
          <Icon className="chevron-down text-icons-1" name="chevron-down" size={10} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className={cn('w-[276px] p-0', contentClassName)} align="start">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="text-foreground-4 flex items-center gap-x-2">{filterLabel}</div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="group flex h-[18px] items-center px-1">
              <Icon
                className="text-icons-1 transition-colors duration-200 group-hover:text-foreground-1"
                name="more-dots-fill"
                size={12}
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
              <DropdownMenu.Item onSelect={() => handleRemoveFilter()} asChild>
                <Button
                  size="xs"
                  variant="custom"
                  className="data-[highlighted]:text-foreground-danger data-[highlighted]:bg-background-transparent gap-x-1.5"
                >
                  <Icon name="trash" size={12} />
                  {t('component:filter.delete', 'Delete filter')}
                </Button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        <section id="dropdown-filter-field">{children}</section>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default FilterBoxWrapper
