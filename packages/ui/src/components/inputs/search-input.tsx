import { ChangeEvent, forwardRef, useCallback, useEffect, useRef } from 'react'

import { Icon } from '@components/icon'
import { cn } from '@utils/cn'
import { debounce } from 'lodash-es'

import { BaseInput, InputProps } from './base-input'

// Custom onChange handler for search that works with strings instead of events
export interface SearchInputProps extends Omit<InputProps, 'type' | 'onChange' | 'label'> {
  onChange?: (value: string) => void
  disableDebounce?: boolean
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = 'Search', disableDebounce = false, className, onChange, ...props }, ref) => {
    const debouncedOnChangeRef = useRef(
      debounce((value: string) => {
        onChange?.(value)
      }, 300)
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
        if (disableDebounce) {
          onChange?.(value)
        } else {
          debouncedOnChangeRef.current(value)
        }
      },
      [disableDebounce, onChange]
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
