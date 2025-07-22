import { FC, useState } from 'react'

import { Alert, Button, CopyButton, DropdownMenu, IconV2, Tabs, TextInput } from '@/components'
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
        <Button className="items-center gap-x-2 pl-5 pr-2.5">
          {t('views:repos.cloneRepo', 'Clone repository')}
          <IconV2 name="nav-arrow-down" size="2xs" className="text-cn-foreground-primary" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-[328px]" align="end">
        <DropdownMenu.Header>
          <span className="inline-block text-2 font-medium">{t('views:repos.cloneRepo', 'Clone repository')}</span>

          <Tabs.Root
            className="mb-[-11px] mt-4"
            value={currentTab}
            onValueChange={val => setCurrentTab(val as CloneRepoTabs)}
          >
            <Tabs.List className="-mx-3 px-3" activeClassName="bg-cn-background-3" variant="overlined">
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

        <DropdownMenu.Slot className="p-4">
          <div className="mb-2.5 flex items-center">
            <span className="inline-block leading-none text-cn-foreground-2">
              {t('views:repos.gitCloneUrl', 'Git clone URL')}
            </span>
          </div>
          {currentTab === 'https' ? (
            <>
              <TextInput
                className="truncate"
                id="httpsUrl"
                readOnly
                value={httpsUrl}
                suffix={<CopyButton name={httpsUrl} />}
              />
              <div className="mt-4 flex items-center">
                <span className="leading-snug text-cn-foreground-2">
                  {t('views:repos.generateCredential', 'Please generate a clone credential if its your first time.')}
                </span>
              </div>
              <div className="mt-4 flex items-center">
                <Button onClick={handleCreateToken} className="w-full px-2">
                  {t('views:repos.cloneCredential', 'Generate Clone Credential')}
                </Button>
              </div>
              {tokenGenerationError && (
                <Alert.Root theme="danger" className="mt-2">
                  <Alert.Description>{tokenGenerationError}</Alert.Description>
                </Alert.Root>
              )}
            </>
          ) : (
            <TextInput id="sshUrl" readOnly value={sshUrl} suffix={<CopyButton name={sshUrl || ''} />} />
          )}
        </DropdownMenu.Slot>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
