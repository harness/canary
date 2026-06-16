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

export interface ConnectorRef {
  ref: string
}

const linkRepoSchema = z.object({
  connectorRef: z.string().min(1, { message: 'Please select a connector' }),
  identifier: z
    .string()
    .min(1, { message: 'Please provide a name' })
    .regex(/^[a-z0-9-_.]+$/i, { message: 'Name can only contain letters, numbers, dash, dot, or underscore' }),
  description: z.string().optional()
})

export type RepoLinkFormFields = z.infer<typeof linkRepoSchema>

interface RepoLinkPageProps {
  onFormSubmit: (data: RepoLinkFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  isSubmitDisabled?: boolean
  connectorSelectorRenderer: (onSelect: (connector: ConnectorRef) => void) => ReactNode
  apiError?: string
}

export function RepoLinkView({
  onFormSubmit,
  onFormCancel,
  isLoading,
  isSubmitDisabled,
  connectorSelectorRenderer,
  apiError
}: RepoLinkPageProps) {
  const { t } = useTranslation()

  const formMethods = useForm<RepoLinkFormFields>({
    resolver: zodResolver(linkRepoSchema),
    mode: 'onChange',
    defaultValues: {
      connectorRef: '',
      identifier: '',
      description: ''
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = formMethods

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
                  {connectorSelectorRenderer((connector: ConnectorRef) => {
                    setValue('connectorRef', connector.ref, { shouldValidate: true })
                  })}
                  {errors.connectorRef && (
                    <Message theme={MessageTheme.ERROR}>{errors.connectorRef.message?.toString()}</Message>
                  )}
                </Fieldset>

                {/* NAME */}
                <Fieldset>
                  <FormInput.Text
                    id="identifier"
                    label={t('views:repos.createNewRepoForm.name.label', 'Name')}
                    {...register('identifier')}
                    placeholder={t('views:repos.createNewRepoForm.name.placeholder', 'Enter repository name')}
                    autoFocus
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
