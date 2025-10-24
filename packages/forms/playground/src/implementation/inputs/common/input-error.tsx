import { useFormContext } from 'react-hook-form'

export const InputError = ({ path, ...props }: { path: string } & React.HTMLAttributes<HTMLParagraphElement>) => {
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(path, formState)
  const { error } = fieldState

  if (!error?.message) {
    return null
  }

  return (
    <p className={'input-error'} {...props}>
      {error.message}
    </p>
  )
}
InputError.displayName = 'InputError'
