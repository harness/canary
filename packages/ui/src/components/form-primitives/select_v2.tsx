import { ReactNode, UIEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { ControlGroup, FormCaption, Label } from '@/components'
import { generateAlphaNumericHash } from '@/utils'
import { DropdownMenu } from '@components/dropdown-menu'
import { Icon } from '@components/icon'
import { Input } from '@components/input'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

const selectVariants = cva('cn-select', {
  variants: {
    theme: {
      default: '',
      danger: 'cn-select-danger',
      warning: 'cn-select-warning'
    }
  },
  defaultVariants: {
    theme: 'default'
  }
})

interface SelectOption<T = string> {
  label: string | ReactNode
  value: T
  disabled?: boolean
}

export interface SelectV2Props<T = string> {
  options: SelectOption<T>[] | (() => Promise<SelectOption<T>[]>)
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  disabled?: boolean
  onScrollEnd?: () => void
  placeholder?: string
  className?: string
  isLoading?: boolean
  id?: string
  label?: string
  theme?: VariantProps<typeof selectVariants>['theme']
  caption?: string
  error?: string
  warning?: string
  optional?: boolean
  optionRenderer?: (option: SelectOption<T>) => React.ReactElement
  allowSearch?: boolean
  onSearch?: (query: string) => SelectOption<T>[]
}

export function SelectV2<T = string>({
  options: optionsProp,
  value,
  defaultValue,
  onChange,
  disabled,
  onScrollEnd,
  placeholder = 'Select an option',
  className,
  isLoading = false,
  id: defaultId,
  label,
  error,
  warning,
  caption,
  optional,
  optionRenderer,
  allowSearch = false,
  onSearch,
  ...props
}: SelectV2Props<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue)
  const [options, setOptions] = useState<SelectOption<T>[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : internalValue

  const theme = error ? 'danger' : warning ? 'warning' : props.theme

  const id = useMemo(() => defaultId || `select-${generateAlphaNumericHash(10)}`, [defaultId])

  // Load options if they're a function
  useEffect(() => {
    if (typeof optionsProp === 'function') {
      setIsLoadingOptions(true)
      optionsProp()
        .then(loadedOptions => {
          setOptions(loadedOptions)
          setIsLoadingOptions(false)
        })
        .catch(() => {
          setIsLoadingOptions(false)
        })
    } else {
      setOptions(optionsProp)
    }
  }, [optionsProp])

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!allowSearch || !searchQuery.trim()) {
      return options
    }

    if (onSearch) {
      return onSearch(searchQuery)
    }

    // Default search implementation
    return options.filter(option => {
      const labelText =
        typeof option.label === 'string' ? option.label.toLowerCase() : option.value?.toString().toLowerCase()
      return labelText?.includes(searchQuery.toLowerCase())
    })
  }, [options, searchQuery, allowSearch, onSearch])

  const selectedOption = options.find(option => option.value === selectedValue)

  const isItemsLoading = isLoadingOptions || (isLoading && filteredOptions.length === 0)
  const isNoItems = !isLoadingOptions && !isLoading && filteredOptions.length === 0
  const isWithItems = !isLoadingOptions && filteredOptions.length !== 0
  const isLoadingMoreItems = (isLoading || isLoadingMore) && filteredOptions.length > 0

  const handleSelect = useCallback(
    (optionValue: T) => {
      if (!isControlled) {
        setInternalValue(optionValue)
      }
      onChange?.(optionValue)
      setIsOpen(false)
      setSearchQuery('')
    },
    [isControlled, onChange]
  )

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      if (!onScrollEnd || isLoadingMore) return

      const element = event.currentTarget
      const threshold = 50
      const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < threshold

      if (isNearBottom) {
        setIsLoadingMore(true)
        onScrollEnd()
        // Reset loading state after a delay (parent should handle this)
        setTimeout(() => setIsLoadingMore(false), 100)
      }
    },
    [onScrollEnd, isLoadingMore]
  )

  const renderOption = useCallback(
    (option: SelectOption<T>) => {
      if (optionRenderer) {
        return optionRenderer(option)
      }
      return <>{option.label}</>
    },
    [optionRenderer]
  )

  return (
    <ControlGroup>
      {label && (
        <Label disabled={disabled} optional={optional} htmlFor={id}>
          {label}
        </Label>
      )}

      <DropdownMenu.Root
        open={isOpen}
        onOpenChange={open => {
          setIsOpen(open)
          if (!open) setSearchQuery('')
        }}
      >
        <DropdownMenu.Trigger id={id} className={cn(selectVariants({ theme }), className)} disabled={disabled}>
          <span className={cn('cn-select-value', { 'cn-select-placeholder': !selectedOption })}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <Icon name="chevron-down" size={14} className="cn-select-indicator-icon" />
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className="w-[--radix-dropdown-menu-trigger-width]" align="start" onScroll={handleScroll}>
          {allowSearch && (
            <DropdownMenu.Header>
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="cn-select-search"
                autoFocus
              />
            </DropdownMenu.Header>
          )}

          {isItemsLoading && <DropdownMenu.Spinner />}

          {isNoItems && (
            <DropdownMenu.NoOptions>{searchQuery ? 'No results found' : 'No options available'}</DropdownMenu.NoOptions>
          )}

          {isWithItems &&
            filteredOptions.map((option, index) => (
              <DropdownMenu.Item
                key={index}
                title={option.label}
                disabled={option.disabled}
                onSelect={() => handleSelect(option.value)}
                checkmark={option.value === selectedValue}
              >
                {renderOption(option)}
              </DropdownMenu.Item>
            ))}

          {isLoadingMoreItems && <DropdownMenu.Spinner />}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {error ? (
        <FormCaption disabled={disabled} theme="danger">
          {error}
        </FormCaption>
      ) : warning ? (
        <FormCaption disabled={disabled} theme="warning">
          {warning}
        </FormCaption>
      ) : caption ? (
        <FormCaption disabled={disabled}>{caption}</FormCaption>
      ) : null}
    </ControlGroup>
  )
}
