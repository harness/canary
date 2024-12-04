import { useState } from 'react'

import { Button, Popover, PopoverContent, PopoverTrigger, Tabs, TabsList, TabsTrigger, Text } from '@harnessio/canary'

import { CloneRepoForm } from './clone-repo-form'

export interface CloneRepoDialogProps {
  sshUrl: string
  httpsUrl: string
  handleCreateToken: () => void
}

export const CloneRepoDialog: React.FC<CloneRepoDialogProps> = ({ httpsUrl, sshUrl, handleCreateToken }) => {
  const [currentTab, setCurrentTab] = useState('https')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default">Clone repository</Button>
      </PopoverTrigger>
      <PopoverContent className="bg-primary-background border-border min-w-[400px]" side="bottom" align="end">
        <Text className="mb-2 text-left text-lg">Git clone URL</Text>
        <Tabs variant="underline" value={currentTab} onValueChange={setCurrentTab} className="mb-2">
          <TabsList>
            <TabsTrigger value="https" className="h-6">
              HTTPS
            </TabsTrigger>
            <TabsTrigger value="ssh" className="h-6">
              SSH
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
