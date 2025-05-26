import { ElementType, ReactNode, useMemo, useState } from 'react'

import { Button, ButtonGroup, Drawer, EntityFormLayout, Input } from '@/components'
import { TranslationStore } from '@/views'

import { ConnectorsPaletteSection } from './components/ConnectorsPalleteSection'
import { AnyConnectorDefinition, ConnectorEntity } from './types'

const componentsMap: Record<
  'true' | 'false',
  {
    Header: ElementType
    Title: ElementType
    Content: ElementType
    Body: ElementType
  }
> = {
  true: {
    Header: Drawer.Header,
    Title: Drawer.Title,
    Content: Drawer.Content,
    Body: Drawer.Body
  },
  false: {
    Header: EntityFormLayout.Header,
    Title: EntityFormLayout.Title,
    Content: 'div',
    Body: 'div'
  }
}

interface ConnectorsPaletteProps {
  connectors: AnyConnectorDefinition[]
  requestClose?: () => void
  setConnectorEntity: (value: ConnectorEntity | null) => void
  onSelectConnector: () => void
  useTranslationStore: () => TranslationStore
  title?: string
  isDrawer?: boolean
  showCategory?: boolean
  children?: ReactNode
}

export const ConnectorsPalette = ({
  connectors,
  requestClose,
  setConnectorEntity,
  onSelectConnector,
  useTranslationStore,
  title = 'Connector Setup',
  isDrawer = false,
  showCategory,
  children
}: ConnectorsPaletteProps): JSX.Element => {
  const { t: _t } = useTranslationStore()
  const { Header, Title, Content, Body } = componentsMap[isDrawer ? 'true' : 'false']

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
        <Input
          placeholder={'Search'}
          onChange={value => {
            setQuery(value.target.value)
          }}
        />
      </Header>
      <Body>
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
          showCategory={showCategory}
        />
      </Body>
      {isDrawer && (
        <Drawer.Footer>
          <ButtonGroup>
            <Button variant="outline" onClick={requestClose}>
              Cancel
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      )}
      {children}
    </Content>
  )
}
