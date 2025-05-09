import { ElementType, useMemo, useState } from 'react'

import { Button, Drawer, EntityFormLayout, Input } from '@/components'
import { TranslationStore } from '@/views'

import { ConnectorsPaletteSection } from './components/ConnectorsPalleteSection'
import { AnyConnectorDefinition, ConnectorEntity } from './types'

const componentsMap: Record<
  'true' | 'false',
  {
    Header: ElementType
    Title: ElementType
    Description: ElementType
    Content: ElementType
    Inner: ElementType
  }
> = {
  true: {
    Header: Drawer.Header,
    Title: Drawer.Title,
    Description: Drawer.Description,
    Content: Drawer.Content,
    Inner: Drawer.Inner
  },
  false: {
    Header: EntityFormLayout.Header,
    Title: EntityFormLayout.Title,
    Description: EntityFormLayout.Description,
    Content: 'div',
    Inner: 'div'
  }
}

interface ConnectorsPaletteProps {
  connectors: AnyConnectorDefinition[]
  requestClose?: () => void
  setConnectorEntity: (value: ConnectorEntity | null) => void
  onSelectConnector: () => void
  useTranslationStore: () => TranslationStore
  title?: string
  subtitle?: string
  isDrawer?: boolean
}

export const ConnectorsPalette = ({
  connectors,
  requestClose,
  setConnectorEntity,
  onSelectConnector,
  useTranslationStore,
  title = 'Connector Setup',
  subtitle = 'Select a Connector',
  isDrawer = false
}: ConnectorsPaletteProps): JSX.Element => {
  const { t: _t } = useTranslationStore()
  const { Header, Title, Description, Content, Inner } = componentsMap[isDrawer ? 'true' : 'false']

  const [query, setQuery] = useState('')

  const connectorsFiltered = useMemo(
    () =>
      connectors.filter((connector: { name: string }) => connector.name.toLowerCase().includes(query.toLowerCase())),
    [query, connectors]
  )

  return (
    <Content>
      <Header>
        <Title>{title}</Title>
        <Description>{subtitle}</Description>
        <Input
          placeholder={'Search'}
          onChange={value => {
            setQuery(value.target.value)
          }}
        />
      </Header>
      <Inner>
        <ConnectorsPaletteSection
          connectors={connectorsFiltered}
          onSelect={connector => {
            setConnectorEntity({
              type: connector.type,
              name: connector.name,
              spec: {}
            })
            onSelectConnector()
          }}
          useTranslationStore={useTranslationStore}
        />
      </Inner>
      {isDrawer && (
        <Drawer.Footer>
          <Button variant="outline" onClick={requestClose}>
            Cancel
          </Button>
        </Drawer.Footer>
      )}
    </Content>
  )
}
