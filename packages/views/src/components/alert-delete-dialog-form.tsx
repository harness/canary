import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, ButtonGroup, Input } from '@harnessio/canary'

import { FormFieldSet } from '../index'

const alertDeleteSchema = z.object({
  verification: z.string().min(1, { message: 'To confirm, please type "DELETE".' })
})

type AlertDeleteFormFields = z.infer<typeof alertDeleteSchema>

interface FormProjDeleteProps {
  isLoading: boolean
  error: string | null
  deleteFn: (identifier: string) => void
  onClose?: () => void
  type: string
  identifier: string
}
export const AlertDeleteDialogForm = ({
  isLoading,
  error,
  deleteFn,
  onClose,
  type,
  identifier
}: FormProjDeleteProps) => {
  const {
    register,
    formState: { errors },
    watch
  } = useForm<AlertDeleteFormFields>({
    resolver: zodResolver(alertDeleteSchema)
  })

  const verification = watch('verification')

  const handleDelete = () => {
    if (verification === 'DELETE') deleteFn(identifier!)
  }

  return (
    <FormFieldSet.Root className="mb-0">
      <FormFieldSet.ControlGroup>
        <FormFieldSet.Label htmlFor="verification" required>
          To confirm, type “DELETE”
        </FormFieldSet.Label>
        <Input id="verification" {...register('verification')} placeholder="" />
        {errors.verification && (
          <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
            {errors.verification.message?.toString()}
          </FormFieldSet.Message>
        )}
        {error && <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>{error}</FormFieldSet.Message>}
        <ButtonGroup.Root className="mt-4 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            size="default"
            theme="error"
            className="self-start"
            variant="destructive"
            disabled={isLoading || verification != 'DELETE'}
            onClick={handleDelete}
          >
            {isLoading ? `Deleting ${type}...` : `Yes, delete ${type}`}
          </Button>
        </ButtonGroup.Root>
      </FormFieldSet.ControlGroup>
    </FormFieldSet.Root>
  )
}
