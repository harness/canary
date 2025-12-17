import {
  ComponentPropsWithoutRef,
  forwardRef,
  KeyboardEvent,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'

import {
  Command,
  CommonInputsProp,
  ControlGroup,
  FormCaption,
  IconV2,
  IconV2NamesType,
  Label,
  Layout,
  Skeleton,
  Tag
} from '@/components'
import { generateAlphaNumericHash } from '@/utils'
import { csvToObject } from '@/utils/stringUtils'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'
import { Command as CommandPrimitive } from 'cmdk'
import { noop } from 'lodash-es'

const multiSelectVariants = cva('cn-multi-select-container', {
  variants: {
    theme: {
      default: '',
      danger: 'cn-multi-select-danger',
      warning: 'cn-multi-select-warning'
    }
  },
  defaultVariants: {
    theme: 'default'
  }
})

export interface MultiSelectOption {
  id: string | number
  key: string
  value?: string
  icon?: IconV2NamesType
  title?: string
  disable?: boolean
  theme?:
  | 'gray'
  | 'blue'
  | 'brown'
  | 'cyan'
  | 'green'
  | 'indigo'
  | 'mint'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'violet'
  | 'yellow'
  onReset?: () => void
}

export interface MultiSelectProps extends CommonInputsProp {
  value?: MultiSelectOption[]
  defaultValue?: MultiSelectOption[]
  options?: MultiSelectOption[]
  placeholder?: string
  searchQuery?: string | null
  setSearchQuery?: (query: string) => void
  onChange?: (options: MultiSelectOption[]) => void
  disabled?: boolean
  className?: string
  disallowCreation?: boolean
  isLoading?: boolean
  theme?: VariantProps<typeof multiSelectVariants>['theme']
  /** Props of `Command` */
  commandProps?: ComponentPropsWithoutRef<typeof Command.Root>
  /** Props of `CommandInput` */
  inputProps?: Omit<ComponentPropsWithoutRef<typeof CommandPrimitive.Input>, 'value' | 'placeholder' | 'disabled'>
}

export interface MultiSelectRef {
  selectedValue: MultiSelectOption[]
  input: HTMLInputElement
  focus: () => void
  reset: () => void
}

export const MultiSelect = forwardRef<MultiSelectRef, MultiSelectProps>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultValue = [],
      options,
      searchQuery,
      setSearchQuery,
      disabled,
      className,
      disallowCreation = false,
      isLoading = false,
      commandProps,
      inputProps,
      theme: themeProp,
      label,
      error,
      warning,
      caption,
      optional,
      wrapperClassName,
      orientation,
      tooltipProps,
      tooltipContent,
      labelSuffix
    }: MultiSelectProps,
    ref: Ref<MultiSelectRef>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const [onScrollbar, setOnScrollbar] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const [selected, setSelected] = useState<MultiSelectOption[]>(value || defaultValue || [])
    const [availableOptions, setAvailableOptions] = useState<MultiSelectOption[] | null>(null)
    const [inputValue, setInputValue] = useState('')
    const { search } = useDebounceSearch({
      handleChangeSearchValue: setSearchQuery,
      searchValue: searchQuery || ''
    })

    const isControlled = !!value
    const isHorizontal = orientation === 'horizontal'
    const theme = error ? 'danger' : warning ? 'warning' : themeProp

    const id = useMemo(() => inputProps?.id || `multi-select-${generateAlphaNumericHash(10)}`, [inputProps?.id])

    // Helper function to get the current selected options based on controlled/uncontrolled state
    const getSelectedOptions = useCallback(() => {
      return isControlled ? value : selected
    }, [isControlled, value, selected])

    useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef?.current?.focus(),
        reset: () => setSelected([])
      }),
      [selected]
    )

    const handleClickOutside = useCallback(
      (event: MouseEvent | TouchEvent) => {
        const path = event.composedPath()
        const clickedInsideDropdown = dropdownRef.current && path.includes(dropdownRef.current)
        const clickedInsideInput = inputRef.current && path.includes(inputRef.current)

        if (!clickedInsideDropdown && !clickedInsideInput) {
          setOpen(false)
          inputRef.current?.blur()
        }
      },
      [dropdownRef, inputRef]
    )

    const handleUnselect = useCallback(
      (option: MultiSelectOption) => {
        const newSelectedValues = getSelectedOptions().filter(s => s.id !== option.id)
        onChange?.(newSelectedValues)
        option.onReset?.()
        !isControlled && setSelected(newSelectedValues)
      },
      [onChange, getSelectedOptions, isControlled]
    )

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current
        if (input) {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            if (input.value === '' && getSelectedOptions()?.length > 0) {
              handleUnselect(getSelectedOptions().at(-1)!)
            }
          }
          if (e.key === 'Enter' && input.value && !disallowCreation) {
            const inputValue = input.value.trim()
            // Handle comma-separated input or single option
            const { data: csvData, metadata: csvMetadata } = csvToObject(inputValue)
            const updatedOptions = getSelectedOptions()

            // Process each key-value pair from the CSV object
            for (const [key, value] of Object.entries(csvData)) {
              const wasKeyValuePair = csvMetadata[key] // Use metadata from csvToObject
              const newOption = {
                key,
                value: wasKeyValuePair ? value : undefined, // Set value only for genuine key:value pairs
                id: wasKeyValuePair ? `${key}:${value}` : key
              }

              const existingIndex = updatedOptions.findIndex(option => option.key === newOption.key)

              if (existingIndex !== -1) {
                // Replace existing option
                updatedOptions[existingIndex] = newOption
              } else {
                // Add new option
                updatedOptions.push(newOption)
              }
            }

            // Update state and clear input
            if (isControlled) {
              onChange?.(updatedOptions)
            } else {
              setSelected(updatedOptions)
            }
            setInputValue('')
            setSearchQuery?.('')
            e.preventDefault()
          }
          if (e.key === 'Escape') {
            input.blur()
          }
        }
      },
      [disallowCreation, getSelectedOptions, handleUnselect, availableOptions, isControlled, setSearchQuery, onChange]
    )

    useEffect(() => {
      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchend', handleClickOutside)
      } else {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchend', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchend', handleClickOutside)
      }
    }, [open, handleClickOutside])

    useEffect(() => {
      if (!options) {
        setAvailableOptions(null)
      } else if (options.length === 0) {
        setAvailableOptions([])
        return
      }

      let filteredOptions = options?.filter(
        option => !getSelectedOptions()?.some(selectedOption => selectedOption.id === option.id)
      )

      if (!setSearchQuery && inputValue) {
        const lowerCaseInput = inputValue.toLowerCase()
        filteredOptions = filteredOptions?.filter(option => option.key.toLowerCase().includes(lowerCaseInput))
      }

      setAvailableOptions(filteredOptions || null)
    }, [options, getSelectedOptions, inputValue, searchQuery, open, setSearchQuery])

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
                tooltipProps={tooltipProps}
                tooltipContent={tooltipContent}
              >
                {label}
              </Label>
            )}
            {isHorizontal && !!caption && <FormCaption disabled={disabled}>{caption}</FormCaption>}
          </ControlGroup.LabelWrapper>
        )}
        <ControlGroup.InputWrapper>
          <div className="cn-multi-select-outer-container">
            <Command.Root
              ref={dropdownRef}
              {...commandProps}
              onKeyDown={e => {
                handleKeyDown(e)
                commandProps?.onKeyDown?.(e)
              }}
              shouldFilter={false}
              className={cn('h-auto overflow-visible bg-transparent', commandProps?.className)}
            >
              <div
                className={cn(multiSelectVariants({ theme }), className)}
                onClick={() => {
                  if (disabled) return
                  inputRef?.current?.focus()
                }}
                onKeyDown={noop}
                role="textbox"
                tabIndex={-1}
                aria-label={placeholder}
              >
                <div className="cn-multi-select-tag-wrapper">
                  {getSelectedOptions().map(option => {
                    return (
                      <Tag
                        id={String(option.id)}
                        key={option.id}
                        variant="secondary"
                        size="sm"
                        theme={option?.theme}
                        label={option.key}
                        value={option?.value || ''}
                        actionIcon={disabled ? undefined : 'xmark'}
                        onActionClick={() => handleUnselect(option)}
                        disabled={disabled}
                        title={option.title}
                        icon={option.icon}
                      />
                    )
                  })}
                  <CommandPrimitive.Input
                    {...inputProps}
                    ref={inputRef}
                    value={setSearchQuery ? search : inputValue}
                    disabled={disabled}
                    onValueChange={value => {
                      setInputValue(value)
                      inputProps?.onValueChange?.(value)
                      setSearchQuery?.(value)
                    }}
                    onBlur={event => {
                      if (!onScrollbar) {
                        setOpen(false)
                      }
                      inputProps?.onBlur?.(event)
                    }}
                    onFocus={event => {
                      setOpen(true)
                      inputProps?.onFocus?.(event)
                    }}
                    placeholder={disabled || getSelectedOptions().length > 0 ? '' : placeholder}
                    className={cn('cn-multi-select-input', inputProps?.className)}
                    asChild
                  >
                    <input id={id} />
                  </CommandPrimitive.Input>
                </div>
              </div>
              <div className="relative">
                {open && availableOptions && (
                  <Command.List
                    className="cn-multi-select-dropdown"
                    onMouseLeave={() => {
                      setOnScrollbar(false)
                    }}
                    onMouseEnter={() => {
                      setOnScrollbar(true)
                    }}
                    onMouseUp={() => {
                      inputRef?.current?.focus()
                    }}
                  >
                    {isLoading ? (
                      <Skeleton.List />
                    ) : availableOptions?.length === 0 ? (
                      disallowCreation ? (
                        <Command.Item value="-" disabled>
                          No results found
                        </Command.Item>
                      ) : (
                        <Command.Item value="-" disabled>
                          Press Enter to create
                        </Command.Item>
                      )
                    ) : (
                      <Command.Group>
                        {availableOptions?.map(option => (
                          <Command.Item
                            key={option.id}
                            value={String(option.id)}
                            disabled={option.disable}
                            title={option.title}
                            onSelect={() => {
                              setInputValue('')
                              setSearchQuery?.('')
                              const newSelectedValues = [...getSelectedOptions(), option]
                              if (isControlled) {
                                onChange?.(newSelectedValues)
                              } else {
                                onChange?.(newSelectedValues)
                                setSelected(newSelectedValues)
                              }
                            }}
                          >
                            <Layout.Flex align="center" gap="xs">
                              {option.icon && <IconV2 name={option.icon} />}
                              {option.key}
                            </Layout.Flex>
                          </Command.Item>
                        ))}
                      </Command.Group>
                    )}
                  </Command.List>
                )}
              </div>
            </Command.Root>
          </div>

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
)

MultiSelect.displayName = 'MultiSelect'
