import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { Caption, Command, Label, Tag } from '@/components'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'
import { Command as CommandPrimitive } from 'cmdk'
import { noop } from 'lodash-es'

export interface MultiSelectOption {
  id: string | number
  key: string
  value?: string
  disable?: boolean
  onReset?: () => void
}

interface MultiSelectProps {
  label?: string
  caption?: string
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
      label,
      caption,
      value,
      onChange,
      placeholder,
      defaultValue = [],
      options: arrayOptions,
      searchQuery,
      setSearchQuery,
      disabled,
      className,
      disallowCreation = false,
      commandProps,
      inputProps
    }: MultiSelectProps,
    ref: React.Ref<MultiSelectRef>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const [onScrollbar, setOnScrollbar] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null) // Added this

    const [selected, setSelected] = useState<MultiSelectOption[]>(value || defaultValue || [])
    const [options, setOptions] = useState<MultiSelectOption[]>(arrayOptions || [])
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

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
        inputRef.current.blur()
      }
    }

    const handleUnselect = useCallback(
      (option: MultiSelectOption) => {
        if (isControlled) {
          const newOptions = value?.filter(s => s.id !== option.id) || []
          onChange?.(newOptions)
          option.onReset?.()
        } else {
          const newOptions = selected.filter(s => s.id !== option.id)
          setSelected(newOptions)
          option.onReset?.()
        }
      },
      [onChange, selected, isControlled, value]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current
        if (input) {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            if (input.value === '' && (isControlled ? value?.length : selected.length) > 0) {
              handleUnselect((isControlled ? value : selected)[(isControlled ? value : selected).length - 1])
            }
          }
          if (e.key === 'Enter' && input.value && !disallowCreation) {
            if (
              !options.some(option => option.key.toLowerCase() === input.value.toLowerCase()) &&
              !(isControlled ? value : selected).some(s => s.key.toLowerCase() === input.value.toLowerCase())
            ) {
              let newOption: MultiSelectOption

              if (input.value.includes(':')) {
                const [key, value] = input.value.split(':', 2)

                if (key && key.trim()) {
                  newOption = {
                    key: key.trim(),
                    value: value ? value.trim() : '',
                    id: input.value
                  }
                } else {
                  newOption = {
                    key: input.value,
                    id: input.value
                  }
                }
              } else {
                newOption = {
                  key: input.value,
                  id: input.value
                }
              }
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
    }, [open])

    useEffect(() => {
      setOptions(arrayOptions ?? [])
    }, [arrayOptions])

    const [availableOptions, setAvailableOptions] = useState<MultiSelectOption[]>([])

    useEffect(() => {
      if (!options || options.length === 0) {
        setAvailableOptions([])
        return
      }

      const filteredOptions = options.filter(option =>
        isControlled
          ? !value?.some(selectedOption => selectedOption.id === option.id)
          : !selected?.some(selectedOption => selectedOption.id === option.id)
      )

      setAvailableOptions(filteredOptions)
    }, [options, selected, isControlled, value, inputValue, searchQuery, open])
    return (
      <div className="cn-multi-select-outer-container">
        <Label disabled={disabled}>{label}</Label>
        <Command.Root
          ref={dropdownRef}
          {...commandProps}
          onKeyDown={e => {
            handleKeyDown(e)
            commandProps?.onKeyDown?.(e)
          }}
          // filter={(_value, _search) => {
          //   return 1
          // }}
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
                    theme={option?.value ? 'purple' : undefined}
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
                {availableOptions.length === 0 ? (
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
                            const newOptions = [...(isControlled ? value : selected), option]
                            if (isControlled) {
                              onChange?.(newOptions)
                            } else {
                              setSelected(newOptions)
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
        <Caption className={disabled ? 'text-cn-foreground-disabled' : ''}>{caption}</Caption>
      </div>
    )
  }
)

MultiSelect.displayName = 'MultiSelect'
