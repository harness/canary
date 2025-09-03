import { FC, useMemo, useState } from 'react'

import { useTranslation } from '@/context'
import { Alert, ViewOnly, Widgets } from '@components/index'
import { SandboxLayout } from '@views/layouts/SandboxLayout'

import { IFormDefinition, InputFactory, RenderForm, RootForm } from '@harnessio/forms'

import { SecretListItem } from '../secrets-list'
import { adoptSecretFormDefinitionToView } from './utils/secret-details-utils'

interface SecretDetailsConfigEntityFormProps {
  secret: SecretListItem
  inputComponentFactory: InputFactory
  apiError?: string | null
  secretFormDefinition: IFormDefinition
}

export const SecretDetailsConfigEntityForm: FC<SecretDetailsConfigEntityFormProps> = ({
  secret,
  apiError = null,
  inputComponentFactory,
  secretFormDefinition
}) => {
  const { t } = useTranslation()
  const [secretValues] = useState({})

  const formDefinition = useMemo(() => {
    // const connectorDefinition = getConnectorDefinition(connector.type)
    return secretFormDefinition ? adoptSecretFormDefinitionToView(secretFormDefinition) : { inputs: [] }
  }, [secretFormDefinition])

  //   useEffect(() => {
  //     if (connector?.spec) {
  //       const definition = getConnectorDefinition(connector.type)
  //       if (definition) {
  //         const transformers = getTransformers(definition?.formDefinition)
  //         const values = inputTransformValues(
  //           {
  //             ...connector?.spec,
  //             connectorMeta: {
  //               name: connector.name,
  //               type: connector.type,
  //               ...(connector?.description && { description: connector?.description }),
  //               ...(connector?.tags && { tags: connector?.tags })
  //             }
  //           },
  //           transformers
  //         )
  //         setConnectorValues(values)
  //       }
  //     }
  //   }, [connector.name, connector?.spec, connector.type, getConnectorDefinition, connector?.description, connector?.tags])

  return (
    <SandboxLayout.Content className={'px-0'}>
      <Widgets.Root>
        <Widgets.Item title={t('views:common.details', 'Details')}>
          <ViewOnly
            title={t('views:common.overview', 'Overview')}
            data={[{ label: t('views:secrets.secretName', 'Secret name'), value: secret.name }]}
          />
          <ViewOnly
            title={t('views:common.credentials', 'Credentials')}
            data={[{ label: t('views:common.type', 'Type'), value: secret.spec?.secretManagerIdentifier }]}
          />
          <ViewOnly
            title={t('views:common.metadata', 'Metadata')}
            data={[
              { label: t('views:common.labels', 'Labels'), value: secret.tags?.join(', ') },
              { label: t('views:common.description', 'Description'), value: secret.description }
            ]}
          />
          <RootForm defaultValues={secretValues} resolver={undefined} mode="onSubmit" onSubmit={() => {}}>
            <RenderForm className="space-y-6" factory={inputComponentFactory} inputs={formDefinition} />
          </RootForm>
        </Widgets.Item>
      </Widgets.Root>
      {apiError && (
        <Alert.Root theme="danger">
          <Alert.Description>{apiError.toString()}</Alert.Description>
        </Alert.Root>
      )}
    </SandboxLayout.Content>
  )
}
