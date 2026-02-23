import { ChangeEvent, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@components/button'
import { IconV2 } from '@components/icon-v2'
import { Layout } from '@components/layout'
import { cn } from '@utils/cn'
import { useMergeRefs } from '@utils/mergeUtils'
import { debounce as debounceFn } from 'lodash-es'

import { BaseInput, InputProps } from './base-input'

// Custom onChange handler for search that works with strings instead of events
export interface SearchInputProps extends Omit<InputProps, 'type' | 'onChange' | 'label'> {
  searchValue?: string
  onChange?: (value: string) => void
  debounce?: number | boolean
  onEnter?: (text: string, reverse?: boolean) => void
  onPrev?: (text: string) => void
  onNext?: (text: string) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  showPrevNextButtons?: boolean
  counter?: string
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      placeholder = 'Search',
      className,
      debounce = true,
      onChange,
      prefix: prefixProp,
      suffix,
      onEnter,
      onPrev,
      onNext,
      onKeyDown,
      showPrevNextButtons,
      counter,
      searchValue,
      // Exclude value and defaultValue since this component manages its own internal value state.
      // Consumers should use searchValue prop instead.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: _value,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      defaultValue: _defaultValue,
      ...props
    },
    ref
  ) => {
    // Use searchValue if provided, fall back to defaultValue for backwards compatibility, then empty string
    const initialValue = searchValue ?? (typeof _defaultValue === 'string' ? _defaultValue : '')
    const [value, setValue] = useState(initialValue)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const mergedRef = useMergeRefs<HTMLInputElement>([
      node => {
        if (!node) return
        inputRef.current = node
      },
      ref
    ])

    const prefix = prefixProp ?? (
      <div className="ml-cn-3xs grid w-8 shrink-0 place-items-center border-r-0">
        <IconV2 name="search" size="sm" />
      </div>
    )

    const effectiveDebounce = useMemo(() => {
      if (debounce === true) {
        return 300
      }
      return debounce ?? 300
    }, [debounce])

    const effectiveDebounceDuration = useMemo(() => {
      return typeof effectiveDebounce === 'number' ? effectiveDebounce : 300
    }, [effectiveDebounce])

    const debouncedOnChangeRef = useRef(
      debounceFn((value: string) => {
        onChange?.(value)
      }, effectiveDebounceDuration)
    )

    // Clean up debounced function on unmount
    useEffect(() => {
      const debouncedFn = debouncedOnChangeRef.current
      return () => {
        debouncedFn.cancel()
      }
    }, [])

    useEffect(() => {
      if (searchValue !== undefined) {
        setValue(searchValue)
      }
    }, [searchValue])

    // Handle input change
    const handleInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setValue(newValue)
        if (effectiveDebounce) {
          debouncedOnChangeRef.current(newValue)
        } else {
          onChange?.(newValue)
        }
      },
      [effectiveDebounce, onChange]
    )

    // Handle key down (Enter key detection)
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event)

        if (event.key === 'Enter') {
          onEnter?.(event.currentTarget.value, !!event.shiftKey)
        }
      },
      [onKeyDown, onEnter]
    )

    // Handle previous button click
    const handlePrev = useCallback(() => {
      if (inputRef.current?.value) {
        if (onPrev) {
          onPrev(inputRef.current.value)
        } else {
          onEnter?.(inputRef.current.value, true)
        }
      }
    }, [onPrev, onEnter])

    // Handle next button click
    const handleNext = useCallback(() => {
      if (inputRef.current?.value) {
        if (onNext) {
          onNext(inputRef.current.value)
        } else {
          onEnter?.(inputRef.current.value, false)
        }
      }
    }, [onNext, onEnter])

    // Handle clear button click
    const handleClear = useCallback(() => {
      setValue('')
      inputRef.current?.focus()
      onChange?.('')
      // Cancel any pending debounced onChange
      debouncedOnChangeRef.current.cancel()
    }, [onChange])

    // Create navigation buttons element
    const navigationButtons = (
      <Layout.Horizontal className="px-cn-2xs" align="center" gap="3xs">
        <Button
          size="xs"
          variant="ghost"
          rounded
          iconOnly
          onClick={handlePrev}
          aria-label="Previous match"
          ignoreIconOnlyTooltip
        >
          <IconV2 name="nav-arrow-up" size="xs" />
        </Button>
        <Button
          size="xs"
          variant="ghost"
          rounded
          iconOnly
          onClick={handleNext}
          aria-label="Next match"
          ignoreIconOnlyTooltip
        >
          <IconV2 name="nav-arrow-down" size="xs" />
        </Button>
        <Button
          size="xs"
          variant="ghost"
          rounded
          iconOnly
          onClick={handleClear}
          aria-label="Clear search"
          ignoreIconOnlyTooltip
        >
          <IconV2 name="xmark" size="xs" />
        </Button>
      </Layout.Horizontal>
    )

    // Determine which suffix to show based on conditions
    const shouldShowNavigationButtons = showPrevNextButtons && value.length > 0
    const effectiveSuffix = shouldShowNavigationButtons ? navigationButtons : suffix

    return (
      <>
        <BaseInput
          type="text"
          ref={mergedRef}
          className={cn('cn-input-search', className)}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          prefix={prefix}
          suffix={effectiveSuffix}
          leadingSuffix={counter}
          placeholder={placeholder}
          value={value}
          {...props}
        />
        {/* NOTE: The hidden input below is required to prevent password managers from populating
                  the search field above. Previously this was happening when a user would use
                  their password manager to auto-populate something in a drawer form, e.g. entering
                  Secret Text. The password manager would find the search field above and assume
                  that was the matching username field. Traditionally this was prevented by using
                  autocomplete="off" but password managers have begun ignoring that property. Adding
                  a second hidden input confuses the password managers and prevents them from trying
                  to populate either of the two inputs with a username. Hacky, but this seems to be
                  the accepted solution for now.
         */}
        <input type="text" autoComplete="off" style={{ display: 'none' }} />
      </>
    )
  }
)

SearchInput.displayName = 'SearchInput'

export { SearchInput }
