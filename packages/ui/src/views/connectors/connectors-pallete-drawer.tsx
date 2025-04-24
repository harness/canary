import { useMemo, useState } from 'react'

import { TranslationStore } from '@/views'
import { Button } from '@components/button'
import { Input } from '@components/input'
import { Spacer } from '@components/spacer'
import { StepFormLayout } from '@views/unified-pipeline-studio/components/palette-drawer/components/step-form-layout'
import { StepsPaletteContentLayout } from '@views/unified-pipeline-studio/components/palette-drawer/components/step-palette-content-layout'

import { ConnectorsPaletteLayout } from './components/connectors-pallete-layout'
import { ConnectorsPaletteSection } from './components/ConnectorsPalleteSection'
import { AnyConnectorDefinition, ConnectorEntity } from './types'

interface ConnectorsPaletteProps {
  connectors: AnyConnectorDefinition[]
  requestClose: () => void
  setConnectorEntity: (value: ConnectorEntity | null) => void
  onSelectConnector: () => void
  useTranslationStore: () => TranslationStore
  title?: string
  subtitle?: string
}

export const ConnectorsPalette = (props: ConnectorsPaletteProps): JSX.Element => {
  const {
    connectors,
    requestClose,
    setConnectorEntity,
    onSelectConnector,
    useTranslationStore,
    title = 'Connector Setup',
    subtitle = 'Select a Connector'
  } = props
  const { t: _t } = useTranslationStore()

  const [query, setQuery] = useState('')

  const connectorsFiltered = useMemo(
    () =>
      connectors.filter((connector: { name: string }) => connector.name.toLowerCase().includes(query.toLowerCase())),
    [query, connectors]
  )

  return (
    <ConnectorsPaletteLayout.Root>
      <ConnectorsPaletteLayout.Header withBorder>
        <ConnectorsPaletteLayout.Title>{title}</ConnectorsPaletteLayout.Title>
        <ConnectorsPaletteLayout.Subtitle className="text-cn-foreground-2">{subtitle}</ConnectorsPaletteLayout.Subtitle>
        <Input
          placeholder={'Search'}
          onChange={value => {
            setQuery(value.target.value)
          }}
        />
      </ConnectorsPaletteLayout.Header>
      <StepsPaletteContentLayout.Root>
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
        <Spacer size={8} />
      </StepsPaletteContentLayout.Root>
      <StepFormLayout.Footer withBorder>
        <Button variant="outline" onClick={requestClose}>
          Cancel
        </Button>
      </StepFormLayout.Footer>
    </ConnectorsPaletteLayout.Root>
  )
}
