import { useState } from 'react'

import { SecretInput, SecretItem } from '@harnessio/ui/views'

import { SecretsPage } from './secrets'

export const SecretInputExample = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedSecret, setSelectedSecret] = useState<SecretItem | null>(null)

  return (
    <>
      <SecretInput
        placeholder="Please select a secret"
        value={selectedSecret?.name}
        label="Select a Secret"
        icon="key"
        onClick={() => {
          setIsDrawerOpen(true)
        }}
        onEdit={() => {
          setIsDrawerOpen(true)
        }}
        onClear={() => setSelectedSecret(null)}
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
