import { useMemo, useState } from 'react'

import { Button } from '@components/button'
import { Input } from '@components/input'
import { Spacer } from '@components/spacer'
import { StepFormLayout } from '@views/unified-pipeline-studio/components/palette-drawer/components/step-form-layout'
import { StepsPaletteContentLayout } from '@views/unified-pipeline-studio/components/palette-drawer/components/step-palette-content-layout'
import { StepsPaletteLayout } from '@views/unified-pipeline-studio/components/palette-drawer/components/step-palette-layout'

import { ConnectorsPaletteSection } from './components/ConnectorsPalleteSection'
import { harnessConnectors } from './connector-utils'
import { ConnectorRightDrawer } from './types'

interface ConnectorsPaletteProps {
  connectors: any //TODO: proper type
  requestClose: () => void
  setFormEntity: (formEntity: any) => void
  setRightDrawer: (value: ConnectorRightDrawer) => void
  standalone?: boolean
}

export const ConnectorsPalette = (props: ConnectorsPaletteProps): JSX.Element => {
  const { connectors, requestClose, setFormEntity, setRightDrawer, standalone } = props

  const [query, setQuery] = useState('')

  const connectorsFiltered = useMemo(
    () => connectors.filter((connector: { identifier: string | string[] }) => connector.identifier.includes(query)),
    [query, harnessConnectors]
  )

  return (
    <StepsPaletteLayout.Root>
      {standalone && (
        <StepsPaletteLayout.Header>
          <StepsPaletteLayout.Title>Add Connector</StepsPaletteLayout.Title>
          <Input
            placeholder="Search"
            onChange={value => {
              setQuery(value.target.value)
            }}
          />
        </StepsPaletteLayout.Header>
      )}
      <StepsPaletteContentLayout.Root className={standalone ? undefined : '!px-0'}>
        <ConnectorsPaletteSection
          connectors={connectorsFiltered}
          onSelect={connector => {
            setFormEntity({
              type: 'connector',
              data: {
                identifier: connector.identifier,
                description: connector.description
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
    </StepsPaletteLayout.Root>
  )
}
