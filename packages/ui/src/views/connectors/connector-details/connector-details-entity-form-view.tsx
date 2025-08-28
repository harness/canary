import { FC, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@/context'
import { Alert, TimeAgoCard, ViewOnly, Widgets } from '@components/index'

import { getTransformers, InputFactory, inputTransformValues, RenderForm, RootForm } from '@harnessio/forms'

import { AnyConnectorDefinition } from '../types'
import { ConnectorDetailsItem } from './types'
import { adoptConnectorFormDefinitionToView } from './utils/connector-details-utils'

interface ConnectorDetailsEntityFormViewProps {
  connector: ConnectorDetailsItem
  getConnectorDefinition: (type: string) => AnyConnectorDefinition | undefined
  inputComponentFactory: InputFactory
  apiError?: string | null
}

export const ConnectorDetailsEntityFormView: FC<ConnectorDetailsEntityFormViewProps> = ({
  connector,
  apiError = null,
  getConnectorDefinition,
  inputComponentFactory
}) => {
  const { t } = useTranslation()
  const [connectorValues, setConnectorValues] = useState({})

  const formDefinition = useMemo(() => {
    const connectorDefinition = getConnectorDefinition(connector.type)
    return connectorDefinition ? adoptConnectorFormDefinitionToView(connectorDefinition.formDefinition) : { inputs: [] }
  }, [connector.type, getConnectorDefinition])

  useEffect(() => {
    if (connector?.spec) {
      const definition = getConnectorDefinition(connector.type)
      if (definition) {
        const transformers = getTransformers(definition?.formDefinition)
        const values = inputTransformValues(
          {
            ...connector?.spec,
            connectorMeta: {
              name: connector.name,
              type: connector.type,
              ...(connector?.description && { description: connector?.description }),
              ...(connector?.tags && { tags: connector?.tags })
            }
          },
          transformers
        )
        setConnectorValues(values)
      }
    }
  }, [connector.name, connector?.spec, connector.type, getConnectorDefinition, connector?.description, connector?.tags])

  return (
    <>
      <Widgets.Root>
        <Widgets.Item title={t('views:common.details', 'Details')}>
          <ViewOnly
            title={t('views:common.overview', 'Overview')}
            data={[
              { label: t('views:connectors.connectorName', 'Connector name'), value: connector.name },
              { label: t('views:connectors.connectorId', 'Connector ID'), value: connector.type },
              { label: t('views:common.type', 'Type'), value: connector.type },
              {
                label: t('views:common.createdOn', 'Created on'),
                value: <TimeAgoCard timestamp={connector.createdAt} cutoffDays={0} />
              },
              {
                label: t('views:common.modifiedOn', 'Modified on'),
                value: <TimeAgoCard timestamp={connector.lastModifiedAt} cutoffDays={0} />
              }
              // TODO: update or delete
              // { label: 'Created by', value: '' },
              // { label: 'Term of service aggreed to', value: '' },
              // { label: 'Updated by', value: '' }
            ]}
            layout="columns"
          />
          <RootForm defaultValues={connectorValues} resolver={undefined} mode="onSubmit" onSubmit={() => {}}>
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
