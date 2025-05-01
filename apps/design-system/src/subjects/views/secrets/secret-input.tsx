import { useState } from 'react'

import { Link } from '@harnessio/ui/components'
import { SecretInput, SecretItem } from '@harnessio/ui/views'

import { SecretsPage } from './secrets'

export const SecretInputExample = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedSecret, setSelectedSecret] = useState<SecretItem | null>(null)

  return (
    <>
      <SecretInput
        placeholder={<Link to="#"> Please select a secret</Link>}
        value={selectedSecret}
        label="Select a Secret"
        icon="key"
        onClick={() => {
          setIsDrawerOpen(true)
        }}
        onEdit={() => {
          setIsDrawerOpen(true)
        }}
        onClear={() => setSelectedSecret(null)}
        renderValue={secret => secret.name}
        className="mb-8 max-w-xs"
      />
      <SecretsPage
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        selectedSecret={selectedSecret}
        setSelectedSecret={setSelectedSecret}
      />
    </>
  )
}
