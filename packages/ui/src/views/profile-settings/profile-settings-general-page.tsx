import { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  Alert,
  Avatar,
  Button,
  ButtonGroup,
  ControlGroup,
  Fieldset,
  FormSeparator,
  FormWrapper,
  Icon,
  Input,
  Legend
} from '@/components'
import { SkeletonForm } from '@/components/skeletons'
import { IProfileSettingsStore, ProfileSettingsErrorType, SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { getInitials } from '@utils/stringUtils'
import { z } from 'zod'

const makeProfileSchema = (t: TranslationStore['t']) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: t('views:profileSettings.validation.nameMin', 'Please provide your name') })
      .max(256, {
        message: t('views:profileSettings.validation.nameMax', 'Name must be no longer than 256 characters')
      }),
    username: z
      .string()
      .trim()
      .min(1, {
        message: t('views:profileSettings.validation.usernameMin', 'Please provide a username')
      }),
    email: z
      .string()
      .trim()
      .email({
        message: t('views:profileSettings.validation.emailInvalid', 'Please provide a valid email address')
      })
      .max(250, {
        message: t('views:profileSettings.validation.emailMax', 'Email must be no longer than 250 characters')
      })
  })

const makePasswordSchema = (t: TranslationStore['t']) =>
  z
    .object({
      newPassword: z
        .string()
        .min(6, {
          message: t('views:profileSettings.validation.passwordMin', 'New password must be at least 6 characters')
        })
        .max(128, {
          message: t(
            'views:profileSettings.validation.passwordMax',
            'New password must be no longer than 128 characters'
          )
        }),
      confirmPassword: z.string().min(6, {
        message: t('views:profileSettings.validation.confirmPasswordMin', 'Please confirm your new password')
      })
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      message: t('views:profileSettings.validation.passwordsDoNotMatch', 'Passwords do not match'),
      path: ['confirmPassword']
    })

export type ProfileFields = z.infer<ReturnType<typeof makeProfileSchema>>
export type PasswordFields = z.infer<ReturnType<typeof makePasswordSchema>>

interface SettingsAccountGeneralPageProps {
  isLoadingUser: boolean
  isUpdatingUser: boolean
  isUpdatingPassword: boolean
  profileUpdateSuccess: boolean
  passwordUpdateSuccess: boolean
  error: { type: ProfileSettingsErrorType; message: string } | null
  onUpdateUser: (data: Omit<ProfileFields, 'username'>) => void
  onUpdatePassword: (data: PasswordFields) => void
  useProfileSettingsStore: () => IProfileSettingsStore
  useTranslationStore: () => TranslationStore
}

const SUCCESS_MESSAGE_DURATION = 2000

export const SettingsAccountGeneralPage: FC<SettingsAccountGeneralPageProps> = ({
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

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { errors: profileErrors, isValid: isProfileValid, dirtyFields: profileDirtyFields }
  } = useForm<ProfileFields>({
    resolver: zodResolver(makeProfileSchema(t)),
    mode: 'onChange',
    defaultValues: {
      name: userData?.name || '',
      username: userData?.username || '',
      email: userData?.email || ''
    }
  })

  const {
    register: registerPassword,
    reset: resetPasswordForm,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isValid: isPasswordValid }
  } = useForm<PasswordFields>({
    resolver: zodResolver(makePasswordSchema(t)),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  useEffect(() => {
    if (!userData) return

    resetProfileForm(userData)
  }, [resetProfileForm, userData])

  useEffect(() => {
    if (profileUpdateSuccess && userData) {
      resetProfileForm(userData)

      setProfileSubmitted(true)
      const timer = setTimeout(() => setProfileSubmitted(false), SUCCESS_MESSAGE_DURATION)

      return () => clearTimeout(timer)
    }
  }, [profileUpdateSuccess, resetProfileForm, userData])

  useEffect(() => {
    if (passwordUpdateSuccess) {
      resetPasswordForm()

      setPasswordSubmitted(true)
      const timer = setTimeout(() => setPasswordSubmitted(false), SUCCESS_MESSAGE_DURATION)

      return () => clearTimeout(timer)
    }
  }, [passwordUpdateSuccess, resetPasswordForm])

  const onProfileSubmit: SubmitHandler<ProfileFields> = data => {
    const { username: _, ...updatedData } = data
    onUpdateUser(updatedData)
  }

  const onPasswordSubmit: SubmitHandler<PasswordFields> = data => {
    onUpdatePassword(data)
  }

  const renderErrorMessage = (type: ProfileSettingsErrorType, message: string) =>
    error?.type === type && (
      <Alert.Container variant="destructive">
        <Alert.Title>{message}</Alert.Title>
      </Alert.Container>
    )

  return (
    <SandboxLayout.Content className="max-w-[476px] px-0">
      <h1 className="text-24 text-foreground-1 mb-10 font-medium">
        {t('views:profileSettings.accountSettings', 'Account settings')}
      </h1>

      {isLoadingUser && <SkeletonForm />}

      {!isLoadingUser && (
        <>
          <FormWrapper onSubmit={handleProfileSubmit(onProfileSubmit)}>
            <Legend title={t('views:profileSettings.personalInfo', 'Personal information')} />
            {/*
              FIXME: Avatar size does not work correctly
              issue – https://github.com/harness/canary/issues/817
            */}
            <Avatar.Root size="20" className="shadow-md">
              <Avatar.Image src="/images/anon.jpg" />
              <Avatar.Fallback className="text-24 text-foreground-3 font-medium">
                {getInitials(userData?.name || '')}
              </Avatar.Fallback>
            </Avatar.Root>
            <Fieldset>
              <Input
                id="name"
                size="md"
                {...registerProfile('name')}
                placeholder={t('views:profileSettings.enterNamePlaceholder', 'Enter your name')}
                label={t('views:profileSettings.name', 'Name')}
                error={profileErrors?.name?.message?.toString()}
                disabled={isUpdatingUser}
              />
            </Fieldset>
            <Fieldset>
              <Input
                id="username"
                size="md"
                {...registerProfile('username')}
                placeholder={t('views:profileSettings.enterUsernamePlaceholder', 'Enter your username')}
                disabled
                label={t('views:profileSettings.username', 'Username')}
                caption={t(
                  'views:profileSettings.enterUsernameCaption',
                  'This username will be shown across the platform.'
                )}
                error={profileErrors?.username?.message?.toString()}
              />
            </Fieldset>
            <Fieldset>
              <Input
                id="email"
                size="md"
                {...registerProfile('email')}
                placeholder="name@domain.com"
                label={t('views:profileSettings.accountEmail', 'Account email')}
                error={profileErrors?.email?.message}
                disabled={isUpdatingUser}
              />
            </Fieldset>

            {renderErrorMessage(ProfileSettingsErrorType.PROFILE, error?.message || '')}

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
                  <Button className="pointer-events-none" variant="ghost" type="button" theme="success">
                    {t('views:profileSettings.updatedButton', 'Updated')}&nbsp;&nbsp;
                    <Icon name="tick" size={14} />
                  </Button>
                )}
              </ButtonGroup>
            </ControlGroup>
          </FormWrapper>

          <FormSeparator className="border-borders-4 my-7" />

          <FormWrapper onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
            <Legend
              title={t('views:profileSettings.passwordSettingsTitle', 'Password settings')}
              description={t(
                'views:profileSettings.passwordSettingsDesc',
                'Minimum of 6 characters long containing at least one number and a mixture of uppercase and lowercase letters.'
              )}
            />
            <Fieldset>
              <Input
                id="newPassword"
                type="password"
                size="md"
                {...registerPassword('newPassword')}
                placeholder={t('views:profileSettings.enterPasswordPlaceholder', 'Enter a new password')}
                label={t('views:profileSettings.newPassword', 'New password')}
                error={passwordErrors?.newPassword?.message}
                disabled={isUpdatingPassword}
              />
            </Fieldset>
            <Fieldset>
              <Input
                id="confirmPassword"
                type="password"
                size="md"
                {...registerPassword('confirmPassword')}
                placeholder={t('views:profileSettings.confirmPasswordPlaceholder', 'Confirm your new password')}
                label={t('views:profileSettings.confirmPassword', 'Confirm password')}
                error={passwordErrors?.confirmPassword?.message}
                disabled={isUpdatingPassword}
              />
            </Fieldset>

            {renderErrorMessage(ProfileSettingsErrorType.PASSWORD, error?.message || '')}

            <ControlGroup type="button">
              <ButtonGroup>
                {!passwordSubmitted ? (
                  <Button type="submit" disabled={!isPasswordValid || isUpdatingPassword}>
                    {isUpdatingPassword
                      ? t('views:profileSettings.updating', 'Updating...')
                      : t('views:profileSettings.updatePassword', 'Update password')}
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
        </>
      )}
    </SandboxLayout.Content>
  )
}
