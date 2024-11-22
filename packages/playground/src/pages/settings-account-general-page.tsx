import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Avatar, AvatarFallback, AvatarImage, Button, ButtonGroup, Icon, Input, Spacer, Text } from '@harnessio/canary'

import { FormFieldSet, SandboxLayout } from '..'
import { MessageTheme } from '../components/form-field-set'

// Define form schemas
const profileSchema = z.object({
  name: z.string().min(1, { message: 'Please provide your name' }),
  username: z.string().min(1, { message: 'Please provide a username' }),
  email: z.string().email({ message: 'Please provide a valid email address' })
})

const passwordSchema = z
  .object({
    oldPassword: z.string().min(6, { message: 'Old password must be at least 6 characters' }),
    newPassword: z
      .string()
      .min(6, { message: 'New password must be at least 6 characters' })
      .regex(/[0-9]/, 'New password must contain at least one number')
      .regex(/[A-Z]/, 'New password must contain at least one uppercase letter'),
    confirmPassword: z.string().min(6, { message: 'Please confirm your new password' })
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

// Define TypeScript types
type ProfileFields = z.infer<typeof profileSchema>
type PasswordFields = z.infer<typeof passwordSchema>

export function SettingsAccountGeneralPage() {
  // Profile form handling
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm, // Add reset for profile form
    formState: { errors: profileErrors, isValid: isProfileValid, dirtyFields: profileDirtyFields }
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      name: 'Ann Nonymous',
      username: 'anon',
      email: 'user@anon.com'
    }
  })

  // Password form handling
  const {
    register: registerPassword,
    reset: resetPasswordForm, // Add reset for password form
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isValid: isPasswordValid }
  } = useForm<PasswordFields>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false)
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
  const [profileSubmitted, setProfileSubmitted] = useState(false)
  const [passwordSubmitted, setPasswordSubmitted] = useState(false)

  // Profile form submit handler
  const onProfileSubmit: SubmitHandler<ProfileFields> = data => {
    setIsProfileSubmitting(true)
    setTimeout(() => {
      console.log('Profile updated:', data)
      setIsProfileSubmitting(false)
      setProfileSubmitted(true)
      // Reset profile form to clear dirty state
      resetProfileForm({
        name: data.name,
        username: data.username,
        email: data.email
      })
      setTimeout(() => setProfileSubmitted(false), 2000)
    }, 2000)
  }

  // Password form submit handler
  const onPasswordSubmit: SubmitHandler<PasswordFields> = data => {
    setIsPasswordSubmitting(true)
    setTimeout(() => {
      console.log('Password updated:', data)
      resetPasswordForm()
      setIsPasswordSubmitting(false)
      setPasswordSubmitted(true)
      setTimeout(() => setPasswordSubmitted(false), 2000)
    }, 2000)
  }

  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content maxWidth="2xl">
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          General
        </Text>
        <Spacer size={6} />
        <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
          <FormFieldSet.Root>
            {/* PERSONAL INFORMATION */}
            <FormFieldSet.Legend>Personal information</FormFieldSet.Legend>
            <FormFieldSet.ControlGroup className="flex w-auto flex-row items-center justify-start gap-x-6">
              <Avatar size="80" className="size-20 rounded-full bg-primary/[0.02] shadow-md">
                <AvatarImage src="/images/anon.jpg" />
                <AvatarFallback>
                  <Text size={5} weight="medium" color="tertiaryBackground">
                    BR
                  </Text>
                </AvatarFallback>
              </Avatar>
              <FormFieldSet.ControlGroup>
                <FormFieldSet.Label htmlFor="avatar">Profile picture</FormFieldSet.Label>
                <ButtonGroup.Root spacing="3">
                  <Button variant="outline" size="sm">
                    Upload
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon name="trash" size={14} />
                  </Button>
                </ButtonGroup.Root>
              </FormFieldSet.ControlGroup>
            </FormFieldSet.ControlGroup>

            {/* NAME */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="name" required>
                Name
              </FormFieldSet.Label>
              <Input id="name" {...registerProfile('name')} placeholder="Enter your name" />
              {profileErrors.name && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {profileErrors.name.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* USERNAME */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="username" required>
                Username
              </FormFieldSet.Label>
              <Input id="username" {...registerProfile('username')} placeholder="Enter your username" />
              {profileErrors.username && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {profileErrors.username.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* EMAIL */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="email" required>
                Account email
              </FormFieldSet.Label>
              <Input id="email" {...registerProfile('email')} placeholder="brad@drone.io" />
              {profileErrors.email && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {profileErrors.email.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* UPDATE PROFILE BUTTON */}
            <FormFieldSet.ControlGroup type="button">
              <ButtonGroup.Root>
                {!profileSubmitted ? (
                  <Button
                    size="sm"
                    type="submit"
                    disabled={!isProfileValid || isProfileSubmitting || !Object.keys(profileDirtyFields).length}
                  >
                    {isProfileSubmitting ? 'Updating...' : 'Update profile'}
                  </Button>
                ) : (
                  <Button variant="ghost" type="button" size="sm" theme="success" className="pointer-events-none">
                    Updated&nbsp;&nbsp;
                    <Icon name="tick" size={14} />
                  </Button>
                )}
              </ButtonGroup.Root>
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        </form>

        <FormFieldSet.Root>
          <FormFieldSet.Separator />
        </FormFieldSet.Root>

        {/* PASSWORD SETTINGS */}
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
          <FormFieldSet.Root>
            <FormFieldSet.Legend>Password settings</FormFieldSet.Legend>
            <FormFieldSet.SubLegend>
              Minimum of 6 characters long containing at least one number and a mixture of uppercase and lowercase
              letters.
            </FormFieldSet.SubLegend>
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="oldPassword">Old password</FormFieldSet.Label>
              <Input
                id="oldPassword"
                type="password"
                {...registerPassword('oldPassword')}
                placeholder="Enter your old password"
              />
              {passwordErrors.oldPassword && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {passwordErrors.oldPassword.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* NEW PASSWORD */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="newPassword">New password</FormFieldSet.Label>
              <Input
                id="newPassword"
                type="password"
                {...registerPassword('newPassword')}
                placeholder="Enter a new password"
              />
              {passwordErrors.newPassword && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {passwordErrors.newPassword.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* CONFIRM PASSWORD */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="confirmPassword">Confirm new password</FormFieldSet.Label>
              <Input
                id="confirmPassword"
                type="password"
                {...registerPassword('confirmPassword')}
                placeholder="Confirm your new password"
              />
              {passwordErrors.confirmPassword && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {passwordErrors.confirmPassword.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* UPDATE PASSWORD BUTTON */}
            <FormFieldSet.ControlGroup type="button">
              <ButtonGroup.Root>
                {!passwordSubmitted ? (
                  <Button size="sm" type="submit" disabled={!isPasswordValid || isPasswordSubmitting}>
                    {isPasswordSubmitting ? 'Updating...' : 'Update password'}
                  </Button>
                ) : (
                  <Button variant="ghost" type="button" size="sm" theme="success" className="pointer-events-none">
                    Updated&nbsp;&nbsp;
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
