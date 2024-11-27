import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  ButtonGroup,
  Icon,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spacer,
  Text
} from '@harnessio/canary'
import { FormFieldSet, getInitials, ModeToggle, SandboxLayout, SkeletonList } from '@harnessio/views'

import { handleLanguageChange } from '../../i18n/i18n'
import { LanguagesEnum } from './types'

const profileSchema = z.object({
  name: z.string().min(1, { message: 'Please provide your name' }),
  username: z.string().min(1, { message: 'Please provide a username' }),
  email: z.string().email({ message: 'Please provide a valid email address' }),
  language: z.nativeEnum(LanguagesEnum)
})

const passwordSchema = z
  .object({
    // oldPassword: z.string().min(6, { message: 'Old password must be at least 6 characters' }),
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
export type ProfileFields = z.infer<typeof profileSchema>
export type PasswordFields = z.infer<typeof passwordSchema>

interface SettingsAccountGeneralPageProps {
  userData: ProfileFields
  isLoadingUser: boolean
  isUpdatingUser: boolean
  isUpdatingPassword: boolean
  profileUpdateSuccess: boolean
  passwordUpdateSuccess: boolean
  error: { type: 'profile' | 'password'; message: string } | null
  onUpdateUser: (data: Omit<ProfileFields, 'username'>) => void
  onUpdatePassword: (data: PasswordFields) => void
}

const SettingsAccountGeneralPage: React.FC<SettingsAccountGeneralPageProps> = ({
  userData,
  isLoadingUser,
  isUpdatingUser,
  isUpdatingPassword,
  profileUpdateSuccess,
  passwordUpdateSuccess,
  error,
  onUpdateUser,
  onUpdatePassword
}) => {
  // Profile form handling

  const [profileSubmitted, setProfileSubmitted] = useState(false)
  const [passwordSubmitted, setPasswordSubmitted] = useState(false)
  const TRUNCATE_INITIALS_LEN = 2
  const languageOptions = [
    {
      label: 'English',
      value: LanguagesEnum.ENGLISH
    },
    {
      label: 'French',
      value: LanguagesEnum.FRENCH
    },
    {
      label: 'System',
      value: LanguagesEnum.SYSTEM
    }
  ]

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    watch,
    setValue,
    formState: { errors: profileErrors, isValid: isProfileValid, dirtyFields: profileDirtyFields }
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      name: userData?.name || '',
      username: userData?.username || '',
      email: userData?.email || ''
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
      // oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const languageValue = watch('language')

  useEffect(() => {
    if (userData) {
      resetProfileForm({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        language: userData.language
      })
    }
  }, [userData])

  useEffect(() => {
    if (profileUpdateSuccess === true) {
      resetProfileForm({
        name: userData.name,
        username: userData.username,
        email: userData.email
      })
      setProfileSubmitted(true)
      setTimeout(() => setProfileSubmitted(false), 2000)
    }
  }, [profileUpdateSuccess])

  useEffect(() => {
    if (passwordUpdateSuccess === true) {
      resetPasswordForm()

      setPasswordSubmitted(true)
      setTimeout(() => setPasswordSubmitted(false), 2000)
    }
  }, [passwordUpdateSuccess])

  // Profile form submit handler
  const onProfileSubmit: SubmitHandler<ProfileFields> = data => {
    const { username: _, ...updatedData } = data
    onUpdateUser(updatedData)
  }

  // Password form submit
  const onPasswordSubmit: SubmitHandler<PasswordFields> = data => {
    onUpdatePassword(data)
  }

  if (isLoadingUser) {
    return (
      <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
        <SandboxLayout.Content maxWidth="2xl">
          <SkeletonList />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    )
  }

  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content maxWidth="2xl">
        <Spacer size={10} />
        <Text size={5} weight={'medium'} className="flex justify-center">
          General
        </Text>
        <Spacer size={6} />
        <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
          <FormFieldSet.Root>
            {/* PERSONAL INFORMATION */}
            <FormFieldSet.Legend className="flex justify-center">Personal information</FormFieldSet.Legend>
            <FormFieldSet.ControlGroup className="flex w-auto flex-row items-center justify-center gap-x-6">
              <Avatar size="80" className="bg-primary/[0.02] h-20 w-20 rounded-full shadow-md">
                <AvatarImage src="/images/anon.jpg" />
                <AvatarFallback>
                  <Text size={5} weight="medium" color="tertiaryBackground">
                    {getInitials(userData.name, TRUNCATE_INITIALS_LEN)}
                  </Text>
                </AvatarFallback>
              </Avatar>
            </FormFieldSet.ControlGroup>

            {/* NAME */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="name" required>
                Name
              </FormFieldSet.Label>
              <Input id="name" {...registerProfile('name')} placeholder="Enter your name" />
              {profileErrors.name && (
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                  {profileErrors.name.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* USERNAME */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="username" required>
                Username
              </FormFieldSet.Label>
              <Input id="username" {...registerProfile('username')} placeholder="Enter your username" disabled />
              {profileErrors.username && (
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
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
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                  {profileErrors.email.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label>Theme</FormFieldSet.Label>
              <ModeToggle />
            </FormFieldSet.ControlGroup>

            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="language">Select Language</FormFieldSet.Label>
              <Select
                // defaultValue="system"
                value={languageValue}
                {...registerProfile('language')}
                onValueChange={value => {
                  setValue('language', value as LanguagesEnum)
                  handleLanguageChange(value)
                }}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldSet.ControlGroup>

            {error && error.type === 'profile' && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {error.message}
                </Text>
              </>
            )}

            {/* UPDATE PROFILE BUTTON */}
            <FormFieldSet.ControlGroup type="button">
              <ButtonGroup.Root>
                {!profileSubmitted ? (
                  <Button
                    size="sm"
                    type="submit"
                    disabled={!isProfileValid || isUpdatingUser || !Object.keys(profileDirtyFields).length}
                  >
                    {isUpdatingUser ? 'Updating...' : 'Update profile'}
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
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
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
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                  {passwordErrors.confirmPassword.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {error && error.type === 'password' && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {error.message}
                </Text>
              </>
            )}

            {/* UPDATE PASSWORD BUTTON */}
            <FormFieldSet.ControlGroup type="button">
              <ButtonGroup.Root className="flex justify-between">
                {!passwordSubmitted ? (
                  <Button size="sm" type="submit" disabled={!isPasswordValid || isUpdatingPassword}>
                    {isUpdatingPassword ? 'Updating...' : 'Update password'}
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

export { SettingsAccountGeneralPage }
