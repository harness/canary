import { FC } from 'react'

import { Alert, Button, Fieldset, FormSeparator, Layout, Legend, Spacer } from '@/components'
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
  <Alert.Root theme="danger">
    <Alert.Title>{message}</Alert.Title>
  </Alert.Root>
)

const SettingsAccountKeysPage: FC<SettingsAccountKeysPageProps> = ({
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
    <SandboxLayout.Content className="px-0">
      <h1 className="text-6 font-medium text-cn-foreground-1">
        {t('views:profileSettings.keysAndTokens', 'Keys and Tokens')}
      </h1>
      <Spacer size={10} />
      <Layout.Vertical gap="space-y-7">
        <Fieldset className="gap-y-5">
          <div className="flex items-end justify-between">
            <Legend
              title={
                <span className="flex justify-between gap-x-4">
                  {t('views:profileSettings.personalAccessToken', 'Personal access token')}
                </span>
              }
              description={t(
                'views:profileSettings.addTokenDescription',
                'Personal access tokens allow you to authenticate with the API.'
              )}
            />
            <Button type="button" variant="outline" onClick={openTokenDialog}>
              {t('views:profileSettings.addToken', 'Add new token')}
            </Button>
          </div>
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
        </Fieldset>

        <FormSeparator className="border-cn-borders-4" />

        <Fieldset className="gap-y-5">
          <div className="flex items-end justify-between">
            <Legend
              className="max-w-[400px]"
              title={t('views:profileSettings.sshKeys', 'My SSH keys')}
              description={t(
                'views:profileSettings.addSshKeyDescription',
                'SSH keys allow you to establish a secure connection to your code repository.'
              )}
            />
            <Button variant="outline" type="button" onClick={openSshKeyDialog}>
              {t('views:profileSettings.addSshKey', 'Add new SSH key')}
            </Button>
          </div>
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
        </Fieldset>
      </Layout.Vertical>
    </SandboxLayout.Content>
  )
}

export { SettingsAccountKeysPage }
