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
        <Button variant="secondary" size="sm" className="px-2.5 py-1.5">
          <Layout.Grid align="center" columns="auto 1fr" gapX="2xs">
            <Text as="span" color="foreground-1" truncate>
              {filterLabel}
              {!!valueLabel && ': '}
            </Text>
            <Text as="span" truncate>
              {valueLabel}
            </Text>
          </Layout.Grid>
          <IconV2 className="chevron-down text-icons-1" name="nav-arrow-down" size="2xs" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className={cn('w-[276px]', contentClassName)} align="start">
        <DropdownMenu.Header>
          <Layout.Flex align="center" justify="between">
            <Text as="span">{filterLabel}</Text>
            <Button
              iconOnly
              variant="outline"
              size="2xs"
              onClick={handleRemoveFilter}
              aria-label={t('component:filter.delete', 'Delete filter')}
              tooltipProps={{
                content: t('component:filter.delete', 'Delete filter')
              }}
            >
              <IconV2 name="trash" skipSize />
            </Button>
          </Layout.Flex>
        </DropdownMenu.Header>

        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default FilterBoxWrapper
