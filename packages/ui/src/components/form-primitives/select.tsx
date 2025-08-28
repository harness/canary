import {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import {
  CommonInputsProp,
  ControlGroup,
  DropdownMenu,
  FormCaption,
  IconV2,
  Label,
  SearchInput,
  Text
} from '@/components'
import { useTranslation } from '@/context'
import { cn, generateAlphaNumericHash } from '@/utils'
import { cva, VariantProps } from 'class-variance-authority'
import debounce from 'lodash-es/debounce'

const selectVariants = cva('cn-select', {
  variants: {
    theme: {
      default: '',
      danger: 'cn-select-danger',
      warning: 'cn-select-warning'
    },
    size: {
      md: '',
      sm: 'cn-select-sm'
    }
  },
  defaultVariants: {
    theme: 'default',
    size: 'md'
  }
})

type SeparatorOption = '-'

interface ValueOption<T = string> {
  label: string | ReactNode
  value: T
  disabled?: boolean
}

interface GroupOption<T = string> {
  label: string
  options: Array<ValueOption<T> | SeparatorOption>
}

type SelectOption<T = string> = ValueOption<T> | GroupOption<T> | SeparatorOption

type SelectItemType =
  | ReactElement<typeof DropdownMenu.Item>
  | ReactElement<typeof DropdownMenu.AvatarItem>
  | ReactElement<typeof DropdownMenu.IconItem>
  | ReactElement<typeof DropdownMenu.LogoItem>
  | ReactElement<typeof DropdownMenu.IndicatorItem>

interface SelectProps<T = string>
  extends CommonInputsProp,
    Pick<InputHTMLAttributes<HTMLInputElement>, 'id' | 'name' | 'disabled' | 'placeholder'> {
  options: SelectOption<T>[] | (() => Promise<SelectOption<T>[]>)
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  onScrollEnd?: () => void
  isLoading?: boolean
  theme?: VariantProps<typeof selectVariants>['theme']
  size?: VariantProps<typeof selectVariants>['size']
  allowSearch?: boolean
  onSearch?: (query: string) => void
  searchValue?: string
  optionRenderer?: (option: ValueOption<T>) => SelectItemType
  header?: ReactNode
  footer?: ReactNode
  contentWidth?: 'auto' | 'triggerWidth'
  contentClassName?: string
  suffix?: ReactNode
  triggerClassName?: string
}

// Helper function to check option types
const isValueOption = <T,>(option: SelectOption<T>): option is ValueOption<T> => {
  return typeof option === 'object' && 'value' in option
}

const isGroupOption = <T,>(option: SelectOption<T>): option is GroupOption<T> => {
  return typeof option === 'object' && 'options' in option
}

const isSeparatorOption = <T,>(option: SelectOption<T>): option is SeparatorOption => {
  return option === '-'
}

// Helper to get all value options (flattened)
const getAllValueOptions = <T,>(options: SelectOption<T>[]): ValueOption<T>[] => {
  const valueOptions: ValueOption<T>[] = []

  options.forEach(option => {
    if (isValueOption(option)) {
      valueOptions.push(option)
    } else if (isGroupOption(option)) {
      option.options.forEach(subOption => {
        if (isValueOption(subOption)) {
          valueOptions.push(subOption)
        }
      })
    }
  })

  return valueOptions
}

function SelectInner<T = string>(
  {
    options: optionsProp,
    value,
    defaultValue,
    onChange,
    disabled,
    onScrollEnd,
    placeholder: _placeholder,
    isLoading = false,
    id: defaultId,
    name,
    label,
    error,
    warning,
    caption,
    optional,
    allowSearch = false,
    onSearch,
    searchValue,
    optionRenderer,
    header,
    footer,
    contentWidth = 'auto',
    contentClassName,
    suffix,
    triggerClassName,
    wrapperClassName,
    size,
    orientation,
    informerProps,
    informerContent,
    labelSuffix,
    ...props
  }: SelectProps<T>,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [options, setOptions] = useState<SelectOption<T>[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchValue || '')

  const { t } = useTranslation()

  const isHorizontal = orientation === 'horizontal'

  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : internalValue

  const placeholder = _placeholder || t('component:select.placeholder', 'Select an option')

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

  // Get all value options for finding selected option
  const allValueOptions = useMemo(() => getAllValueOptions(options), [options])

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    onSearch?.(debouncedSearchQuery)

    if (!allowSearch || !debouncedSearchQuery.trim()) {
      return options
    }

    // Default search implementation
    const searchLower = debouncedSearchQuery.toLowerCase()

    return options.reduce<SelectOption<T>[]>((acc, option) => {
      if (isSeparatorOption(option)) {
        // Don't include separators in search results
        return acc
      }

      if (isValueOption(option)) {
        const labelText =
          typeof option.label === 'string' ? option.label.toLowerCase() : option.value?.toString().toLowerCase()
        if (labelText?.includes(searchLower)) {
          acc.push(option)
        }
      } else if (isGroupOption(option)) {
        const filteredGroupOptions = option.options.filter(subOption => {
          if (isValueOption(subOption)) {
            const labelText =
              typeof subOption.label === 'string'
                ? subOption.label.toLowerCase()
                : subOption.value?.toString().toLowerCase()
            return labelText?.includes(searchLower)
          }
          return false
        })

        if (filteredGroupOptions.length > 0) {
          acc.push({ ...option, options: filteredGroupOptions } as GroupOption<T>)
        }
      }

      return acc
    }, [])
  }, [allowSearch, debouncedSearchQuery, onSearch, options])

  const selectedOption = allValueOptions.find(option => option.value === selectedValue)

  const hasNoOptions =
    filteredOptions.length === 0 || (filteredOptions.length === 1 && isSeparatorOption(filteredOptions[0]))

  const isNoItems = !isLoadingOptions && !isLoading && hasNoOptions
  const isWithItems = !isLoadingOptions && !hasNoOptions
  const showSpinner = [isLoadingOptions, isLoading].some(Boolean)

  const hiddenInputRef = useRef<HTMLInputElement>(null)

  const handleSelect = useCallback(
    (optionValue: T) => {
      if (!isControlled) {
        setInternalValue(optionValue)
      }
      onChange?.(optionValue)

      if (onChange && hiddenInputRef.current) {
        hiddenInputRef.current.value = String(optionValue)
        const event = new Event('change', { bubbles: true })
        hiddenInputRef.current.dispatchEvent(event)
      }

      setIsOpen(false)
      setSearchQuery('')
    },
    [isControlled, onChange]
  )

  // Render options recursively
  const renderOptions = (options: SelectOption<T>[], level = 0) => {
    return options.map((option, index) => {
      if (isSeparatorOption(option)) {
        return <DropdownMenu.Separator key={`separator-${level}-${index}`} />
      }

      if (isGroupOption(option)) {
        return (
          <DropdownMenu.Group key={`group-${level}-${index}`} label={option.label}>
            {renderOptions(option.options, level + 1)}
          </DropdownMenu.Group>
        )
      }

      if (optionRenderer) {
        const element = optionRenderer(option)

        if (process.env.NODE_ENV === 'development') {
          const isAllowed =
            element.type === DropdownMenu.Item ||
            element.type === DropdownMenu.AvatarItem ||
            element.type === DropdownMenu.IconItem ||
            element.type === DropdownMenu.LogoItem ||
            element.type === DropdownMenu.IndicatorItem

          if (!isAllowed) {
            console.warn(
              `[Select] optionRenderer should return either DropdownMenu.Item, DropdownMenu.AvatarItem,
              DropdownMenu.IconItem, DropdownMenu.LogoItem or DropdownMenu.IndicatorItem`
            )
          }
        }
        return element
      }

      if (isValueOption(option)) {
        return (
          <DropdownMenu.Item
            key={(option.value ?? option.label)?.toString()}
            title={option.label}
            disabled={option.disabled}
            onSelect={() => handleSelect(option.value)}
            checkmark={option.value === selectedValue}
          />
        )
      }

      return null
    })
  }

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    handler()

    return () => {
      handler.cancel()
    }
  }, [searchQuery])

  return (
    <ControlGroup.Root className={wrapperClassName} orientation={orientation}>
      {(!!label || (isHorizontal && !!caption)) && (
        <ControlGroup.LabelWrapper>
          {!!label && (
            <Label
              disabled={disabled}
              optional={optional}
              htmlFor={id}
              suffix={labelSuffix}
              informerProps={informerProps}
              informerContent={informerContent}
            >
              {label}
            </Label>
          )}
          {isHorizontal && !!caption && <FormCaption disabled={disabled}>{caption}</FormCaption>}
        </ControlGroup.LabelWrapper>
      )}

      <ControlGroup.InputWrapper>
        {/* Hidden input for form integration */}
        <input
          ref={hiddenInputRef}
          type="hidden"
          className="sr-only"
          name={name}
          value={String(selectedValue || '')}
          onChange={e => onChange?.(e.target.value as T)}
        />

        <DropdownMenu.Root
          open={isOpen}
          onOpenChange={open => {
            setIsOpen(open)
            if (!open) setSearchQuery('')
          }}
        >
          <DropdownMenu.Trigger
            id={id}
            ref={ref}
            disabled={disabled}
            className={cn(selectVariants({ theme, size }), triggerClassName)}
          >
            <div className="cn-select-trigger">
              <Text color={disabled ? 'disabled' : selectedOption ? 'foreground-1' : 'foreground-2'} truncate as="div">
                {selectedOption ? selectedOption.label : placeholder}
              </Text>
              <IconV2 name="nav-arrow-down" size="xs" className="cn-select-indicator-icon" />
            </div>
            {suffix ? (
              <div
                className="cn-select-suffix"
                // Don't trigger dropdown menu when suffix is clicked
                onPointerDown={e => {
                  e.stopPropagation()
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation()
                  }
                }}
                role="none"
              >
                {suffix}
              </div>
            ) : null}
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            className={cn(
              'cn-select-content',
              { 'max-w-none w-[--radix-dropdown-menu-trigger-width]': contentWidth === 'triggerWidth' },
              contentClassName
            )}
            align="start"
            scrollAreaProps={{ onScrollBottom: onScrollEnd, rootMargin: { bottom: '50px' } }}
          >
            {(allowSearch || header) && (
              <DropdownMenu.Header>
                {allowSearch && (
                  <SearchInput
                    placeholder="Search"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    debounce={false}
                    autoFocus
                    onKeyDown={e => e.stopPropagation()}
                  />
                )}

                {header}
              </DropdownMenu.Header>
            )}

            {isNoItems && (
              <DropdownMenu.NoOptions>
                {searchQuery
                  ? t('component:select.noResults', 'No results found')
                  : t('component:select.noOptions', 'No options available')}
              </DropdownMenu.NoOptions>
            )}

            {isWithItems && renderOptions(filteredOptions)}

            {showSpinner && <DropdownMenu.Spinner />}

            {footer && <DropdownMenu.Footer>{footer}</DropdownMenu.Footer>}
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
        ) : caption && !isHorizontal ? (
          <FormCaption disabled={disabled}>{caption}</FormCaption>
        ) : null}
      </ControlGroup.InputWrapper>
    </ControlGroup.Root>
  )
}

const Select = forwardRef(SelectInner) as <T = string>(
  props: SelectProps<T> & { ref?: ForwardedRef<HTMLButtonElement> }
) => ReturnType<typeof SelectInner>

export {
  Select,
  type SelectItemType,
  type SelectProps,
  type SelectOption,
  type ValueOption as SelectValueOption,
  type GroupOption as SelectGroupOption,
  type SeparatorOption as SelectSeparatorOption
}
