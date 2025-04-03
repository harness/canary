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
}

export const ConnectorsPalette = (props: ConnectorsPaletteProps): JSX.Element => {
  const { connectors, requestClose, setConnectorEntity, onSelectConnector, useTranslationStore } = props
  const { t: _t } = useTranslationStore()

  const [query, setQuery] = useState('')

  const connectorsFiltered = useMemo(
    () =>
      connectors.filter((connector: { name: string }) => connector.name.toLowerCase().includes(query.toLowerCase())),
    [query, connectors]
  )

  return (
    <ConnectorsPaletteLayout.Root>
      <ConnectorsPaletteLayout.Header className="!border-none !p-0">
        <ConnectorsPaletteLayout.Title className="!mt-0">Connector Setup</ConnectorsPaletteLayout.Title>
        <ConnectorsPaletteLayout.Subtitle className="text-cn-foreground-2">
          {'Select a Connector'}
        </ConnectorsPaletteLayout.Subtitle>
        <Input
          placeholder={'Search'}
          onChange={value => {
            setQuery(value.target.value)
          }}
        />
      </ConnectorsPaletteLayout.Header>
      <StepsPaletteContentLayout.Root className="!px-0">
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
      <StepFormLayout.Footer className="border-none">
        <div className="absolute inset-x-0 bottom-0 bg-cn-background-2 p-4 shadow-md">
          <Button variant="secondary" onClick={requestClose}>
            Cancel
          </Button>
        </div>
      </StepFormLayout.Footer>
    </ConnectorsPaletteLayout.Root>
  )
}
