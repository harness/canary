import { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  ButtonGroup,
  ControlGroup,
  FormSeparator,
  FormWrapper,
  Icon,
  Input,
  Legend,
  Message,
  MessageTheme,
  SkeletonList,
  Spacer,
  Text
} from '@/components'
import { IProfileSettingsStore, SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { getInitials } from '@utils/stringUtils'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(1, { message: 'Please provide your name' }),
  username: z.string().min(1, { message: 'Please provide a username' }),
  email: z.string().email({ message: 'Please provide a valid email address' })
})

const passwordSchema = z
  .object({
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
  isLoadingUser: boolean
  isUpdatingUser: boolean
  isUpdatingPassword: boolean
  profileUpdateSuccess: boolean
  passwordUpdateSuccess: boolean
  error: { type: 'profile' | 'password'; message: string } | null
  onUpdateUser: (data: Omit<ProfileFields, 'username'>) => void
  onUpdatePassword: (data: PasswordFields) => void
  useProfileSettingsStore: () => IProfileSettingsStore
  useTranslationStore: () => TranslationStore
}

const SettingsAccountGeneralPage: FC<SettingsAccountGeneralPageProps> = ({
  useProfileSettingsStore,
  isLoadingUser,
  isUpdatingUser,
  isUpdatingPassword,
  profileUpdateSuccess,
  passwordUpdateSuccess,
  error,
  onUpdateUser,
  onUpdatePassword,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()
  const { userData } = useProfileSettingsStore()
  const [profileSubmitted, setProfileSubmitted] = useState(false)
  const [passwordSubmitted, setPasswordSubmitted] = useState(false)
  const TRUNCATE_INITIALS_LEN = 2

  // Profile form handling
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
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
    reset: resetPasswordForm,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isValid: isPasswordValid }
  } = useForm<PasswordFields>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  useEffect(() => {
    if (userData) {
      resetProfileForm({
        name: userData.name,
        username: userData.username,
        email: userData.email
      })
    }
  }, [resetProfileForm, userData])

  useEffect(() => {
    if (profileUpdateSuccess) {
      resetProfileForm({
        name: userData?.name,
        username: userData?.username,
        email: userData?.email
      })
      setProfileSubmitted(true)
      setTimeout(() => setProfileSubmitted(false), 2000)
    }
  }, [profileUpdateSuccess, resetProfileForm, userData?.email, userData?.name, userData?.username])

  useEffect(() => {
    if (passwordUpdateSuccess) {
      resetPasswordForm()

      setPasswordSubmitted(true)
      setTimeout(() => setPasswordSubmitted(false), 2000)
    }
  }, [passwordUpdateSuccess, resetPasswordForm])

  // Profile form submit handler
  const onProfileSubmit: SubmitHandler<ProfileFields> = data => {
    const { username: _, ...updatedData } = data
    onUpdateUser(updatedData)
  }

  // Password form submit handler
  const onPasswordSubmit: SubmitHandler<PasswordFields> = data => {
    onUpdatePassword(data)
  }

  if (isLoadingUser) {
    return (
      <SandboxLayout.Main>
        <SandboxLayout.Content>
          <SkeletonList />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    )
  }

  return (
    <SandboxLayout.Content className="max-w-[476px] px-0">
      <Text size={5} weight={'medium'} as="h1">
        {t('views:profileSettings.accountSettings', 'Account settings')}
      </Text>
      <Spacer size={10} />
      <FormWrapper onSubmit={handleProfileSubmit(onProfileSubmit)}>
        <Legend title={t('views:profileSettings.personalInfo', 'Personal information')} />
        <ControlGroup>
          <Avatar size="80" className="bg-primary/[0.02] size-20 rounded-full shadow-md">
            <AvatarImage src="/images/anon.jpg" />
            <AvatarFallback>
              <Text size={5} weight="medium" color="tertiaryBackground">
                {getInitials(userData?.name || '', TRUNCATE_INITIALS_LEN)}
              </Text>
            </AvatarFallback>
          </Avatar>
        </ControlGroup>

        {/* NAME */}
        <ControlGroup>
          <Input
            id="name"
            size="md"
            {...registerProfile('name')}
            placeholder={t('views:profileSettings.enterNamePlaceholder', 'Enter your name')}
            label={t('views:profileSettings.name', 'Name')}
          />
          {profileErrors.name && (
            <Message className="mt-1.5" theme={MessageTheme.ERROR}>
              {profileErrors.name.message?.toString()}
            </Message>
          )}
        </ControlGroup>

        {/* USERNAME */}
        <ControlGroup>
          <Input
            id="username"
            size="md"
            {...registerProfile('username')}
            placeholder={t('views:profileSettings.enterUsernamePlaceholder', 'Enter your username')}
            disabled
            label={t('views:profileSettings.username', 'Username')}
          />
          <Message className="mt-1.5" theme={MessageTheme.DEFAULT}>
            This username will be shown across the platform.
          </Message>
          {profileErrors.username && (
            <Message theme={MessageTheme.ERROR}>{profileErrors.username.message?.toString()}</Message>
          )}
        </ControlGroup>

        {/* EMAIL */}
        <ControlGroup>
          <Input
            id="email"
            size="md"
            {...registerProfile('email')}
            placeholder="name@domain.com"
            label={t('views:profileSettings.accountEmail', 'Account email')}
          />
          {profileErrors.email && (
            <Message theme={MessageTheme.ERROR}>{profileErrors.email.message?.toString()}</Message>
          )}
        </ControlGroup>

        {error && error.type === 'profile' && <Message theme={MessageTheme.ERROR}>{error.message}</Message>}

        {/* UPDATE PROFILE BUTTON */}
        <ControlGroup type="button">
          <ButtonGroup>
            {!profileSubmitted ? (
              <Button
                type="submit"
                disabled={!isProfileValid || isUpdatingUser || !Object.keys(profileDirtyFields).length}
              >
                {isUpdatingUser
                  ? t('views:profileSettings.updatingProfileButton', 'Updating...')
                  : t('views:profileSettings.updateProfileButton', 'Update profile')}
              </Button>
            ) : (
              <Button className="pointer-events-none" variant="ghost" type="button" size="sm" theme="success">
                {t('views:profileSettings.updatedButton', 'Updated')}&nbsp;&nbsp;
                <Icon name="tick" size={14} />
              </Button>
            )}
          </ButtonGroup>
        </ControlGroup>
      </FormWrapper>

      <FormSeparator className="my-7" />

      <FormWrapper onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
        <Legend
          title={t('views:profileSettings.passwordSettingsTitle', 'Password settings')}
          description={t(
            'views:profileSettings.passwordSettingsDesc',
            'Minimum of 6 characters long containing at least one number and a mixture of uppercase and lowercase letters.'
          )}
        />
        <ControlGroup>
          <Input
            id="newPassword"
            type="password"
            size="md"
            {...registerPassword('newPassword')}
            placeholder={t('views:profileSettings.enterPasswordPlaceholder', 'Enter a new password')}
            label={t('views:profileSettings.newPassword', 'New password')}
          />
          {passwordErrors.newPassword && (
            <Message theme={MessageTheme.ERROR}>{passwordErrors.newPassword.message?.toString()}</Message>
          )}
        </ControlGroup>

        {/* CONFIRM PASSWORD */}
        <ControlGroup>
          <Input
            id="confirmPassword"
            type="password"
            size="md"
            {...registerPassword('confirmPassword')}
            placeholder={t('views:profileSettings.confirmPasswordPlaceholder', 'Confirm your new password')}
            label={t('views:profileSettings.confirmPassword', 'Confirm password')}
          />
          {passwordErrors.confirmPassword && (
            <Message theme={MessageTheme.ERROR}>{passwordErrors.confirmPassword.message?.toString()}</Message>
          )}
        </ControlGroup>

        {error && error.type === 'password' && <Message theme={MessageTheme.ERROR}>{error.message}</Message>}

        {/* UPDATE PASSWORD BUTTON */}
        <ControlGroup type="button">
          <ButtonGroup>
            {!passwordSubmitted ? (
              <Button type="submit" disabled={!isPasswordValid || isUpdatingPassword}>
                {isUpdatingPassword
                  ? t('views:profileSettings.updatingPasswordButton', 'Updating...')
                  : t('views:profileSettings.updatePasswordButton', 'Update password')}
              </Button>
            ) : (
              <Button className="pointer-events-none" variant="ghost" type="button" theme="success">
                {t('views:profileSettings.updatedButton', 'Updated')}&nbsp;&nbsp;
                <Icon name="tick" size={14} />
              </Button>
            )}
          </ButtonGroup>
        </ControlGroup>
      </FormWrapper>
    </SandboxLayout.Content>
  )
}

export { SettingsAccountGeneralPage }
