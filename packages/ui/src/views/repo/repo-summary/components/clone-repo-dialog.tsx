import { FC, useState } from 'react'

import {
  Button,
  CopyButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Input,
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components'
import { TranslationStore } from '@/views'

export interface CloneRepoDialogProps {
  sshUrl: string
  httpsUrl: string
  handleCreateToken: () => void
  useTranslationStore: () => TranslationStore
}

export enum CloneRepoTabs {
  HTTPS = 'https',
  SSH = 'ssh'
}

export const CloneRepoDialog: FC<CloneRepoDialogProps> = ({
  httpsUrl,
  sshUrl,
  handleCreateToken,
  useTranslationStore
}) => {
  const [currentTab, setCurrentTab] = useState(CloneRepoTabs.HTTPS)
  const { t } = useTranslationStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="items-center gap-x-2 pl-5 pr-2.5">
          {t('views:repos.cloneRepo', 'Clone repository')}
          <Icon name="chevron-down" size={12} className="text-icons-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[328px] p-0 shadow-2" align="end">
        <div className="px-4 pt-4 leading-none">
          <span className="inline-block text-14 font-medium">{t('views:repos.cloneRepo', 'Clone repository')}</span>
        </div>
        <Tabs
          className="mt-4"
          variant="branch"
          value={currentTab}
          onValueChange={val => setCurrentTab(val as CloneRepoTabs)}
        >
          <TabsList className="px-4">
            <DropdownMenuItem
              className="rounded-t-md p-0"
              onSelect={e => {
                e.preventDefault()
                setCurrentTab(CloneRepoTabs.HTTPS)
              }}
            >
              <TabsTrigger className="px-4 data-[state=active]:bg-background-2" value={CloneRepoTabs.HTTPS}>
                {t('views:repos.cloneHttps', 'HTTPS')}
              </TabsTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-t-md p-0"
              onSelect={e => {
                e.preventDefault()
                setCurrentTab(CloneRepoTabs.SSH)
              }}
            >
              <TabsTrigger
                className="px-4 data-[state=active]:bg-background-2"
                value={CloneRepoTabs.SSH}
                onClick={e => e.stopPropagation()}
              >
                {t('views:repos.cloneSsh', 'SSH')}
              </TabsTrigger>
            </DropdownMenuItem>
          </TabsList>
        </Tabs>
        <div className="p-4">
          <div className="mb-2.5 flex items-center">
            <span className="inline-block leading-none text-foreground-2">
              {t('views:repos.gitCloneUrl', 'Git clone URL')}
            </span>
          </div>
          {currentTab === 'https' ? (
            <>
              <Input
                className="py-px text-foreground-1"
                id="httpsUrl"
                readOnly
                value={httpsUrl}
                variant="extended"
                rightElementVariant="default"
                rightElement={<CopyButton name={httpsUrl} />}
              />
              <div className="mt-4 flex items-center">
                <span className="leading-snug text-foreground-4">
                  {t('views:repos.generateCredential', 'Please generate a clone credential if its your first time.')}
                </span>
              </div>
              <div className="mt-4 flex items-center">
                <Button variant="default" type="button" onClick={handleCreateToken} className="w-full px-2">
                  {t('views:repos.cloneCredential', 'Generate Clone Credential')}
                </Button>
              </div>
            </>
          ) : (
            <Input
              className="py-px text-foreground-1"
              id="sshUrl"
              readOnly
              value={sshUrl}
              variant="extended"
              rightElementVariant="default"
              rightElement={<CopyButton name={sshUrl} />}
            />
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
