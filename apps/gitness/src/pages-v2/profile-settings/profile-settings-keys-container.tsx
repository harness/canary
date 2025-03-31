import { useEffect, useState } from 'react'
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
import { DeleteAlertDialog } from '@harnessio/ui/components'
import {
  AlertDeleteParams,
  ApiErrorType,
  ProfileSettingsKeysCreateDialog,
  ProfileSettingsTokenCreateDialog,
  SettingsAccountKeysPage,
  TokensList
} from '@harnessio/ui/views'

import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { useProfileSettingsStore } from './stores/profile-settings-store'

const CONVERT_DAYS_TO_NANO_SECONDS = 24 * 60 * 60 * 1000 * 1000000

export const SettingsProfileKeysPage = () => {
  const { setCreatedTokenData, setPublicKeys, setTokens, deleteToken, addToken, addPublicKey, deletePublicKey } =
    useProfileSettingsStore()
  const [openCreateTokenDialog, setCreateTokenDialog] = useState(false)
  const [saveSshKeyDialog, setSshKeyDialog] = useState(false)
  const [isAlertDeleteDialogOpen, setIsAlertDeleteDialogOpen] = useState(false)
  const [alertParams, setAlertParams] = useState<AlertDeleteParams | null>(null)
  const [searchParams] = useSearchParams()

  const [apiError, setApiError] = useState<{
    type: ApiErrorType
    message: string
  } | null>(null)

  const openTokenDialog = () => {
    setCreateTokenDialog(true)
    setApiError(null)
  }

  const closeTokenDialog = () => {
    setCreateTokenDialog(false)
    setCreatedTokenData(null)
  }

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

  const { data: { body: tokenList, headers } = {}, isLoading: isLoadingTokenList } = useListTokensQuery(
    {},
    {
      onError: (error: ListTokensErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: ApiErrorType.TokenFetch, message: message })
      }
    }
  )

  const { data: { body: publicKeysList } = {}, isLoading: isLoadingPublicKeys } = useListPublicKeyQuery(
    { queryParams },
    {
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
        deleteToken(variables.token_identifier)
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

        setCreatedTokenData(tokenData)
        addToken(newToken.token as TokensList)
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
        addPublicKey(newSshKey)
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
        deletePublicKey(variables.public_key_identifier!)
        setApiError(null)
        setIsAlertDeleteDialogOpen(false)
      },
      onError: error => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: ApiErrorType.KeyDelete, message: message })
      }
    }
  )

  useEffect(() => {
    if (publicKeysList) {
      setPublicKeys(publicKeysList)
    }
  }, [publicKeysList, setPublicKeys])

  useEffect(() => {
    if (tokenList) {
      setTokens(tokenList)
    }
  }, [tokenList, setTokens])

  const handleDeletePublicKey = (publicKeyIdentifier: string) => {
    deletePublicKeyMutation.mutate({ public_key_identifier: publicKeyIdentifier })
  }

  const handleCreateToken = (tokenData: { identifier: string; lifetime: string }) => {
    const body: CreateTokenRequestBody = {
      identifier: tokenData.identifier
    }

    if (tokenData.lifetime.toLowerCase() !== 'never') {
      body.lifetime = parseInt(tokenData.lifetime, 10) * CONVERT_DAYS_TO_NANO_SECONDS
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
        useProfileSettingsStore={useProfileSettingsStore}
        openTokenDialog={openTokenDialog}
        openSshKeyDialog={openSshKeyDialog}
        openAlertDeleteDialog={openAlertDeleteDialog}
        error={apiError}
        headers={headers}
        useTranslationStore={useTranslationStore}
        isLoadingTokenList={isLoadingTokenList}
        isLoadingKeysList={isLoadingPublicKeys}
      />
      <ProfileSettingsTokenCreateDialog
        open={openCreateTokenDialog}
        onClose={closeTokenDialog}
        handleCreateToken={handleCreateToken}
        error={apiError}
        isLoading={createTokenMutation.isLoading}
        useProfileSettingsStore={useProfileSettingsStore}
        useTranslationStore={useTranslationStore}
      />
      <ProfileSettingsKeysCreateDialog
        open={saveSshKeyDialog}
        onClose={closeSshKeyDialog}
        handleCreateSshKey={handleCreateSshKey}
        error={apiError}
        useTranslationStore={useTranslationStore}
      />
      <DeleteAlertDialog
        open={isAlertDeleteDialogOpen}
        onClose={closeAlertDeleteDialog}
        deleteFn={alertParams?.type === 'key' ? handleDeletePublicKey : handleDeleteToken}
        error={apiError}
        isLoading={alertParams?.type === 'key' ? deletePublicKeyMutation.isLoading : deleteTokenMutation.isLoading}
        useTranslationStore={useTranslationStore}
        {...alertParams}
      />
    </>
  )
}
