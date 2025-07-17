import { ReactNode, useEffect } from 'react'

import { useTranslation } from '@/context'
import { Button } from '@components/button'
import { DropdownMenu } from '@components/dropdown-menu'
import { IconV2 } from '@components/icon-v2'
import { Layout } from '@components/layout'
import { Text } from '@components/text'
import { cn } from '@utils/cn'

interface FiltersProps {
  handleRemoveFilter: () => void
  defaultOpen: boolean
  filterLabel: string
  onOpenChange?: (open: boolean) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  valueLabel?: ReactNode
  contentClassName?: string
  children?: ReactNode
}

const FilterBoxWrapper = ({
  handleRemoveFilter,
  defaultOpen,
  children,
  filterLabel,
  isOpen,
  setIsOpen,
  valueLabel,
  onOpenChange,
  contentClassName
}: FiltersProps) => {
  const { t } = useTranslation()

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
      defaultOpen={defaultOpen}
      onOpenChange={open => {
        setIsOpen(open)
        onOpenChange?.(open)
      }}
    >
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" className="gap-x-3">
          <div className="flex items-center gap-x-1.5 text-1">
            <Text as="span" color="foreground-1">
              {filterLabel}
              {!!valueLabel && ': '}
            </Text>
            <Text as="span">{valueLabel}</Text>
          </div>
          <IconV2 className="chevron-down text-icons-1" name="nav-arrow-down" size="2xs" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className={cn('w-[276px]', contentClassName)} align="start">
        <DropdownMenu.Header>
          <Layout.Flex align="center" justify="between">
            <Text as="span">{filterLabel}</Text>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="group flex h-[18px] items-center px-1">
                <IconV2
                  className="text-icons-1 transition-colors duration-200 group-hover:text-cn-foreground-1"
                  name="more-horizontal"
                  size="2xs"
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
          </Layout.Flex>
        </DropdownMenu.Header>

        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default FilterBoxWrapper
