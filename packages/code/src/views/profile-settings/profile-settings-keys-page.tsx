import { FC } from 'react'

import { Alert, Button, Dialog, Fieldset, FormSeparator, Layout, Legend, Text } from '@/components'
import { useTranslation } from '@/context'
import { ApiErrorType } from '@/views'

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
  error,
  isLoadingTokenList,
  isLoadingKeysList
  // headers
}) => {
  // @todo: Add pagination for tokens and keys lists in following PR
  // const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  // const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')
  const { publicKeys, tokens } = useProfileSettingsStore()
  const { t } = useTranslation()

  return (
    <Layout.Vertical gap="xl" grow>
      <Text as="h1" variant="heading-section">
        {t('views:profileSettings.keysAndTokens', 'Keys and Tokens')}
      </Text>

      <Layout.Vertical gap="2xl">
        <Fieldset className="gap-y-cn-lg">
          <div className="flex items-end justify-between">
            <Legend
              title={
                <span className="flex justify-between gap-x-cn-md">
                  {t('views:profileSettings.personalAccessToken', 'Personal access token')}
                </span>
              }
              description={t(
                'views:profileSettings.addTokenDescription',
                'Personal access tokens allow you to authenticate with the API.'
              )}
            />
            <Dialog.Trigger>
              <Button type="button" variant="outline" onClick={openTokenDialog}>
                {t('views:profileSettings.addToken', 'Add new token')}
              </Button>
            </Dialog.Trigger>
          </div>
          {error?.type === ApiErrorType.TokenFetch ? (
            <ErrorMessage message={error.message} />
          ) : (
            <ProfileTokensList
              tokens={tokens}
              isLoading={isLoadingTokenList}
              openAlertDeleteDialog={openAlertDeleteDialog}
            />
          )}
        </Fieldset>

        <FormSeparator className="border-cn-3" />

        <Fieldset className="gap-y-cn-lg">
          <div className="flex items-end justify-between">
            <Legend
              className="max-w-[400px]"
              title={t('views:profileSettings.sshKeys', 'My SSH keys')}
              description={t(
                'views:profileSettings.addSshKeyDescription',
                'SSH keys allow you to establish a secure connection to your code repository.'
              )}
            />
            <Dialog.Trigger>
              <Button variant="outline" type="button" onClick={openSshKeyDialog}>
                {t('views:profileSettings.addSshKey', 'Add new SSH key')}
              </Button>
            </Dialog.Trigger>
          </div>
          {error?.type === ApiErrorType.KeyFetch ? (
            <ErrorMessage message={error.message} />
          ) : (
            <ProfileKeysList
              publicKeys={publicKeys}
              isLoading={isLoadingKeysList}
              openAlertDeleteDialog={openAlertDeleteDialog}
            />
          )}
        </Fieldset>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export { SettingsAccountKeysPage }
