import { FC, useState } from 'react'

import { Button, Popover, PopoverContent, PopoverTrigger, Text } from '@harnessio/canary'
import { Tabs } from '@harnessio/ui/components'

import { CloneRepoForm } from './clone-repo-form'

export interface CloneRepoDialogProps {
  sshUrl: string
  httpsUrl: string
  handleCreateToken: () => void
}

export const CloneRepoDialog: FC<CloneRepoDialogProps> = ({ httpsUrl, sshUrl, handleCreateToken }) => {
  const [currentTab, setCurrentTab] = useState('https')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default">Clone repository</Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[400px] border-border bg-primary-background" side="bottom" align="end">
        <Text className="mb-2 text-left text-lg">Git clone URL</Text>
        <Tabs.Root variant="underline" value={currentTab} onValueChange={setCurrentTab} className="mb-2">
          <Tabs.List>
            <Tabs.Trigger value="https" className="h-6">
              HTTPS
            </Tabs.Trigger>
            <Tabs.Trigger value="ssh" className="h-6">
              SSH
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <CloneRepoForm
          sshUrl={sshUrl}
          httpsUrl={httpsUrl}
          currentTab={currentTab}
          handleCreateToken={handleCreateToken}
        />
      </PopoverContent>
    </Popover>
  )
}
