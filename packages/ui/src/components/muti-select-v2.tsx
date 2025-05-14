import * as React from 'react'
import { forwardRef, useEffect } from 'react'

import { Button, Command, Icon, SkeletonList, Tag } from '@/components'
import { cn } from '@utils/cn'
import { CommandList, Command as CommandPrimitive, useCommandState } from 'cmdk'

export interface MultiSelectOption {
  key: string
  value?: string
  disable?: boolean
}

interface MultipleSelectorProps {
  value?: MultiSelectOption[]
  defaultValue?: MultiSelectOption[]
  options?: MultiSelectOption[]
  placeholder?: string
  /** async search */
  onSearch?: (value: string) => Promise<MultiSelectOption[]>
  onChange?: (options: MultiSelectOption[]) => void
  /** Limit the maximum number of selected options. */
  maxSelected?: number
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void
  disabled?: boolean
  className?: string

  disallowCreation?: boolean
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command.Root>
  /** Props of `CommandInput` */
  inputProps?: Omit<React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>, 'value' | 'placeholder' | 'disabled'>
}

export interface MultipleSelectorRef {
  selectedValue: MultiSelectOption[]
  input: HTMLInputElement
  focus: () => void
  reset: () => void
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// Simple function to get available options (removing already selected ones)
function getAvailableOptions(
  allOptions: MultiSelectOption[],
  selectedOptions: MultiSelectOption[]
): MultiSelectOption[] {
  if (!allOptions || allOptions.length === 0) return []

  return allOptions.filter(option => !selectedOptions.some(selected => selected.key === option.key))
}

const CommandEmpty = forwardRef<HTMLDivElement, React.ComponentProps<typeof CommandPrimitive.Empty>>(
  ({ className, ...props }, forwardedRef) => {
    const render = useCommandState(state => state.filtered.count === 0)

    if (!render) return null

    return (
      <div
        ref={forwardedRef}
        className={cn('py-6 text-center text-sm', className)}
        data-cmdk-empty=""
        role="presentation"
        {...props}
      />
    )
  }
)

CommandEmpty.displayName = 'CommandEmpty'

export const MultipleSelector = React.forwardRef<MultipleSelectorRef, MultipleSelectorProps>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultValue = [],
      options: arrayOptions,
      onSearch,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      disabled,
      className,
      disallowCreation = false,
      commandProps,
      inputProps
    }: MultipleSelectorProps,
    ref: React.Ref<MultipleSelectorRef>
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [onScrollbar, setOnScrollbar] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null) // Added this

    // Use value for controlled mode, or defaultValue for initial uncontrolled state
    const [selected, setSelected] = React.useState<MultiSelectOption[]>(value || defaultValue || [])
    // Options are the available items to select from
    const [options, setOptions] = React.useState<MultiSelectOption[]>(arrayOptions || [])
    const [inputValue, setInputValue] = React.useState('')
    const debouncedSearchTerm = useDebounce(inputValue, 500)
    const isControlled = !!value

    React.useImperativeHandle(
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

    const handleUnselect = React.useCallback(
      (option: MultiSelectOption) => {
        if (isControlled) {
          const newOptions = value?.filter(s => s.key !== option.key) || []
          onChange?.(newOptions)
        } else {
          const newOptions = selected.filter(s => s.key !== option.key)
          setSelected(newOptions)
        }
      },
      [onChange, selected, isControlled, value]
    )

    const handleKeyDown = React.useCallback(
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
              !options.some(option => option.value === input.value) &&
              !(isControlled ? value : selected).some(s => s.value === input.value)
            ) {
              let newOption: MultiSelectOption

              if (input.value.includes(':')) {
                const [key, value] = input.value.split(':', 2)

                if (key && key.trim()) {
                  newOption = {
                    key: key.trim(),
                    value: value ? value.trim() : ''
                  }
                } else {
                  newOption = {
                    key: input.value
                  }
                }
              } else {
                newOption = {
                  key: input.value
                }
              }
              const newOptions = [...(isControlled ? value : selected), newOption]
              if (isControlled) {
                onChange?.(newOptions)
              } else {
                setSelected(newOptions)
              }
              setInputValue('')
              e.preventDefault() // Prevent default Enter behavior
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
      if (value) {
        setSelected(value)
      }
    }, [value])

    useEffect(() => {
      /** If `onSearch` is provided, do not trigger options updated. */
      if (!arrayOptions || onSearch) {
        return
      }
      setOptions(arrayOptions || [])
    }, [arrayOptions, onSearch])

    useEffect(() => {
      /** async search */

      const doSearch = async () => {
        setIsLoading(true)
        const res = await onSearch?.(debouncedSearchTerm)
        setOptions(res || [])
        setIsLoading(false)
      }

      const exec = async () => {
        if (!onSearch || !open) return

        if (debouncedSearchTerm) {
          await doSearch()
        }
      }

      void exec()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, open])

    const EmptyItem = React.useCallback(() => {
      // For async search that showing emptyIndicator
      if (onSearch && disallowCreation && options.length === 0) {
        return (
          <Command.Item value="-" disabled>
            No results found
          </Command.Item>
        )
      }

      return options.length === 0 ? <CommandEmpty>No results found</CommandEmpty> : undefined
    }, [disallowCreation, onSearch, options.length])

    /** Avoid Creatable Selector freezing or lagging when paste a long string. */
    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter
      }

      if (!disallowCreation) {
        return (value: string, search: string) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1
        }
      }
      // Using default filter in `cmdk`. We don't have to provide it.
      return undefined
    }, [disallowCreation, commandProps?.filter])

    return (
      <Command.Root
        ref={dropdownRef}
        {...commandProps}
        onKeyDown={e => {
          handleKeyDown(e)
          commandProps?.onKeyDown?.(e)
        }}
        className={cn('h-auto overflow-visible bg-transparent', commandProps?.className)}
        shouldFilter={commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch} // When onSearch is provided, we don't want to filter the options. You can still override it.
        filter={commandFilter()}
      >
        <div
          className={cn(
            'min-h-10 rounded-md border border-input text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 md:text-sm',
            {
              'px-3 py-2': (isControlled ? value : selected).length !== 0,
              'cursor-text': !disabled && (isControlled ? value : selected).length !== 0
            },
            className
          )}
          onClick={() => {
            if (disabled) return
            inputRef?.current?.focus()
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (disabled) return
              inputRef?.current?.focus()
            }
          }}
          role="textbox"
          tabIndex={disabled ? -1 : 0}
          aria-label={placeholder}
        >
          <div className="relative flex flex-wrap gap-1">
            {(isControlled ? value : selected).map(option => {
              // If option has key and value, display as Tag with key-value format
              if (option.value) {
                // Use the option's theme or default to blue
                const tagTheme = 'blue'

                return (
                  <Tag
                    key={option.key}
                    variant="secondary"
                    size="sm"
                    theme={tagTheme}
                    label={option.key}
                    value={option.value || ''}
                    showReset={!disabled}
                    onReset={() => handleUnselect(option)}
                  />
                )
              }

              // Otherwise display as regular button
              return (
                <Button
                  key={option.key}
                  size="sm"
                  type="button"
                  variant="outline"
                  className="h-6 py-0 px-2"
                  onClick={e => {
                    e.stopPropagation()
                    handleUnselect(option)
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleUnselect(option)
                    }
                  }}
                  onMouseDown={e => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  {option.key}
                  <Icon name="close" size={10} className="ml-1" />
                </Button>
              )
            })}
            {/* Avoid having the "Search" Icon */}
            <CommandPrimitive.Input
              {...inputProps}
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              onValueChange={value => {
                setInputValue(value)
                inputProps?.onValueChange?.(value)
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
              placeholder={placeholder}
              className={cn(
                'flex-1 bg-transparent outline-none placeholder:text-muted-foreground',
                {
                  'px-3 py-2': (isControlled ? value : selected).length === 0,
                  'ml-1': (isControlled ? value : selected).length !== 0
                },
                inputProps?.className
              )}
            />
            <Button
              onClick={() => {
                if (isControlled) {
                  onChange?.([])
                } else {
                  setSelected([])
                }
              }}
              className={cn('absolute right-0', (disabled || (isControlled ? value : selected).length < 1) && 'hidden')}
              variant="ghost"
              iconOnly
            >
              <Icon name="close" size={10} />
            </Button>
          </div>
        </div>
        <div className="relative">
          {open && (
            <CommandList
              className="bg-popover text-popover-foreground animate-in absolute top-1 z-10 w-full rounded-md border shadow-md outline-none"
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
              ) : (
                <>
                  {EmptyItem()}
                  <Command.Group className="h-full overflow-auto">
                    {getAvailableOptions(options, isControlled ? value : selected).map(option => {
                      return (
                        <Command.Item
                          key={option.value}
                          value={option.value}
                          disabled={option.disable}
                          onMouseDown={e => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onSelect={() => {
                            if ((isControlled ? value : selected).length >= maxSelected) {
                              onMaxSelected?.((isControlled ? value : selected).length)
                              return
                            }
                            setInputValue('')
                            const newOptions = [...(isControlled ? value : selected), option]
                            if (isControlled) {
                              onChange?.(newOptions)
                            } else {
                              setSelected(newOptions)
                            }
                          }}
                          className={cn('cursor-pointer', option.disable && 'cursor-default text-muted-foreground')}
                        >
                          {option.key}
                        </Command.Item>
                      )
                    })}
                  </Command.Group>
                </>
              )}
            </CommandList>
          )}
        </div>
      </Command.Root>
    )
  }
)

MultipleSelector.displayName = 'MultipleSelector'
// export default MultipleSelector
