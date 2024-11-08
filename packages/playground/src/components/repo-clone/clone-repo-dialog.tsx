import { CloneRepoForm } from './clone-repo-form'
import { Tabs, TabsList, TabsTrigger, Popover, PopoverContent, PopoverTrigger, Button, Text } from '@harnessio/canary'
import React, { useState } from 'react'

export const CloneRepoDialog = () => {
  const [currentTab, setCurrentTab] = useState('https')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default">Clone repository</Button>
      </PopoverTrigger>
      <PopoverContent
        className="min-w-[400px] max-w-[500px] bg-primary-background border-border"
        side="bottom"
        align="end">
        <Text className="text-lg text-left mb-2">Git clone URL</Text>
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
          sshUrl="ssh://git@localhost:3022/pwproj/canary.git"
          httpsUrl="http://localhost:3000/git/pwproj/canary.git"
          currentTab={currentTab}
        />
      </PopoverContent>
    </Popover>
  )
}
