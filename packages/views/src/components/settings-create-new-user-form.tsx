import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, ButtonGroup, Icon, Input, Spacer, Text } from '@harnessio/canary'

import { FormFieldSet, SandboxLayout } from '..'
import { MessageTheme } from './form-field-set'

const newUserSchema = z.object({
  uid: z.string().min(1, { message: 'Please provide a user ID' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  display_name: z.string().min(1, { message: 'Please provide a display name' })
})

export type NewUserFields = z.infer<typeof newUserSchema>

function SettingsCreateNewUserForm({
  handleCreateUser,
  isLoading,
  apiError
}: {
  handleCreateUser: (data: NewUserFields) => void
  isLoading: boolean
  apiError: string | null
}) {
  // Project Settings form handling
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<NewUserFields>({
    resolver: zodResolver(newUserSchema),
    mode: 'onChange',
    defaultValues: {
      uid: '',
      email: '',
      display_name: ''
    }
  })

  const navigate = useNavigate()

  // Form submit handler for project settings
  const onSubmit: SubmitHandler<NewUserFields> = data => {
    handleCreateUser(data)
  }

  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content maxWidth="2xl">
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Add a new user
        </Text>
        <Spacer size={6} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormFieldSet.Root>
            {/* USER ID */}
            <FormFieldSet.ControlGroup className="gap-0">
              <span className="flex items-center">
                <FormFieldSet.Label htmlFor="memberName" required>
                  User ID
                </FormFieldSet.Label>
                <Icon name="info-circle" height={15} className="ml-3 text-tertiary-background" />
                <Text size={1} className="ml-1 text-tertiary-background">
                  User ID cannot be changed once created
                </Text>
              </span>
              <Spacer size={2} />

              <Input id="memberName" {...register('uid')} placeholder="Enter user name" />
              {errors.uid && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors.uid.message?.toString()}</FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* EMAIL */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="email" required>
                Email
              </FormFieldSet.Label>
              <Input id="email" {...register('email')} placeholder="Enter email address" />
              {errors.email && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.email.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* ROLE */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="displayName" required>
                Display Name
              </FormFieldSet.Label>
              <Input id="displayName" {...register('display_name')} placeholder="Enter display name" />
              {errors.display_name && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.display_name.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {apiError && (
              <>
                <Text size={1} className="text-destructive">
                  {apiError?.toString()}
                </Text>
              </>
            )}

            {/* SAVE BUTTON */}
            <FormFieldSet.ControlGroup type="button">
              <ButtonGroup.Root>
                <>
                  <Button size="sm" type="submit" disabled={!isValid || isLoading}>
                    {isLoading ? 'Inviting...' : 'Invite New User'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      navigate('../users')
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </>
              </ButtonGroup.Root>
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        </form>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SettingsCreateNewUserForm }
