import { FC } from 'react'

import { Button, ControlGroup, Fieldset, FormSeparator, FormWrapper, Legend, Spacer, Text } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'

import { ProfileKeysList } from './components/profile-settings-keys-list'
import { ProfileTokensList } from './components/profile-settings-tokens-list'
// import { parseAsInteger, useQueryState } from 'nuqs'
import { AlertDeleteParams, IProfileSettingsStore } from './types'

interface SettingsAccountKeysPageProps {
  openTokenDialog: () => void
  openSshKeyDialog: () => void
  openAlertDeleteDialog: (data: AlertDeleteParams) => void
  error: { type: string; message: string } | null
  headers?: Headers
  useProfileSettingsStore: () => IProfileSettingsStore
  useTranslationStore: () => TranslationStore
}

const SettingsAccountKeysPage: FC<SettingsAccountKeysPageProps> = ({
  useProfileSettingsStore,
  openTokenDialog,
  openSshKeyDialog,
  openAlertDeleteDialog,
  useTranslationStore,
  error
  // headers
}) => {
  // @todo: Add pagination for tokens and keys lists in following PR
  // const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  // const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')
  const { publicKeys, tokens } = useProfileSettingsStore()
  const { t } = useTranslationStore()

  return (
    <SandboxLayout.Content className="max-w-[812px] px-0">
      <Text size={5} weight={'medium'} as="h1">
        {t('views:profileSettings.keysAndTokens', 'Keys and Tokens')}
      </Text>
      <Spacer size={10} />
      <FormWrapper>
        {/* PERSONAL ACCESS TOKEN */}
        <Fieldset className="gap-y-5">
          <Legend
            title={
              <span className="flex justify-between">
                {t('views:profileSettings.personalAccessToken', 'Personal access token')}
                <Button type="button" variant="outline" className="text-primary" onClick={openTokenDialog}>
                  {t('views:profileSettings.addToken', 'Add new token')}
                </Button>
              </span>
            }
            description={t(
              'views:profileSettings.addTokenDescription',
              'Personal access tokens allow you to authenticate with the API.'
            )}
          />
          <ControlGroup>
            <>
              {(!error || error.type !== 'tokenFetch') && (
                <ProfileTokensList
                  tokens={tokens}
                  openAlertDeleteDialog={openAlertDeleteDialog}
                  useTranslationStore={useTranslationStore}
                />
              )}
              {error && error.type === 'tokenFetch' && (
                <>
                  <Spacer size={2} />
                  <Text size={1} className="text-destructive">
                    {error.message}
                  </Text>
                </>
              )}
            </>
          </ControlGroup>
        </Fieldset>

        <FormSeparator />

        {/* PERSONAL ACCESS TOKEN */}
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
            <Button className="text-primary" variant="outline" type="button" onClick={openSshKeyDialog}>
              {t('views:profileSettings.addSshKey', 'Add new SSH key')}
            </Button>
          </div>

          <ControlGroup>
            <>
              {(!error || error.type !== 'keyFetch') && (
                <>
                  <ProfileKeysList
                    publicKeys={publicKeys}
                    openAlertDeleteDialog={openAlertDeleteDialog}
                    useTranslationStore={useTranslationStore}
                  />
                  {/* <PaginationComponent
                      totalPages={totalPages}
                      currentPage={page}
                      goToPage={(pageNum: number) => setPage(pageNum)}
                    /> */}
                </>
              )}
              {error && error.type === 'keyFetch' && (
                <>
                  <Spacer size={2} />
                  <Text size={1} className="text-destructive">
                    {error.message}
                  </Text>
                </>
              )}
            </>
          </ControlGroup>
        </Fieldset>
      </FormWrapper>
    </SandboxLayout.Content>
  )
}

export { SettingsAccountKeysPage }
