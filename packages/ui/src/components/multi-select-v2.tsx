import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { Caption, Command, Label, SkeletonList, Tag } from '@/components'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'
import { CommandList, Command as CommandPrimitive, useCommandState } from 'cmdk'

export interface MultiSelectOption {
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
  setSearchQuery?: (query: string | null) => void
  onChange?: (options: MultiSelectOption[]) => void
  disabled?: boolean
  className?: string
  disallowCreation?: boolean
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command.Root>
  /** Props of `CommandInput` */
  inputProps?: Omit<React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>, 'value' | 'placeholder' | 'disabled'>
  isLoading?: boolean
}

export interface MultiSelectRef {
  selectedValue: MultiSelectOption[]
  input: HTMLInputElement
  focus: () => void
  reset: () => void
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
      inputProps,
      isLoading = false
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
          const newOptions = value?.filter(s => s.key !== option.key) || []
          onChange?.(newOptions)
          option.onReset?.()
        } else {
          const newOptions = selected.filter(s => s.key !== option.key)
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
      if (value) {
        setSelected(value)
      }
    }, [value])

    useEffect(() => {
      if (!arrayOptions || setSearchQuery) {
        return
      }
      setOptions(arrayOptions || [])
    }, [arrayOptions, setSearchQuery])

    const EmptyItem = useCallback(() => {
      if (setSearchQuery && disallowCreation && options.length === 0) {
        return (
          <Command.Item value="-" disabled>
            No results found
          </Command.Item>
        )
      }

      return options.length === 0 ? <CommandEmpty>No results found</CommandEmpty> : undefined
    }, [disallowCreation, setSearchQuery, options.length])

    return (
      <div className="flex flex-col gap-2 max-w-md ">
        <Label className={disabled ? 'text-cn-foreground-disabled' : ''}>{label}</Label>
        <Command.Root
          ref={dropdownRef}
          {...commandProps}
          onKeyDown={e => {
            handleKeyDown(e)
            commandProps?.onKeyDown?.(e)
          }}
          className={cn('h-auto overflow-visible bg-transparent max-w-md', commandProps?.className)}
        >
          <div
            className={cn(
              'min-h-10 rounded-md border border-cn-borders-2 focus-within:shadow-ring-selected focus-within:border-cn-borders-1',
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
            role="textbox"
            tabIndex={disabled ? -1 : 0}
            aria-label={placeholder}
          >
            <div className="relative flex flex-wrap gap-1">
              {(isControlled ? value : selected).map(option => {
                return (
                  <Tag
                    key={option.key}
                    variant="secondary"
                    size="sm"
                    theme={option?.value ? 'purple' : undefined}
                    label={option.key}
                    value={option?.value || ''}
                    showReset={!disabled}
                    onReset={() => handleUnselect(option)}
                    className="cn-background-softgray"
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
                className={cn(
                  'flex-1 bg-transparent outline-none placeholder:text-cn-muted-foreground',
                  {
                    'px-3 py-2': (isControlled ? value : selected).length === 0,
                    'ml-1': (isControlled ? value : selected).length !== 0
                  },
                  inputProps?.className
                )}
              />
            </div>
          </div>
          <div className="relative">
            {open && options?.length > 0 && (
              <CommandList
                className="bg-cn-background-1 text-cn-foreground animate-in absolute top-1 z-10 w-full rounded-md border shadow-md outline-none"
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
                            key={option.key}
                            value={option.value || option.key}
                            disabled={option.disable}
                            onSelect={() => {
                              // This handler works for both mouse clicks and keyboard Enter presses
                              setInputValue('')
                              const newOptions = [...(isControlled ? value : selected), option]
                              if (isControlled) {
                                onChange?.(newOptions)
                              } else {
                                setSelected(newOptions)
                              }
                            }}
                            className={cn(
                              'cursor-pointer',
                              option.disable && 'cursor-default text-cn-muted-foreground'
                            )}
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
        <Caption className={disabled ? 'text-cn-foreground-disabled' : ''}>{caption}</Caption>
      </div>
    )
  }
)

MultiSelect.displayName = 'MultiSelect'
