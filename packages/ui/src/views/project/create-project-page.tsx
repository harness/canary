import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  Button,
  Card,
  Fieldset,
  FormWrapper,
  Icon,
  Input,
  Message,
  MessageTheme,
  StyledLink,
  StyledLinkProps
} from '@/components'
import { useTheme } from '@/context'
import { Floating1ColumnLayout, makeProjectDescriptionSchema, makeProjectNameSchema, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@utils/cn'
import { z } from 'zod'

import { CreateProjectAnimatedLogo } from './create-project-animated-logo'

export interface CreateProjectPageCommonProps {
  error?: string
  isLoading?: boolean
  onFormSubmit: (data: CreateProjectFields) => void
  useTranslationStore: () => TranslationStore
}

interface CreateFirstProjectPageProps extends CreateProjectPageCommonProps {
  /**
   * The new project must have no Back button in the header.
   */
  logoutLinkProps: StyledLinkProps
  isAdditional?: never
  backLinkProps?: never
}

interface CreateAdditionalProjectPageProps extends CreateProjectPageCommonProps {
  /**
   * If the project is being created as an additional one,
   * the Back button will be displayed in the header.
   */
  isAdditional: boolean
  logoutLinkProps?: never
  backLinkProps: StyledLinkProps
}

export type CreateProjectPageProps = CreateFirstProjectPageProps | CreateAdditionalProjectPageProps

const getIsAdditionalProjectPage = (props: CreateProjectPageProps): props is CreateAdditionalProjectPageProps => {
  return 'isAdditional' in props && props.isAdditional === true
}
const getIsFirstProjectPage = (props: CreateProjectPageProps): props is CreateFirstProjectPageProps => {
  return 'logoutLinkProps' in props
}

export const makeCreateProjectSchema = (t: TranslationStore['t']) =>
  z.object({
    name: makeProjectNameSchema(t, t('views:createProject.form.name')),
    description: makeProjectDescriptionSchema(t, t('views:createProject.form.description'))
  })

export type CreateProjectFields = z.infer<ReturnType<typeof makeCreateProjectSchema>>

export const CreateProjectPage: FC<CreateProjectPageProps> = props => {
  const { error, isLoading, backLinkProps, onFormSubmit, useTranslationStore } = props
  const [serverError, setServerError] = useState<string | null>(null)

  const { isLightTheme } = useTheme()

  const isAdditional = getIsAdditionalProjectPage(props)
  const isFirst = getIsFirstProjectPage(props)
  const isWithBackButton = !!backLinkProps?.to && isAdditional

  const { t } = useTranslationStore()

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<CreateProjectFields>({
    mode: 'onChange',
    resolver: zodResolver(makeCreateProjectSchema(t))
  })

  const handleInputChange = async () => {
    if (!serverError) return
    setServerError(null)
  }

  useEffect(() => {
    if (!error) return
    setServerError(error)
  }, [error])

  const hasError = Object.keys(errors).length > 0 || !!serverError

  return (
    <Floating1ColumnLayout
      className="bg-background-7 flex-col justify-start pt-20 sm:pt-[8.75rem]"
      highlightTheme={hasError ? 'error' : 'green'}
      verticalCenter
    >
      {isWithBackButton && (
        <StyledLink
          {...backLinkProps}
          variant="secondary"
          className={cn('fixed left-[14.5%] top-[3.25rem] flex items-center gap-1 p-2', backLinkProps?.className)}
        >
          <Icon size={12} name="chevron-down" className="rotate-90" /> {t('views:createProject.backButton', 'Back')}
        </StyledLink>
      )}

      <div className="relative z-10 w-80 max-w-full">
        <div className="mb-10 grid justify-items-center">
          {isLightTheme ? (
            <Icon size={112} name="create-workspace-light" />
          ) : (
            <CreateProjectAnimatedLogo hasError={hasError} />
          )}

          <Card.Title className="text-foreground-1 mt-3 text-center" as="h1">
            {t('views:createProject.title', 'Create your new project')}
          </Card.Title>

          <p className="text-foreground-4 mt-0.5 text-center text-sm leading-snug">
            {t('views:createProject.description', 'Organize your repositories, pipelines and more.')}
          </p>
        </div>

        <FormWrapper onSubmit={handleSubmit(onFormSubmit)}>
          <Fieldset legend="Project details">
            <Input
              id="name"
              label={t('views:createProject.form.name', 'Project name')}
              placeholder={t('views:createProject.form.namePlaceholder', 'Enter your project name')}
              size="md"
              {...register('name', { onChange: handleInputChange })}
              error={errors.name?.message?.toString()}
              autoFocus
            />

            <Input
              id="description"
              {...register('description', { onChange: handleInputChange })}
              label={t('views:createProject.form.description', 'Description')}
              placeholder={t('views:createProject.form.descriptionPlaceholder', 'Enter a description (optional)')}
              size="md"
              error={errors.description?.message?.toString()}
            />
          </Fieldset>

          {error && (
            <Message className="mt-1" theme={MessageTheme.ERROR}>
              {error}
            </Message>
          )}

          <Button
            className="mt-3 w-full"
            borderRadius="full"
            type="submit"
            size="md"
            loading={isLoading}
            disabled={hasError}
          >
            {isLoading
              ? t('views:createProject.create.projectCreation', 'Creating project...')
              : t('views:createProject.create.createProject', 'Create project')}
          </Button>
        </FormWrapper>

        {isFirst && (
          <p className="foreground-5 text-foreground-5 mt-4 text-center text-sm">
            {t('views:createProject.logout.question', 'Want to use a different account?')}{' '}
            <StyledLink {...props.logoutLinkProps} variant="accent">
              {t('views:createProject.logout.link', 'Log out')}
            </StyledLink>
          </p>
        )}
      </div>
    </Floating1ColumnLayout>
  )
}
