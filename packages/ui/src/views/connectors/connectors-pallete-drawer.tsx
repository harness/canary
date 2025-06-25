import { ElementType, ReactNode, useMemo, useState } from 'react'

import { Button, ButtonLayout, Drawer, EntityFormLayout, Input } from '@/components'
import { useTranslation } from '@/context'

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
  title = 'Connector Setup',
  isDrawer = false,
  showCategory,
  children
}: ConnectorsPaletteProps): JSX.Element => {
  const { t: _t } = useTranslation()
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
          value={query}
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
          showCategory={showCategory}
        />
      </Body>
      {isDrawer && (
        <Drawer.Footer>
          <ButtonLayout.Root>
            <ButtonLayout.Secondary>
              <Button variant="outline" onClick={requestClose}>
                Cancel
              </Button>
            </ButtonLayout.Secondary>
          </ButtonLayout.Root>
        </Drawer.Footer>
      )}
      {children}
    </Content>
  )
}
