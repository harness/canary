import { FC } from 'react'

import { Alert, Button, CopyButton, IconV2, Layout, Popover, Tabs, TextInput } from '@harnessio/ui/components'
import { useCustomDialogTrigger, useTranslation } from '@harnessio/ui/context'

export interface CloneRepoDialogProps {
  sshUrl?: string
  httpsUrl: string
  isSSHEnabled?: boolean
  handleCreateToken: () => void
  tokenGenerationError?: string | null
}

export enum CloneRepoTabs {
  HTTPS = 'https',
  SSH = 'ssh'
}

export const CloneRepoDialog: FC<CloneRepoDialogProps> = ({
  httpsUrl,
  sshUrl,
  isSSHEnabled,
  handleCreateToken: _handleCreateToken,
  tokenGenerationError
}) => {
  const { t } = useTranslation()
  const { triggerRef, registerTrigger } = useCustomDialogTrigger()

  const handleCreateToken = () => {
    registerTrigger()
    _handleCreateToken()
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button ref={triggerRef}>
          <IconV2 name="copy" size="sm" />
          {t('views:repos.cloneRepo', 'Clone Repository')}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className="w-[360px]"
        align="end"
        title={t('views:repos.cloneRepo', 'Clone repository')}
        hideArrow
      >
        <Tabs.Root defaultValue={CloneRepoTabs.HTTPS}>
          <Tabs.List className="mb-cn-sm -mx-[var(--cn-popover-py)] px-[var(--cn-popover-py)]" variant="overlined">
            <Tabs.Trigger value={CloneRepoTabs.HTTPS}>{t('views:repos.cloneHttps', 'HTTPS')}</Tabs.Trigger>
            {isSSHEnabled && (
              <Tabs.Trigger value={CloneRepoTabs.SSH} disabled={!sshUrl}>
                {t('views:repos.cloneSsh', 'SSH')}
              </Tabs.Trigger>
            )}
          </Tabs.List>

          <Tabs.Content value={CloneRepoTabs.HTTPS}>
            <Layout.Vertical gap="sm">
              <TextInput
                className="truncate"
                label={t('views:repos.gitCloneUrl', 'Git clone URL')}
                id="httpsUrl"
                readOnly
                value={httpsUrl}
                suffix={<CopyButton name={httpsUrl} buttonVariant="transparent" />}
                caption={t(
                  'views:repos.generateCredential',
                  'Please generate a clone credential if its your first time.'
                )}
              />

              <Button onClick={handleCreateToken} className="w-full">
                {t('views:repos.cloneCredential', 'Generate Clone Credential')}
              </Button>

              {!!tokenGenerationError && (
                <Alert.Root theme="danger">
                  <Alert.Description>{tokenGenerationError}</Alert.Description>
                </Alert.Root>
              )}
            </Layout.Vertical>
          </Tabs.Content>

          <Tabs.Content value={CloneRepoTabs.SSH}>
            <TextInput
              className="truncate"
              id="sshUrl"
              label={t('views:repos.gitCloneUrl', 'Git clone URL')}
              readOnly
              value={sshUrl ?? ''}
              suffix={<CopyButton name={sshUrl || ''} buttonVariant="transparent" />}
            />
          </Tabs.Content>
        </Tabs.Root>
      </Popover.Content>
    </Popover.Root>
  )
}
