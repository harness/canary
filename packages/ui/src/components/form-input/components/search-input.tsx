import { ChangeEvent, useCallback, useEffect, useRef } from 'react'

import { Icon } from '@components/icon'
import { cn } from '@utils/cn'
import { debounce } from 'lodash-es'

import { BaseInput, InputProps } from './base-input'

// Custom onChange handler for search that works with strings instead of events
interface SearchInputProps extends Omit<InputProps, 'type' | 'onChange' | 'label'> {
  onChange?: (value: string) => void
  disableDebounce?: boolean
}

export function SearchInput({ placeholder = 'Search', disableDebounce = false, onChange, ...props }: SearchInputProps) {
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
      className={cn('cn-input-search', props.className)}
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

SearchInput.displayName = 'SearchInput'
