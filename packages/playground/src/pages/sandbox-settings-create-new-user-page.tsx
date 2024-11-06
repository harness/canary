import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, ButtonGroup, Input, Spacer, Text, Icon } from '@harnessio/canary'
import { SandboxLayout, FormFieldSet } from '..'
import { MessageTheme } from '../components/form-field-set'
import { InfoCircle } from '@harnessio/icons-noir'
import { useNavigate } from 'react-router-dom'

const newUserSchema = z.object({
  userID: z.string().min(1, { message: 'Please provide a user ID' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  displayName: z.string().optional()
})

type NewUserFields = z.infer<typeof newUserSchema>

function SandboxSettingsCreateNewUserPage() {
  const navigate = useNavigate()
  // Project Settings form handling
  const {
    register,
    handleSubmit,
    reset: resetNewUserForm,
    formState: { errors, isValid }
  } = useForm<NewUserFields>({
    resolver: zodResolver(newUserSchema),
    mode: 'onChange',
    defaultValues: {
      userID: '',
      email: '',
      displayName: ''
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form submit handler for project settings
  const onSubmit: SubmitHandler<NewUserFields> = data => {
    setIsSubmitting(true)
    console.log(data)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      resetNewUserForm(data) // Reset to the current values
      setTimeout(() => setSubmitted(false), 2000)
      navigate('../users')
    }, 2000)
  }

  const handleCancel = () => {
    resetNewUserForm()
    navigate('../users')
  }

  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content maxWidth="2xl">
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Add a new User
        </Text>
        <Spacer size={6} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormFieldSet.Root>
            {/* USER ID */}
            <FormFieldSet.ControlGroup>
              <div className="flex items-center">
                <FormFieldSet.Label htmlFor="memberName" required>
                  User ID
                </FormFieldSet.Label>
                <InfoCircle size="15" className="text-tertiary-background ml-3" />
                <Text size={1} className="text-tertiary-background ml-1">
                  User ID cannot be changed once created
                </Text>
              </div>

              <Input id="memberName" {...register('userID')} placeholder="Enter user name" />
              {errors.userID && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.userID.message?.toString()}
                </FormFieldSet.Message>
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
              <FormFieldSet.Label htmlFor="displayName">Display Name</FormFieldSet.Label>
              <Input id="displayName" {...register('displayName')} placeholder="Enter display name" />
              {errors.displayName && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.displayName.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* SAVE BUTTON */}
            <FormFieldSet.ControlGroup type="button">
              <ButtonGroup.Root>
                {!submitted ? (
                  <>
                    <Button size="sm" type="submit" disabled={!isValid || isSubmitting}>
                      {isSubmitting ? 'Inviting...' : 'Invite New User'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={handleCancel}
                      disabled={!isValid || isSubmitting}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" type="button" size="sm" theme="success" className="pointer-events-none">
                    Saved&nbsp;&nbsp;
                    <Icon name="tick" size={14} />
                  </Button>
                )}
              </ButtonGroup.Root>
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        </form>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SandboxSettingsCreateNewUserPage }
