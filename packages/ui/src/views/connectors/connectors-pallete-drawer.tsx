import { ElementType, useMemo, useState } from 'react'

import { Button, Drawer, EntityFormLayout, Input } from '@/components'
import { useTranslation } from '@/context'

import { ConnectorsPaletteSection } from './components/ConnectorsPalleteSection'
import { AnyConnectorDefinition, ConnectorEntity } from './types'

const componentsMap: Record<
  'true' | 'false',
  {
    Header: ElementType
    Title: ElementType
    Content: ElementType
    Inner: ElementType
  }
> = {
  true: {
    Header: Drawer.Header,
    Title: Drawer.Title,
    Content: Drawer.Content,
    Inner: Drawer.Inner
  },
  false: {
    Header: EntityFormLayout.Header,
    Title: EntityFormLayout.Title,
    Content: 'div',
    Inner: 'div'
  }
}

interface ConnectorsPaletteProps {
  connectors: AnyConnectorDefinition[]
  requestClose?: () => void
  setConnectorEntity: (value: ConnectorEntity | null) => void
  onSelectConnector: () => void
  title?: string
  isDrawer?: boolean
  showCategory?: boolean
}

export const ConnectorsPalette = ({
  connectors,
  requestClose,
  setConnectorEntity,
  onSelectConnector,
  title = 'Connector Setup',
  isDrawer = false,
  showCategory
}: ConnectorsPaletteProps): JSX.Element => {
  const { t: _t } = useTranslation()
  const { Header, Title, Content, Inner } = componentsMap[isDrawer ? 'true' : 'false']

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
          showCategory={showCategory}
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
