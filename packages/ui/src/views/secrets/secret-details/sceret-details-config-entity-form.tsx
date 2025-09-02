import { FC, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@/context'
import { Alert, TimeAgoCard, ViewOnly, Widgets } from '@components/index'

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
    <>
      <Widgets.Root>
        <Widgets.Item title={t('views:common.details', 'Details')}>
          <ViewOnly
            title={t('views:common.overview', 'Overview')}
            data={[
              { label: t('views:secrets.secretName', 'Secret name'), value: secret.name },
              { label: t('views:secrets.secretId', 'Secret ID'), value: secret.identifier },
              { label: t('views:common.type', 'Type'), value: secret.spec?.secretManagerIdentifier },
              {
                label: t('views:common.createdOn', 'Created on'),
                value: <TimeAgoCard timestamp={secret.createdAt} cutoffDays={0} />
              },
              {
                label: t('views:common.modifiedOn', 'Modified on'),
                value: <TimeAgoCard timestamp={secret.updatedAt} cutoffDays={0} />
              }
              // TODO: update or delete
              // { label: 'Created by', value: '' },
              // { label: 'Term of service aggreed to', value: '' },
              // { label: 'Updated by', value: '' }
            ]}
            layout="columns"
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
    </>
  )
}
