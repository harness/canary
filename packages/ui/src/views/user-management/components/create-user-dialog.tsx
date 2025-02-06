import { SubmitHandler, useForm } from 'react-hook-form'

import {
  AlertDialog,
  Button,
  ButtonGroup,
  ControlGroup,
  Fieldset,
  FormWrapper,
  Icon,
  Input,
  Label,
  Spacer,
  Text
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const newUserSchema = z.object({
  uid: z.string().min(1, { message: 'Please provide a user ID' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  display_name: z.string().min(1, { message: 'Please provide a display name' })
})

export type NewUserFields = z.infer<typeof newUserSchema>

export function CreateUserDialog({
  handleCreateUser,
  isLoading,
  apiError,
  open,
  onClose
}: {
  handleCreateUser: (data: NewUserFields) => void
  isLoading: boolean
  apiError: string | null
  open: boolean
  onClose: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<NewUserFields>({
    resolver: zodResolver(newUserSchema),
    mode: 'onChange',
    defaultValues: {
      uid: '',
      email: '',
      display_name: ''
    }
  })

  const onSubmit: SubmitHandler<NewUserFields> = data => {
    handleCreateUser(data)
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={onClose}>
      <AlertDialog.Content onClose={onClose}>
        <AlertDialog.Header>
          <AlertDialog.Title>Add a new user</AlertDialog.Title>
        </AlertDialog.Header>
        <AlertDialog.Description asChild>
          <FormWrapper onSubmit={handleSubmit(onSubmit)}>
            <Fieldset>
              {/* USER ID */}
              <ControlGroup>
                <span className="flex items-center">
                  <Label htmlFor="memberName">User ID</Label>
                  <Icon name="info-circle" height={15} className="ml-3 text-tertiary-background" />
                  <Text size={1} className="ml-1 text-tertiary-background">
                    User ID cannot be changed once created
                  </Text>
                </span>
                <Spacer size={2} />

                <Input
                  id="memberName"
                  {...register('uid')}
                  placeholder="Enter user name"
                  // label="User ID"
                  error={errors.uid?.message?.toString()}
                />
              </ControlGroup>

              {/* EMAIL */}
              <ControlGroup>
                <Input
                  id="email"
                  {...register('email')}
                  placeholder="Enter email address"
                  label="Email"
                  error={errors.email?.message?.toString()}
                />
              </ControlGroup>

              {/* ROLE */}
              <ControlGroup>
                <Input
                  id="displayName"
                  {...register('display_name')}
                  placeholder="Enter display name"
                  label="Display Name"
                  error={errors.display_name?.message?.toString()}
                />
              </ControlGroup>

              {apiError && (
                <>
                  <Text size={1} className="text-destructive">
                    {apiError?.toString()}
                  </Text>
                </>
              )}
              {/* SAVE BUTTON */}
              <AlertDialog.Footer>
                <ControlGroup>
                  <ButtonGroup>
                    <>
                      <Button size="sm" type="submit" disabled={isLoading}>
                        {isLoading ? 'Inviting...' : 'Invite New User'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() => {
                          onClose()
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </>
                  </ButtonGroup>
                </ControlGroup>
              </AlertDialog.Footer>
            </Fieldset>
          </FormWrapper>
        </AlertDialog.Description>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
