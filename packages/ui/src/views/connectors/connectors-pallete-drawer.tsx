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
      <ConnectorsPaletteLayout.Header className="!border-none">
        <ConnectorsPaletteLayout.Title className="!mt-0">Connector Setup</ConnectorsPaletteLayout.Title>
        <ConnectorsPaletteLayout.Subtitle className="text-foreground-4">
          Select a Connector
        </ConnectorsPaletteLayout.Subtitle>
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
        <div className="absolute inset-x-0 bottom-0 bg-background-2 p-4 shadow-md">
          <Button variant="secondary" onClick={requestClose}>
            Cancel
          </Button>
        </div>
      </StepFormLayout.Footer>
    </ConnectorsPaletteLayout.Root>
  )
}
