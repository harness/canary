import { useForm } from 'react-hook-form'

import { Button, ButtonGroup, ControlGroup, Fieldset, Input, Message, MessageTheme } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
    <Fieldset className="mb-0">
      <ControlGroup>
        {/* <FormFieldSet.Label htmlFor="verification" required>
          To confirm, type “DELETE”
        </FormFieldSet.Label> */}
        <Input
          id="verification"
          {...register('verification')}
          placeholder=""
          label="To confirm, type “DELETE”"
          error={errors.verification?.message?.toString()}
        />

        {error && (
          <Message theme={MessageTheme.ERROR} className="mt-2">
            {error}
          </Message>
        )}

        <ButtonGroup className="mt-4 justify-end">
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
        </ButtonGroup>
      </ControlGroup>
    </Fieldset>
  )
}
