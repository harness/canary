import { ChangeEvent, forwardRef, useCallback, useEffect, useMemo, useRef } from 'react'

import { IconV2 } from '@components/icon-v2'
import { cn } from '@utils/cn'
import { debounce as debounceFn } from 'lodash-es'

import { BaseInput, InputProps } from './base-input'

// Custom onChange handler for search that works with strings instead of events
export interface SearchInputProps extends Omit<InputProps, 'type' | 'onChange' | 'label'> {
  onChange?: (value: string) => void
  debounce?: number | boolean
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = 'Search', className, debounce = true, onChange, prefix: prefixProp, ...props }, ref) => {
    const prefix = prefixProp ?? (
      <div className="ml-1 grid w-8 shrink-0 place-items-center border-r-0">
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
      <>
        <BaseInput
          type="text"
          ref={ref}
          className={cn('cn-input-search', className)}
          onChange={handleInputChange}
          prefix={prefix}
          placeholder={placeholder}
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
