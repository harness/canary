import { ChangeEvent, forwardRef, useCallback, useEffect, useMemo, useRef } from 'react'

import { Icon } from '@components/icon'
import { cn } from '@utils/cn'
import { debounce as debounceFn } from 'lodash-es'

import { BaseInput, InputProps } from './base-input'

// Custom onChange handler for search that works with strings instead of events
export interface SearchInputProps extends Omit<InputProps, 'type' | 'onChange' | 'label' | 'prefix'> {
  onChange?: (value: string) => void
  debounce?: number | boolean
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = 'Search', className, debounce = true, onChange, ...props }, ref) => {
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

    // Handle input change
    const handleInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (effectiveDebounce) {
          debouncedOnChangeRef.current(value)
        } else {
          onChange?.(value)
        }
      },
      [effectiveDebounce, onChange]
    )

    return (
      <BaseInput
        type="text"
        ref={ref}
        className={cn('cn-input-search', className)}
        onChange={handleInputChange}
        prefix={
          <div className="grid w-8 place-items-center border-r-0">
            <Icon name="search" size={12} />
          </div>
        }
        placeholder={placeholder}
        {...props}
      />
    )
  }
)

SearchInput.displayName = 'SearchInput'

export { SearchInput }
