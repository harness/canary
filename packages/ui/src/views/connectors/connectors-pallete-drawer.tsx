import { useMemo, useState } from 'react'

import { Button } from '@components/button'
import { Input } from '@components/input'
import { Spacer } from '@components/spacer'
import { StepFormLayout } from '@views/unified-pipeline-studio/components/palette-drawer/components/step-form-layout'
import { StepsPaletteContentLayout } from '@views/unified-pipeline-studio/components/palette-drawer/components/step-palette-content-layout'

import { ConnectorsPaletteLayout } from './components/connectors-pallete-layout'
import { ConnectorsPaletteSection } from './components/ConnectorsPalleteSection'
import { harnessConnectors } from './harness-connectors/utils'
import { ConnectorRightDrawer } from './types'

interface ConnectorsPaletteProps {
  connectors: any //TODO: proper type
  requestClose: () => void
  setFormEntity: (formEntity: any) => void
  setRightDrawer: (value: ConnectorRightDrawer) => void
}

export const ConnectorsPalette = (props: ConnectorsPaletteProps): JSX.Element => {
  const { connectors, requestClose, setFormEntity, setRightDrawer } = props

  const [query, setQuery] = useState('')

  const connectorsFiltered = useMemo(
    () => connectors.filter((connector: { identifier: string | string[] }) => connector.identifier.includes(query)),
    [query, harnessConnectors]
  )

  return (
    <ConnectorsPaletteLayout.Root>
      <ConnectorsPaletteLayout.Header>
        <ConnectorsPaletteLayout.Title>Connector Setup</ConnectorsPaletteLayout.Title>
        <ConnectorsPaletteLayout.Subtitle>Select a Connector</ConnectorsPaletteLayout.Subtitle>
        <Input
          placeholder="Search"
          onChange={value => {
            setQuery(value.target.value)
          }}
        />
      </ConnectorsPaletteLayout.Header>
      <StepsPaletteContentLayout.Root>
        <ConnectorsPaletteSection
          connectors={connectorsFiltered}
          onSelect={connector => {
            setFormEntity({
              type: 'connector',
              data: {
                identifier: connector.identifier,
                name: connector.name
              }
            })
            setRightDrawer(ConnectorRightDrawer.Form)
          }}
        />
        <Spacer size={8} />
      </StepsPaletteContentLayout.Root>
      <StepFormLayout.Footer>
        <Button variant="secondary" onClick={requestClose}>
          Cancel
        </Button>
      </StepFormLayout.Footer>
    </ConnectorsPaletteLayout.Root>
  )
}
