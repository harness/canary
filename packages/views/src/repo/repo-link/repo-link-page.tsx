import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { SandboxLayout } from '@views'
import { isEmpty } from 'lodash-es'
import { z } from 'zod'

import {
  Alert,
  Button,
  ButtonLayout,
  ControlGroup,
  Fieldset,
  FormInput,
  FormWrapper,
  Layout,
  Message,
  MessageTheme,
  Text
} from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

export const ACCOUNT_CONNECTOR_SPEC_TYPE = 'Account'

export interface ConnectorRef {
  ref: string
  specType?: string
}

// repoIdentifier is omitted for repo-scoped connectors (provider repo is implied by the connector).
// It is required only when connectorSpecType is Account — enforced in superRefine below.
const linkRepoSchema = z
  .object({
    connectorRef: z.string().min(1, { message: 'Please select a connector' }),
    connectorSpecType: z.string().optional(),
    repoIdentifier: z.string().optional(),
    identifier: z
      .string()
      .min(1, { message: 'Please provide a name' })
      .regex(/^[a-z0-9-_.]+$/i, { message: 'Name can only contain letters, numbers, dash, dot, or underscore' }),
    description: z.string().optional()

  })
  .superRefine((data, ctx) => {
    if (data.connectorSpecType === ACCOUNT_CONNECTOR_SPEC_TYPE && !data.repoIdentifier?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a repository on your Git provider',
        path: ['repoIdentifier']
      })
    }
  })

export type RepoLinkFormFields = z.infer<typeof linkRepoSchema>

interface RepoLinkPageProps {
  onFormSubmit: (data: RepoLinkFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  isSubmitDisabled?: boolean
  connectorSelectorRenderer: (onSelect: (connector: ConnectorRef) => void) => ReactNode
  providerRepoRenderer?: (onSelect: (repoIdentifier: string) => void) => ReactNode
  apiError?: string
}

export function RepoLinkView({
  onFormSubmit,
  onFormCancel,
  isLoading,
  isSubmitDisabled,
  connectorSelectorRenderer,
  providerRepoRenderer,
  apiError
}: RepoLinkPageProps) {
  const { t } = useTranslation()

  const formMethods = useForm<RepoLinkFormFields>({
    resolver: zodResolver(linkRepoSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      connectorRef: '',
      connectorSpecType: '',
      repoIdentifier: '',
      identifier: '',
      description: ''
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors }
  } = formMethods

  const connectorSpecType = watch('connectorSpecType')

  const handleProviderRepoSelect = (providerRepo: string) => {
    setValue('repoIdentifier', providerRepo, { shouldValidate: true })

    const baseName = providerRepo.split('/').filter(Boolean).pop() ?? providerRepo
    const harnessIdentifier = baseName.replace(/[^a-z0-9-_.]/gi, '-')
    setValue('identifier', harnessIdentifier, { shouldValidate: true })
  }

  const handleConnectorSelect = (connector: ConnectorRef) => {
    setValue('connectorRef', connector.ref, { shouldValidate: true })
    setValue('connectorSpecType', connector.specType ?? '', { shouldValidate: false })
    setValue('repoIdentifier', '', { shouldValidate: false })
    setValue('identifier', '', { shouldValidate: false })

    clearErrors(['repoIdentifier', 'identifier', 'connectorRef'])
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="mx-auto w-[635px]">
        <Layout.Vertical gap="xl">
          <Layout.Vertical gap="md">
            <Text variant="heading-section">{t('views:repos.link.title', 'Link repository')}</Text>
            <Text className="max-w-[500px]">
              {t(
                'views:repos.link.description',
                'Link your repository from a Git provider to Harness Code using a connector. This syncs all Git data but places the repository in a Read-Only state within Harness; write access must be manually enabled.'
              )}
            </Text>
          </Layout.Vertical>

          <FormWrapper {...formMethods} onSubmit={handleSubmit(onFormSubmit)}>
            <Layout.Vertical gap="3xl">
              <Layout.Vertical gap="xl">
                {/* CONNECTOR */}
                <Fieldset>
                  {connectorSelectorRenderer(handleConnectorSelect)}
                  {errors.connectorRef && (
                    <Message theme={MessageTheme.ERROR}>{errors.connectorRef.message?.toString()}</Message>
                  )}
                </Fieldset>

                {connectorSpecType === ACCOUNT_CONNECTOR_SPEC_TYPE && providerRepoRenderer && (
                  <Fieldset>
                    {providerRepoRenderer(handleProviderRepoSelect)}
                    {errors.repoIdentifier && (
                      <Message theme={MessageTheme.ERROR}>{errors.repoIdentifier.message?.toString()}</Message>
                    )}
                  </Fieldset>
                )}

                {/* NAME */}
                <Fieldset>
                  <FormInput.Text
                    id="identifier"
                    label={t('views:repos.createNewRepoForm.name.label', 'Name')}
                    {...register('identifier')}
                    placeholder={t('views:repos.createNewRepoForm.name.placeholder', 'Enter repository name')}
                    wrapperClassName="w-full"
                  />
                </Fieldset>

                {/* DESCRIPTION */}
                <Fieldset>
                  <FormInput.Textarea
                    id="description"
                    {...register('description')}
                    placeholder={t('views:repos.link.descriptionPlaceholder', 'Linked repository')}
                    label={t('views:repos.createNewRepoForm.description.label', 'Description')}
                    optional
                    resizable
                    rows={4}
                    wrapperClassName="w-full"
                  />
                </Fieldset>
              </Layout.Vertical>

              {apiError && (
                <Alert.Root theme="danger">
                  <Alert.Description>{apiError}</Alert.Description>
                </Alert.Root>
              )}

              {/* SUBMIT BUTTONS */}
              <Fieldset>
                <ControlGroup>
                  <ButtonLayout horizontalAlign="start">
                    <Button type="submit" disabled={isLoading || isSubmitDisabled || !isEmpty(errors)}>
                      {!isLoading
                        ? t('views:repos.link.linkRepository', 'Link repository')
                        : t('views:repos.link.linkingRepository', 'Linking repository...')}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onFormCancel}>
                      {t('views:repos.link.cancel', 'Cancel')}
                    </Button>
                  </ButtonLayout>
                </ControlGroup>
              </Fieldset>
            </Layout.Vertical>
          </FormWrapper>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

RepoLinkView.displayName = 'RepoLinkView'
