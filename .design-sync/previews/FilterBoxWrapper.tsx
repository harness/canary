import * as React from 'react'
import { FilterBoxWrapper, Text } from '@harnessio/ui'

function Demo({ open, variant }: { open: boolean; variant?: 'secondary' | 'outline' }) {
  const [isOpen, setIsOpen] = React.useState(open)
  return (
    <div style={{ width: 420, height: 220, padding: 16 }}>
      <FilterBoxWrapper
        handleRemoveFilter={() => {}}
        defaultOpen={false}
        filterLabel="Status"
        valueLabel="Failed"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        variant={variant}
      >
        <Text className="block">Choose which execution statuses to include.</Text>
      </FilterBoxWrapper>
    </div>
  )
}

export function Closed() {
  return <Demo open={false} />
}

export function Open() {
  return <Demo open />
}

export function Outline() {
  return <Demo open={false} variant="outline" />
}
