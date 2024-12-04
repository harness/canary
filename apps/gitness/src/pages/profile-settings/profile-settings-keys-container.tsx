import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  CreatePublicKeyErrorResponse,
  CreatePublicKeyRequestBody,
  CreateTokenErrorResponse,
  CreateTokenRequestBody,
  DeleteTokenErrorResponse,
  DeleteTokenOkResponse,
  ListPublicKeyErrorResponse,
  ListPublicKeyQueryQueryParams,
  ListTokensErrorResponse,
  useCreatePublicKeyMutation,
  useCreateTokenMutation,
  useDeletePublicKeyMutation,
  useDeleteTokenMutation,
  useListPublicKeyQuery,
  useListTokensQuery
} from '@harnessio/code-service-client'
import { DeleteTokenAlertDialog, KeysList, TokensList } from '@harnessio/views'

import { SettingsAccountKeysPage } from './profile-settings-keys-page'
import { SshKeyCreateDialog } from './ssh-key-create/ssh-key-create-dialog'
import { TokenCreateDialog } from './token-create/token-create-dialog'
import { TokenFormType } from './token-create/token-create-form'
import { TokenSuccessDialog } from './token-create/token-success-dialog'
import { AlertDeleteParams, ApiErrorType } from './types'

export const SettingsProfileKeysPage = () => {
  const CONVERT_DAYS_TO_NANO_SECONDS = 24 * 60 * 60 * 1000 * 1000000

  const [publicKeys, setPublicKeys] = useState<KeysList[]>([])
  const [tokens, setTokens] = useState<TokensList[]>([])
  const [openCreateTokenDialog, setCreateTokenDialog] = useState(false)
  const [openSuccessTokenDialog, setSuccessTokenDialog] = useState(false)
  const [saveSshKeyDialog, setSshKeyDialog] = useState(false)
  const [isAlertDeleteDialogOpen, setIsAlertDeleteDialogOpen] = useState(false)
  const [alertParams, setAlertParams] = useState<AlertDeleteParams | null>(null)
  const [searchParams] = useSearchParams()

  const [apiError, setApiError] = useState<{
    type: ApiErrorType
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

  const closeAlertDeleteDialog = () => setIsAlertDeleteDialogOpen(false)
  const openAlertDeleteDialog = ({ identifier, type }: AlertDeleteParams) => {
    setIsAlertDeleteDialogOpen(true)
    setAlertParams({ identifier, type })
  }

  const queryParams: ListPublicKeyQueryQueryParams = {
    page: parseInt(searchParams.get('page') || ''),
    sort: 'created',
    order: 'asc'
  }

  const { data: { headers } = {} } = useListTokensQuery(
    {},
    {
      onSuccess: ({ body: data }) => {
        setTokens(data)
        setApiError(null)
      },

      onError: (error: ListTokensErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: ApiErrorType.TokenFetch, message: message })
      }
    }
  )

  useListPublicKeyQuery(
    { queryParams },
    {
      onSuccess: ({ body: data }) => {
        setPublicKeys(data)
        setApiError(null)
      },
      onError: (error: ListPublicKeyErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: ApiErrorType.KeyFetch, message: message })
      }
    }
  )

  const deleteTokenMutation = useDeleteTokenMutation(
    {},
    {
      onSuccess: (_data: DeleteTokenOkResponse, variables) => {
        setTokens(prevTokens => prevTokens.filter(token => token.identifier !== variables.token_identifier))
        setApiError(null)
        setIsAlertDeleteDialogOpen(false)
      },
      onError: (error: DeleteTokenErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: ApiErrorType.TokenDelete, message: message })
      }
    }
  )

  const createTokenMutation = useCreateTokenMutation(
    { body: {} },
    {
      onSuccess: ({ body: newToken }) => {
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
        setTokens(prevTokens => [...prevTokens, newToken.token as TokensList])
      },
      onError: (error: CreateTokenErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: ApiErrorType.TokenCreate, message: message })
      }
    }
  )

  const createSshKeyMutation = useCreatePublicKeyMutation(
    { body: {} },
    {
      onSuccess: ({ body: newSshKey }) => {
        closeSshKeyDialog()
        setPublicKeys(prevKeys => [...prevKeys, newSshKey])
      },
      onError: (error: CreatePublicKeyErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: ApiErrorType.KeyCreate, message: message })
      }
    }
  )

  const deletePublicKeyMutation = useDeletePublicKeyMutation(
    { public_key_identifier: '' },
    {
      onSuccess: (_data, variables) => {
        setPublicKeys(prevKeys => prevKeys.filter(key => key.identifier !== variables.public_key_identifier))
        setApiError(null)
        setIsAlertDeleteDialogOpen(false)
      },
      onError: error => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: ApiErrorType.KeyDelete, message: message })
      }
    }
  )

  const handleDeletePublicKey = (publicKeyIdentifier: string) => {
    deletePublicKeyMutation.mutate({ public_key_identifier: publicKeyIdentifier })
  }

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

  const handleDeleteToken = (tokenId: string) => {
    deleteTokenMutation.mutate({ token_identifier: tokenId })
  }

  return (
    <>
      <SettingsAccountKeysPage
        publicKeys={publicKeys}
        tokens={tokens}
        openTokenDialog={openTokenDialog}
        openSshKeyDialog={openSshKeyDialog}
        openAlertDeleteDialog={openAlertDeleteDialog}
        error={apiError}
        headers={headers}
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
      <DeleteTokenAlertDialog
        open={isAlertDeleteDialogOpen}
        onClose={closeAlertDeleteDialog}
        deleteFn={alertParams?.type === 'key' ? handleDeletePublicKey : handleDeleteToken}
        error={apiError}
        isLoading={alertParams?.type === 'key' ? deletePublicKeyMutation.isLoading : deleteTokenMutation.isLoading}
        {...alertParams}
      />
    </>
  )
}
