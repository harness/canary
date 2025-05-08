import { forwardRef, useCallback, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { TextInput, TextInputProps } from './text-input'

// Define themes as constants to avoid string literals
const THEMES = {
  DEFAULT: 'default',
  DANGER: 'danger',
  WARNING: 'warning',
  SUCCESS: 'success'
} as const

const TextInput2 = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  // Only access hook if it's available in the component tree
  const formContext = useFormContext()

  // Generate a unique ID if one isn't provided
  const generateUniqueId = useCallback(() => `text-input-${Math.random().toString(36).substring(2, 9)}`, [])
  const inputId = props.id || generateUniqueId()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const setRefs = (element: HTMLInputElement | null) => {
    // Save to local ref
    inputRef.current = element

    // Forward to external ref
    if (typeof ref === 'function') {
      ref(element)
    } else if (ref) {
      ref.current = element
    }
  }

  return (
    <>
      {formContext && props.name ? (
        <Controller
          name={props.name}
          control={formContext.control}
          render={({ field, fieldState, formState }) => {
            console.log('field', field)
            console.log('fieldState', fieldState)
            console.log('formState', formState)

            // Use proper React Hook Form reference handling
            field.ref = setRefs

            // Determine if there's an error from the form state
            const hasError = !!fieldState.error
            const errorMessage = fieldState.error?.message

            return (
              <TextInput
                {...props}
                {...field}
                // Set appropriate theme based on error state
                theme={hasError ? THEMES.DANGER : props.warning ? THEMES.WARNING : props.theme}
                error={errorMessage}
                id={inputId}
              />
            )
          }}
        />
      ) : (
        <TextInput {...props} ref={ref} id={inputId} />
      )}
    </>
  )

  // TextInput2.displayName = 'TextInput2'

  // export { TextInput2 }
  //   <ControlGroup className={wrapperClassName}>
  //     {!!label && (
  //       <Label disabled={props.disabled} optional={optional} htmlFor={inputId}>
  //         {label}
  //       </Label>
  //     )}

  //     {formContext && props.name ? (
  //       <Controller
  //         name={props.name}
  //         control={formContext.control}
  //         render={({ field, fieldState }) => {
  //           // Use proper React Hook Form reference handling
  //           field.ref = setRefs

  //           // Determine if there's an error from the form state
  //           const hasError = !!fieldState.error
  //           const errorMessage = fieldState.error?.message

  //           return (
  //             <>
  //               <BaseInput
  //                 {...restProps}
  //                 {...field}
  //                 // Set appropriate theme based on error state
  //                 theme={hasError ? THEMES.DANGER : restProps.theme}
  //                 id={inputId}
  //               />

  //               {errorMessage ? (
  //                 <FormCaption theme={THEMES.DANGER}>{errorMessage}</FormCaption>
  //               ) : message ? (
  //                 <FormCaption theme={messageTheme}>{message}</FormCaption>
  //               ) : caption ? (
  //                 <FormCaption>{caption}</FormCaption>
  //               ) : null}
  //             </>
  //           )
  //         }}
  //       />
  //     ) : (
  //       <>
  //         <BaseInput {...restProps} ref={ref} id={inputId} />

  //         {message ? (
  //           <FormCaption theme={messageTheme}>{message}</FormCaption>
  //         ) : caption ? (
  //           <FormCaption>{caption}</FormCaption>
  //         ) : null}
  //       </>
  //     )}
  //   </ControlGroup>
  // )
})

TextInput2.displayName = 'TextInput2'

export { TextInput2 }
