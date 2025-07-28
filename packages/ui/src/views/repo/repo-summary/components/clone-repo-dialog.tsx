import { FC, useState } from 'react'

import { Alert, Button, CopyButton, DropdownMenu, IconV2, Tabs, Text, TextInput } from '@/components'
import { useTranslation } from '@/context'

export interface CloneRepoDialogProps {
  sshUrl?: string
  httpsUrl: string
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
  handleCreateToken,
  tokenGenerationError
}) => {
  const [currentTab, setCurrentTab] = useState(CloneRepoTabs.HTTPS)
  const { t } = useTranslation()

  const isSSHAvailable = !!sshUrl

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button>
          <IconV2 name="copy" size="sm" />
          {t('views:repos.cloneRepo', 'Clone Repository')}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-[360px]" align="end">
        <DropdownMenu.Header>
          <Text variant="body-single-line-strong" color="foreground-1" className="p-1">
            {t('views:repos.cloneRepo', 'Clone Repository')}
          </Text>

          <Tabs.Root
            className="mb-[-11px] mt-3"
            value={currentTab}
            onValueChange={val => setCurrentTab(val as CloneRepoTabs)}
          >
            <Tabs.List className="-mx-3 px-4" activeClassName="bg-cn-background-3" variant="overlined">
              <Tabs.Trigger value={CloneRepoTabs.HTTPS} onClick={() => setCurrentTab(CloneRepoTabs.HTTPS)}>
                {t('views:repos.cloneHttps', 'HTTPS')}
              </Tabs.Trigger>
              <Tabs.Trigger
                value={CloneRepoTabs.SSH}
                onClick={() => setCurrentTab(CloneRepoTabs.SSH)}
                disabled={!isSSHAvailable}
              >
                {t('views:repos.cloneSsh', 'SSH')}
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </DropdownMenu.Header>

        <DropdownMenu.Slot className="p-3">
          {currentTab === 'https' ? (
            <>
              <TextInput
                className="truncate"
                label={t('views:repos.gitCloneUrl', 'Git clone URL')}
                id="httpsUrl"
                readOnly
                value={httpsUrl}
                suffix={<CopyButton name={httpsUrl} buttonVariant="transparent" />}
              />
              <Text className="mt-4" color="foreground-3">
                {t('views:repos.generateCredential', 'Please generate a clone credential if its your first time.')}
              </Text>
            </>
          ) : (
            <TextInput
              className="truncate"
              id="sshUrl"
              label={t('views:repos.gitCloneUrl', 'Git clone URL')}
              readOnly
              value={sshUrl}
              suffix={<CopyButton name={sshUrl || ''} buttonVariant="transparent" />}
            />
          )}
        </DropdownMenu.Slot>
        {currentTab === 'https' && (
          <DropdownMenu.Footer>
            <Button onClick={handleCreateToken} className="w-full">
              {t('views:repos.cloneCredential', 'Generate Clone Credential')}
            </Button>
            {tokenGenerationError && (
              <Alert.Root theme="danger" className="mt-2">
                <Alert.Description>{tokenGenerationError}</Alert.Description>
              </Alert.Root>
            )}
          </DropdownMenu.Footer>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
