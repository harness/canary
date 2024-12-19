import { useState } from 'react'

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

export const CloneRepoDialog: React.FC<CloneRepoDialogProps> = ({
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
        <Button>
          <Icon name="clone" />
          &nbsp; {t('views:repos.clone', 'Clone')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[328px] p-0" align="end">
        <div className="px-4 pt-4">
          <span className="text-14 font-medium leading-none">{t('views:repos.cloneRepo', 'Clone repository')}</span>
        </div>
        <Tabs
          className="mt-2"
          variant="branch"
          value={currentTab}
          onValueChange={val => setCurrentTab(val as CloneRepoTabs)}
        >
          <TabsList>
            <DropdownMenuItem
              className="rounded-t-md p-0"
              onSelect={e => {
                e.preventDefault()
                setCurrentTab(CloneRepoTabs.HTTPS)
              }}
            >
              <TabsTrigger className="data-[state=active]:bg-background-2" value={CloneRepoTabs.HTTPS}>
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
                className="data-[state=active]:bg-background-2"
                value={CloneRepoTabs.SSH}
                onClick={e => e.stopPropagation()}
              >
                {t('views:repos.cloneSsh', 'SSH')}
              </TabsTrigger>
            </DropdownMenuItem>
          </TabsList>
        </Tabs>
        <div className="px-5 py-4">
          {currentTab === 'https' ? (
            <>
              <Input
                id="httpsUrl"
                readOnly
                value={httpsUrl}
                variant="extended"
                className="text-foreground-2"
                rightElementVariant="default"
                rightElement={<CopyButton name={httpsUrl} />}
              />
              <div className="flex items-center mt-4">
                <span className="text-foreground-4">
                  {t('views:repos.generateCredential', 'Please generate a clone credential if its your first time.')}
                </span>
              </div>
              <div className="flex items-center mt-4">
                <Button variant="default" type="button" onClick={handleCreateToken} className="px-2 w-full">
                  {t('views:repos.cloneCredential', 'Generate Clone Credential')}
                </Button>
              </div>
            </>
          ) : (
            <Input
              id="sshUrl"
              readOnly
              value={sshUrl}
              className="text-tertiary-background"
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
