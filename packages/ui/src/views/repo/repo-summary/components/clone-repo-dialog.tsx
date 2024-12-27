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
        <Button className="gap-x-2 items-center pl-5 pr-2.5">
          {t('views:repos.cloneRepo', 'Clone repository')}
          <Icon name="chevron-down" size={12} className="text-icons-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[328px] p-0 shadow-2" align="end">
        <div className="px-4 pt-4 leading-none">
          <span className="text-14 font-medium inline-block">{t('views:repos.cloneRepo', 'Clone repository')}</span>
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
              <TabsTrigger className="data-[state=active]:bg-background-2 px-4" value={CloneRepoTabs.HTTPS}>
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
                className="data-[state=active]:bg-background-2 px-4"
                value={CloneRepoTabs.SSH}
                onClick={e => e.stopPropagation()}
              >
                {t('views:repos.cloneSsh', 'SSH')}
              </TabsTrigger>
            </DropdownMenuItem>
          </TabsList>
        </Tabs>
        <div className="p-4">
          <div className="flex items-center mb-2.5">
            <span className="text-foreground-2 leading-none inline-block">
              {t('views:repos.gitCloneUrl', 'Git clone URL')}
            </span>
          </div>
          {currentTab === 'https' ? (
            <>
              <Input
                className="text-foreground-1 py-px"
                id="httpsUrl"
                readOnly
                value={httpsUrl}
                variant="extended"
                rightElementVariant="default"
                rightElement={<CopyButton name={httpsUrl} />}
              />
              <div className="mt-4 flex items-center">
                <span className="text-foreground-4 leading-snug">
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
              className="text-foreground-1 py-px"
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
