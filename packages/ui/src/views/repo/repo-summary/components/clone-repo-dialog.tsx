import { useState } from 'react'

import { Button, Icon, Input, Popover, PopoverContent, PopoverTrigger, Tabs, TabsList, TabsTrigger } from '@/components'
import { TranslationStore } from '@/views'

export interface CloneRepoDialogProps {
  sshUrl: string
  httpsUrl: string
  handleCreateToken: () => void
  useTranslationStore: () => TranslationStore
}

export const CloneRepoDialog: React.FC<CloneRepoDialogProps> = ({
  httpsUrl,
  sshUrl,
  handleCreateToken,
  useTranslationStore
}) => {
  const [currentTab, setCurrentTab] = useState('https')
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslationStore()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button>
          <Icon name="clone" />
          &nbsp; {t('views:repos.clone', 'Clone')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[400px] border-border bg-primary-background" side="bottom" align="end">
        <span className="mb-2 text-left text-lg">{t('views:repos.cloneUrl', 'Git clone URL')}</span>
        <Tabs variant="underline" value={currentTab} onValueChange={setCurrentTab} className="mb-2">
          <TabsList>
            <TabsTrigger value="https" className="h-6">
              {t('views:repos.cloneHttps', 'HTTPS')}
            </TabsTrigger>
            <TabsTrigger value="ssh" className="h-6">
              {t('views:repos.cloneSsh', 'SSH')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <>
          {currentTab === 'https' ? (
            <>
              <Input
                id="httpsUrl"
                readOnly
                value={httpsUrl}
                className="text-tertiary-background mb-2"
                /* TODO: add back after adding right icon functionality to <input> */
                // right={<CopyButton name={httpsUrl} />}
              />
              <Button variant="default" type="button" onClick={handleCreateToken} className="w-full mb-2">
                {t('views:repos.cloneCredential', 'Generate Clone Credential')}
              </Button>
              <div className="flex items-center">
                <Icon name="info-circle" size={15} className="text-tertiary-background" />
                <span className="ml-1 text-tertiary-background">
                  {t('views:repos.generateCredential', 'Please generate a clone credential if its your first time.')}
                </span>
              </div>
            </>
          ) : (
            <Input
              id="sshUrl"
              readOnly
              value={sshUrl}
              className="text-tertiary-background"
              /* TODO: add back after adding right icon functionality to <input> */
              // right={<CopyButton name={sshUrl} />}
            />
          )}
        </>
      </PopoverContent>
    </Popover>
  )
}
