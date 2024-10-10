import { SandboxSettingsAccountKeysPage } from './profile-settings-keys-page'
import { useState, useEffect } from 'react'
import {
  useListPublicKeyQuery,
  ListPublicKeyQueryQueryParams,
  ListPublicKeyOkResponse,
  useCreateTokenMutation,
  CreateTokenOkResponse,
  CreateTokenErrorResponse,
  CreateTokenRequestBody,
  useCreatePublicKeyMutation,
  CreatePublicKeyRequestBody,
  CreatePublicKeyOkResponse,
  CreatePublicKeyErrorResponse,
  ListPublicKeyErrorResponse
} from '@harnessio/code-service-client'
import { TokenCreateDialog } from './token-create/token-create-dialog'
import { TokenFormType } from './token-create/token-create-form'
import { SshKeyCreateDialog } from './ssh-key-create/ssh-key-create-dialog'
import { TokenSuccessDialog } from './token-create/token-success-dialog'
import { TokensList, KeysList } from '@harnessio/playground'

export const SettingsProfileKeysPage = () => {
  const CONVERT_DAYS_TO_NANO_SECONDS = 24 * 60 * 60 * 1000 * 1000000

  const TEMP_USER_TOKENS_API_PATH = '/api/v1/user/tokens'

  const [publicKeys, setPublicKeys] = useState<KeysList[]>([])
  const [tokens, setTokens] = useState<TokensList[]>([])
  const [openCreateTokenDialog, setCreateTokenDialog] = useState(false)
  const [openSuccessTokenDialog, setSuccessTokenDialog] = useState(false)
  const [saveSshKeyDialog, setSshKeyDialog] = useState(false)
  const [apiError, setApiError] = useState<{
    type: 'keyFetch' | 'tokenFetch' | 'keyCreate' | 'tokenCreate'
    message: string
  } | null>(null)

  const [createdTokenData, setCreatedTokenData] = useState<(TokenFormType & { token: string }) | null>(null)

  const closeSuccessTokenDialog = () => setSuccessTokenDialog(false)

  const openTokenDialog = () => {
    setCreateTokenDialog(true)
    setApiError(null)
  }
  const closeTokenDialog = () => setCreateTokenDialog(false)

  const openSshKeyDialog = () => {
    setSshKeyDialog(true)
    setApiError(null)
  }
  const closeSshKeyDialog = () => setSshKeyDialog(false)

  const queryParams: ListPublicKeyQueryQueryParams = {
    page: 1,
    limit: 30,
    sort: 'created',
    order: 'asc'
  }

  useListPublicKeyQuery(
    { queryParams },
    {
      onSuccess: (data: ListPublicKeyOkResponse) => {
        setPublicKeys(data)
        setApiError(null)
      },
      onError: (error: ListPublicKeyErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: 'keyFetch', message: message })
      }
    }
  )

  // TODO: replace with actual query hook once its fixed
  const fetchTokens = () => {
    fetch(TEMP_USER_TOKENS_API_PATH)
      .then(resp => resp.json())
      .then(res => {
        setTokens(res)
        setApiError(null)
      })
      .catch(err => setApiError({ type: 'tokenFetch', message: err }))
  }

  useEffect(() => {
    fetchTokens()
  }, [])

  const createTokenMutation = useCreateTokenMutation(
    { body: {} },
    {
      onSuccess: (newToken: CreateTokenOkResponse) => {
        const tokenData = {
          identifier: newToken.token?.identifier ?? 'Unknown',
          lifetime: newToken.token?.expires_at
            ? new Date(newToken.token.expires_at).toLocaleDateString()
            : 'No Expiration',
          token: newToken.access_token ?? 'Token not available'
        }

        closeTokenDialog()
        setCreatedTokenData(tokenData)
        setSuccessTokenDialog(true)
        fetchTokens()
      },
      onError: (error: CreateTokenErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: 'tokenCreate', message: message })
      }
    }
  )

  const createSshKeyMutation = useCreatePublicKeyMutation(
    { body: {} },
    {
      onSuccess: (newSshKey: CreatePublicKeyOkResponse) => {
        closeSshKeyDialog()
        setPublicKeys(prevKeys => [...prevKeys, newSshKey])
      },
      onError: (error: CreatePublicKeyErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: 'keyCreate', message: message })
      }
    }
  )

  const handleCreateToken = (tokenData: { identifier: string; lifetime: string }) => {
    const body: CreateTokenRequestBody = {
      identifier: tokenData.identifier
    }

    if (tokenData.lifetime.toLowerCase() !== 'never') {
      const convertedLifetime = parseInt(tokenData.lifetime, 10) * CONVERT_DAYS_TO_NANO_SECONDS
      body.lifetime = convertedLifetime
    }

    createTokenMutation.mutate({ body })
  }

  const handleCreateSshKey = (sshKeyData: { content: string; identifier: string }) => {
    const body: CreatePublicKeyRequestBody = {
      content: sshKeyData.content,
      identifier: sshKeyData.identifier,
      usage: 'auth'
    }

    createSshKeyMutation.mutate({ body })
  }
  return (
    <>
      <SandboxSettingsAccountKeysPage
        publicKeys={publicKeys}
        tokens={tokens}
        openTokenDialog={openTokenDialog}
        openSshKeyDialog={openSshKeyDialog}
        error={apiError}
      />
      <TokenCreateDialog
        open={openCreateTokenDialog}
        onClose={closeTokenDialog}
        handleCreateToken={handleCreateToken}
        error={apiError}
        isLoading={createTokenMutation.isLoading}
      />
      <SshKeyCreateDialog
        open={saveSshKeyDialog}
        onClose={closeSshKeyDialog}
        handleCreateSshKey={handleCreateSshKey}
        error={apiError}
      />
      {createdTokenData && (
        <TokenSuccessDialog
          open={openSuccessTokenDialog}
          onClose={closeSuccessTokenDialog}
          tokenData={createdTokenData}
        />
      )}
    </>
  )
}
