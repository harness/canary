import { ReactNode, useEffect, useState } from 'react'

import { useTranslation } from '@/context'
import { Button } from '@components/button'
import { DropdownMenu } from '@components/dropdown-menu'
import { IconV2 } from '@components/icon-v2'
import { cn } from '@utils/cn'

interface FiltersProps {
  handleRemoveFilter: () => void
  defaultOpen: boolean
  filterLabel: string
  onOpenChange?: (open: boolean) => void
  valueLabel?: ReactNode
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
  contentClassName
}: FiltersProps) => {
  const { t } = useTranslation()

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
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" className="gap-x-3">
          <div className="flex items-center gap-x-1.5 text-1">
            <span className="text-cn-foreground-1">
              {filterLabel}
              {!!valueLabel && ': '}
            </span>
            <span className="text-cn-foreground-2">{valueLabel}</span>
          </div>
          <IconV2 className="chevron-down text-icons-1" name="nav-arrow-down" size={10} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className={cn('w-[276px]', contentClassName)} align="start">
        <DropdownMenu.Header>{filterLabel}</DropdownMenu.Header>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="group flex h-[18px] items-center px-1">
            <IconV2
              className="text-icons-1 transition-colors duration-200 group-hover:text-cn-foreground-1"
              name="more-horizontal"
              size={12}
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            <DropdownMenu.IconItem
              icon="trash"
              onSelect={handleRemoveFilter}
              title={t('component:filter.delete', 'Delete filter')}
            />
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default FilterBoxWrapper
