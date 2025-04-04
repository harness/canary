import { useEffect, useState } from 'react'

import { ConnectorEntity } from '../types'
import { ConnectorTestConnectionDialog } from './connector-test-connection-dialog'

interface ConnectorTestConnectionProps {
  isOpen: boolean
  onClose: () => void
  connector?: ConnectorEntity
  apiUrl?: string
  testConnection?: (connector: ConnectorEntity) => Promise<{ success: boolean; message?: string }>
}

export const ConnectorTestConnection = ({
  isOpen,
  onClose,
  connector,
  apiUrl,
  testConnection
}: ConnectorTestConnectionProps): JSX.Element => {
  const [status, setStatus] = useState<'running' | 'success' | 'error'>('running')
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (isOpen && connector && testConnection) {
      setStatus('error')
      setErrorMessage(undefined)

      testConnection(connector)
        .then(result => {
          if (result.success) {
            setStatus('success')
          } else {
            setStatus('error')
            setErrorMessage(result.message)
          }
        })
        .catch(error => {
          setStatus('error')
          setErrorMessage(error?.message || 'An unexpected error occurred')
        })
    }
  }, [isOpen, connector, testConnection])

  // Reset state when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setStatus('running')
      setErrorMessage(undefined)
    }
  }, [isOpen])

  return (
    <ConnectorTestConnectionDialog
      isOpen={isOpen}
      onClose={onClose}
      status={status}
      apiUrl={apiUrl}
      errorMessage={errorMessage}
    />
  )
}
