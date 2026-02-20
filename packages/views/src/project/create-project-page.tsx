import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { LinkProps } from 'react-router-dom'

import {
  Button,
  ControlGroup,
  Fieldset,
  FormInput,
  FormWrapper,
  Illustration,
  Link as StyledLink,
  LinkProps as StyledLinkProps,
  Text
} from '@harnessio/ui/components'
import { TFunctionWithFallback, useRouterContext, useTheme, useTranslation } from '@harnessio/ui/context'
import { Floating1ColumnLayout } from '@views'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@harnessio/ui/utils'
import { z } from 'zod'

import { CreateProjectAnimatedLogo } from './create-project-animated-logo'

export interface CreateProjectPageCommonProps {
  error?: string
  isLoading?: boolean
  onFormSubmit: (data: CreateProjectFields) => void
  importProjectLinkProps: LinkProps
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

const createProjectSchema = (t: TFunctionWithFallback) =>
  z.object({
    name: z
      .string()
      .nonempty(t('views:createProject.validation.nameNoEmpty', 'The field can’t be blank'))
      .min(4, {
        message: t('views:createProject.validation.nameMinLength', 'The project name should be at least 4 characters')
      }),
    description: z.string()
  })

export type CreateProjectFields = z.infer<ReturnType<typeof createProjectSchema>>

export const CreateProjectPage: FC<CreateProjectPageProps> = props => {
  const { error, isLoading, backLinkProps, importProjectLinkProps, onFormSubmit } = props
  const { isLightTheme } = useTheme()
  const { Link } = useRouterContext()

  const isAdditional = getIsAdditionalProjectPage(props)
  const isFirst = getIsFirstProjectPage(props)
  const isWithBackButton = (!backLinkProps?.external ? !!backLinkProps?.to : !!backLinkProps?.href) && isAdditional

  const { t } = useTranslation()

  const [serverError, setServerError] = useState<string | null>(null)
  const formWrapper = useForm<CreateProjectFields>({
    resolver: zodResolver(createProjectSchema(t))
  })

  const {
    trigger,
    register,
    setError,
    formState: { errors },
    clearErrors,
    handleSubmit
  } = formWrapper

  const handleInputChange = async () => {
    clearErrors()

    if (serverError) {
      setServerError(null)
      await trigger()
    }
  }

  useEffect(() => {
    if (error) {
      setServerError(error)
      setError('name', { type: 'manual', message: error })
    } else {
      setServerError(null)
      clearErrors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const hasError = Object.keys(errors).length > 0 || !!serverError

  return (
    <Floating1ColumnLayout
      className="flex-col justify-start bg-cn-1 pt-cn-4xl sm:pt-[140px]"
      highlightTheme={hasError ? 'error' : 'green'}
      verticalCenter
    >
      {isWithBackButton && (
        <StyledLink
          {...(backLinkProps as StyledLinkProps)}
          prefixIcon
          variant="secondary"
          className={cn('fixed left-[14.5%] top-[3.25rem] p-cn-xs', backLinkProps?.className)}
        >
          {t('views:createProject.backButton', 'Back')}
        </StyledLink>
      )}

      <div className="relative z-10 w-80 max-w-full">
        <div className="mb-cn-3xl grid justify-items-center">
          {isLightTheme ? (
            <Illustration name="create-workspace-light" />
          ) : (
            <CreateProjectAnimatedLogo hasError={hasError} />
          )}

          <Text className="mt-cn-sm" variant="heading-section" align="center" as="h1">
            {t('views:createProject.title', 'Create your new project')}
          </Text>

          <Text className="mt-cn-4xs">
            {t('views:createProject.description', 'Organize your repositories, pipelines and more.')}
          </Text>
        </div>

        <FormWrapper {...formWrapper} onSubmit={handleSubmit(onFormSubmit)}>
          <Fieldset>
            <FormInput.Text
              id="name"
              label={t('views:createProject.form.name', 'Project name')}
              placeholder={t('views:createProject.form.namePlaceholder', 'Enter your project name')}
              {...register('name', { onChange: handleInputChange })}
              autoFocus
            />

            <FormInput.Text
              id="description"
              {...register('description', { onChange: handleInputChange })}
              label={t('views:createProject.form.description', 'Description')}
              placeholder={t('views:createProject.form.descriptionPlaceholder', 'Enter a description (optional)')}
            />
          </Fieldset>

          <ControlGroup type="button">
            <Button className="mt-cn-sm w-full" rounded type="submit" loading={isLoading} disabled={hasError}>
              {isLoading
                ? t('views:createProject.create.projectCreation', 'Creating project...')
                : t('views:createProject.create.createProject', 'Create project')}
            </Button>

            <div className="mt-cn-sm gap-cn-xs flex items-center justify-center">
              <div className="border-cn-3 w-[145px] shrink border-t" />
              <Text color="foreground-3" as="span">
                {t('views:createProject.or', 'or')}
              </Text>
              <div className="w-[145px] shrink border-t border-cn-3" />
            </div>

            {/* TODO: Update the variant of this button to outline once the component supports this style. */}
            <Button asChild className="mt-cn-sm w-full" rounded variant="outline">
              <Link to={importProjectLinkProps.to}>{t('views:createProject.importProject', 'Import project')}</Link>
            </Button>
          </ControlGroup>
        </FormWrapper>

        {isFirst && (
          <Text className="mt-cn-md" align="center" color="foreground-3">
            {t('views:createProject.logout.question', 'Want to use a different account?')}{' '}
            <StyledLink {...props.logoutLinkProps}>{t('views:createProject.logout.link', 'Log out')}</StyledLink>
          </Text>
        )}
      </div>
    </Floating1ColumnLayout>
  )
}
