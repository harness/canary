import { useState } from 'react'

import { StyledLink } from '@harnessio/ui/components'
import { SecretInput, SecretItem } from '@harnessio/ui/views'

import { SecretsPage } from './secrets'

export const SecretInputExample = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedSecret, setSelectedSecret] = useState<SecretItem | null>(null)

  return (
    <>
      <SecretInput
        placeholder={<StyledLink to="#"> Please select a secret</StyledLink>}
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
        className="max-w-xs mb-8"
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
