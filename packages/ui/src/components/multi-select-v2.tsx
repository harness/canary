import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { Command, SkeletonList, Tag } from '@/components'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'
import { Command as CommandPrimitive } from 'cmdk'
import { noop } from 'lodash-es'

export interface MultiSelectOption {
  id: string | number
  key: string
  value?: string
  disable?: boolean
  theme?:
    | 'gray'
    | 'blue'
    | 'brown'
    | 'cyan'
    | 'green'
    | 'indigo'
    | 'lime'
    | 'mint'
    | 'orange'
    | 'pink'
    | 'purple'
    | 'red'
    | 'violet'
    | 'yellow'
  onReset?: () => void
}

/**
 * Creates a new MultiSelectOption from an input string
 * Handles both simple values and key:value format
 * @param inputValue The string value entered by the user
 * @returns A properly formatted MultiSelectOption
 */
const createOptionFromInput = (inputValue: string): MultiSelectOption => {
  // Handle key:value format (e.g. "category:frontend")
  if (inputValue.includes(':')) {
    const [key, value] = inputValue.split(':', 2)

    if (key && key.trim()) {
      return {
        key: key.trim(),
        value: value ? value.trim() : '',
        id: inputValue
      }
    }
  }

  // Default case: use input as the key
  return {
    key: inputValue,
    id: inputValue
  }
}

interface MultiSelectProps {
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
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command.Root>
  /** Props of `CommandInput` */
  inputProps?: Omit<React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>, 'value' | 'placeholder' | 'disabled'>
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
      inputProps
    }: MultiSelectProps,
    ref: React.Ref<MultiSelectRef>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const [onScrollbar, setOnScrollbar] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const [selected, setSelected] = useState<MultiSelectOption[]>(value || defaultValue || [])
    const [availableOptions, setAvailableOptions] = useState<MultiSelectOption[]>([])
    const [inputValue, setInputValue] = useState('')
    const { search } = useDebounceSearch({
      handleChangeSearchValue: setSearchQuery,
      searchValue: searchQuery || ''
    })

    const isControlled = !!value

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
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setOpen(false)
          inputRef.current.blur()
        }
      },
      [dropdownRef, inputRef]
    )

    const handleUnselect = useCallback(
      (option: MultiSelectOption) => {
        const newSelectedValues = (isControlled ? value : selected).filter(s => s.id !== option.id)
        onChange?.(newSelectedValues)
        option.onReset?.()
        !isControlled && setSelected(newSelectedValues)
      },
      [onChange, selected, isControlled, value]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current
        if (input) {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            if (input.value === '' && (isControlled ? value?.length : selected.length) > 0) {
              handleUnselect((isControlled ? value : selected).at(-1)!)
            }
          }
          if (e.key === 'Enter' && input.value && !disallowCreation) {
            // Perform case-insensitive comparison to prevent duplicate options with different casing
            // This ensures that 'React' and 'react' would be considered the same option
            if (
              !options?.some(option => option.key.toLowerCase() === input.value.toLowerCase()) &&
              !(isControlled ? value : selected).some(s => s.key.toLowerCase() === input.value.toLowerCase())
            ) {
              const newOption = createOptionFromInput(input.value)
              const newOptions = [...(isControlled ? value : selected), newOption]
              if (isControlled) {
                onChange?.(newOptions)
              } else {
                setSelected(newOptions)
              }
              setInputValue('')
              setSearchQuery?.('')
              e.preventDefault()
            }
          }
          if (e.key === 'Escape') {
            input.blur()
          }
        }
      },
      [handleUnselect, selected, disallowCreation, onChange, options, setInputValue, isControlled, value]
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
      if (!options || options.length === 0) {
        setAvailableOptions([])
        return
      }

      const filteredOptions = options.filter(
        option => !(isControlled ? value : selected)?.some(selectedOption => selectedOption.id === option.id)
      )

      setAvailableOptions(filteredOptions)
    }, [options, selected, isControlled, value, inputValue, searchQuery, open])
    return (
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
            className={cn('cn-multi-select-container', className)}
            onClick={() => {
              if (disabled) return
              inputRef?.current?.focus()
            }}
            onKeyDown={noop}
            role="textbox"
            tabIndex={disabled ? -1 : 0}
            aria-label={placeholder}
          >
            <div className="cn-multi-select-tag-wrapper">
              {(isControlled ? value : selected).map(option => {
                return (
                  <Tag
                    id={String(option.id)}
                    key={option.id}
                    variant="secondary"
                    size="sm"
                    theme={option?.theme}
                    label={option.key}
                    value={option?.value || ''}
                    showReset={!disabled}
                    onReset={() => handleUnselect(option)}
                    disabled={disabled}
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
                placeholder={disabled ? '' : placeholder}
                className={cn('cn-multi-select-input', inputProps?.className)}
              />
            </div>
          </div>
          <div className="relative">
            {open && (
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
                  <SkeletonList />
                ) : availableOptions.length === 0 ? (
                  <Command.Item value="-" disabled>
                    No results found
                  </Command.Item>
                ) : (
                  <Command.Group>
                    {availableOptions.map(option => {
                      return (
                        <Command.Item
                          key={option.id}
                          value={String(option.id)}
                          disabled={option.disable}
                          onSelect={() => {
                            setInputValue('')
                            setSearchQuery?.('')
                            const newSelectedValues = [...(isControlled ? value : selected), option]
                            if (isControlled) {
                              onChange?.(newSelectedValues)
                            } else {
                              onChange?.(newSelectedValues)
                              setSelected(newSelectedValues)
                            }
                          }}
                        >
                          {option.key}
                        </Command.Item>
                      )
                    })}
                  </Command.Group>
                )}
              </Command.List>
            )}
          </div>
        </Command.Root>
      </div>
    )
  }
)

MultiSelect.displayName = 'MultiSelect'
