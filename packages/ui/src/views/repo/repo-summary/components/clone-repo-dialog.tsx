import { FC, useState } from 'react'

import { Alert, Button, CopyButton, DropdownMenu, Icon, Input, Tabs } from '@/components'
import { TranslationStore } from '@/views'

export interface CloneRepoDialogProps {
  sshUrl: string
  httpsUrl: string
  handleCreateToken: () => void
  useTranslationStore: () => TranslationStore
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
  useTranslationStore,
  tokenGenerationError
}) => {
  const [currentTab, setCurrentTab] = useState(CloneRepoTabs.HTTPS)
  const { t } = useTranslationStore()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button className="items-center gap-x-2 pl-5 pr-2.5">
          {t('views:repos.cloneRepo', 'Clone repository')}
          <Icon name="chevron-down" size={12} className="text-cn-foreground-primary" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-[328px] p-0 shadow-2" align="end">
        <div className="px-4 pt-4 leading-none">
          <span className="inline-block text-2 font-medium">{t('views:repos.cloneRepo', 'Clone repository')}</span>
        </div>
        <Tabs.Root className="mt-4" value={currentTab} onValueChange={val => setCurrentTab(val as CloneRepoTabs)}>
          <Tabs.List className="px-4">
            <DropdownMenu.Item
              className="rounded-t-md p-0"
              onSelect={e => {
                e.preventDefault()
                setCurrentTab(CloneRepoTabs.HTTPS)
              }}
            >
              <Tabs.Trigger className="px-4 data-[state=active]:bg-cn-background-2" value={CloneRepoTabs.HTTPS}>
                {t('views:repos.cloneHttps', 'HTTPS')}
              </Tabs.Trigger>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="rounded-t-md p-0"
              onSelect={e => {
                e.preventDefault()
                setCurrentTab(CloneRepoTabs.SSH)
              }}
            >
              <Tabs.Trigger
                className="px-4 data-[state=active]:bg-cn-background-2"
                value={CloneRepoTabs.SSH}
                onClick={e => e.stopPropagation()}
              >
                {t('views:repos.cloneSsh', 'SSH')}
              </Tabs.Trigger>
            </DropdownMenu.Item>
          </Tabs.List>
        </Tabs.Root>
        <div className="p-4">
          <div className="mb-2.5 flex items-center">
            <span className="inline-block leading-none text-cn-foreground-2">
              {t('views:repos.gitCloneUrl', 'Git clone URL')}
            </span>
          </div>
          {currentTab === 'https' ? (
            <>
              <Input
                className="py-px text-cn-foreground-1"
                id="httpsUrl"
                readOnly
                value={httpsUrl}
                variant="extended"
                rightElementVariant="default"
                rightElement={<CopyButton name={httpsUrl} />}
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
                <Alert.Container variant="destructive" className="mt-2">
                  <Alert.Description>{tokenGenerationError}</Alert.Description>
                </Alert.Container>
              )}
            </>
          ) : (
            <Input
              className="py-px text-cn-foreground-1"
              id="sshUrl"
              readOnly
              value={sshUrl}
              variant="extended"
              rightElementVariant="default"
              rightElement={<CopyButton name={sshUrl} />}
            />
          )}
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
