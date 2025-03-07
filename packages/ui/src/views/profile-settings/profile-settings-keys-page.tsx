import { FC } from 'react'

import { Alert, Button, Separator } from '@/components'
import { ApiErrorType, SandboxLayout, TranslationStore } from '@/views'

import { ProfileKeysList } from './components/profile-settings-keys-list'
import { ProfileTokensList } from './components/profile-settings-tokens-list'
import { AlertDeleteParams, IProfileSettingsStore } from './types'

interface SettingsAccountKeysPageProps {
  openTokenDialog: () => void
  openSshKeyDialog: () => void
  openAlertDeleteDialog: (data: AlertDeleteParams) => void
  error: { type: ApiErrorType; message: string } | null
  headers?: Headers
  useProfileSettingsStore: () => IProfileSettingsStore
  useTranslationStore: () => TranslationStore
  isLoadingTokenList: boolean
  isLoadingKeysList: boolean
}

const ErrorMessage: FC<{ message: string }> = ({ message }) => (
  <Alert.Container variant="destructive">
    <Alert.Title>{message}</Alert.Title>
  </Alert.Container>
)

export const SettingsAccountKeysPage: FC<SettingsAccountKeysPageProps> = ({
  useProfileSettingsStore,
  openTokenDialog,
  openSshKeyDialog,
  openAlertDeleteDialog,
  useTranslationStore,
  error,
  isLoadingTokenList,
  isLoadingKeysList
  // headers
}) => {
  // @todo: Add pagination for tokens and keys lists in following PR
  // const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  // const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')
  const { publicKeys, tokens } = useProfileSettingsStore()
  const { t } = useTranslationStore()

  return (
    <SandboxLayout.Content className="grid gap-y-7 px-0">
      <h1 className="text-24 text-foreground-1 mb-3 font-medium">
        {t('views:profileSettings.keysAndTokens', 'Keys and Tokens')}
      </h1>

      <section className="grid gap-y-[18px]">
        <header className="flex items-end justify-between">
          <div className="max-w-[400px]">
            <h4 className="text-18 text-foreground-1 mb-2.5 font-medium leading-snug">
              {t('views:profileSettings.personalAccessToken', 'Personal access token')}
            </h4>
            <p className="text-14 text-foreground-2 leading-snug">
              {t(
                'views:profileSettings.addTokenDescription',
                'Personal access tokens allow you to authenticate with the API.'
              )}
            </p>
          </div>

          <Button type="button" variant="outline" onClick={openTokenDialog}>
            {t('views:profileSettings.addToken', 'Add new token')}
          </Button>
        </header>

        {error?.type === ApiErrorType.TokenFetch ? (
          <ErrorMessage message={error.message} />
        ) : (
          <ProfileTokensList
            tokens={tokens}
            isLoading={isLoadingTokenList}
            openAlertDeleteDialog={openAlertDeleteDialog}
            useTranslationStore={useTranslationStore}
          />
        )}
      </section>

      <Separator className="bg-borders-4 h-px" />

      <section className="grid gap-y-[18px]">
        <header className="flex items-end justify-between">
          <div className="max-w-[400px]">
            <h4 className="text-18 text-foreground-1 mb-2.5 font-medium leading-snug">
              {t('views:profileSettings.sshKeys', 'My SSH keys')}
            </h4>
            <p className="text-14 text-foreground-2 leading-snug">
              {t(
                'views:profileSettings.addSshKeyDescription',
                'SSH keys allow you to establish a secure connection to your code repository.'
              )}
            </p>
          </div>
          <Button variant="outline" type="button" onClick={openSshKeyDialog}>
            {t('views:profileSettings.addSshKey', 'Add new SSH key')}
          </Button>
        </header>

        {error?.type === ApiErrorType.KeyFetch ? (
          <ErrorMessage message={error.message} />
        ) : (
          <ProfileKeysList
            publicKeys={publicKeys}
            isLoading={isLoadingKeysList}
            openAlertDeleteDialog={openAlertDeleteDialog}
            useTranslationStore={useTranslationStore}
          />
        )}
      </section>
    </SandboxLayout.Content>
  )
}
