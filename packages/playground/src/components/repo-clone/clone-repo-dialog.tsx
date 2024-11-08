// import { TokenCreateForm, TokenFormType } from './token-create-form'
import { CloneRepoForm } from './clone-repo-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  Popover,
  PopoverContent,
  PopoverAnchor,
  PopoverTrigger,
  Button,
  Text
} from '@harnessio/canary'
import React, { useState } from 'react'

// interface TokenCreateDialogProps {
//   open: boolean
//   onClose: () => void
//   handleCreateToken: (data: TokenFormType) => void
//   error: { type: string; message: string } | null
//   isLoading: boolean
// }

export const CloneRepoDialog = (/*{ open, onOpenChange }: { open: boolean; onOpenChange: () => void }*/) => {
  const [currentTab, setCurrentTab] = useState('https')

  return (
    // <Dialog open={open} onOpenChange={onOpenChange}>
    //   <DialogContent className="max-w-[500px]  bg-primary-background border-border fixed">
    //     <DialogHeader>
    // <DialogTitle className="text-left mb-2">Git clone URL</DialogTitle>
    //       <Tabs variant="underline" value={currentTab} onValueChange={setCurrentTab}>
    //         <TabsList>
    //           <TabsTrigger value="https">HTTPS</TabsTrigger>
    //           <TabsTrigger value="ssh">SSH</TabsTrigger>
    //         </TabsList>
    //       </Tabs>
    //     </DialogHeader>
    //     <CloneRepoForm
    //       sshUrl="ssh://git@localhost:3022/pwproj/canary.git"
    //       httpsUrl="http://localhost:3000/git/pwproj/canary.git"
    //       currentTab={currentTab}
    //     />
    //     {/* <TokenCreateForm handleCreateToken={handleCreateToken} onClose={onClose} error={error} isLoading={isLoading} /> */}
    //   </DialogContent>
    // </Dialog>

    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default">Clone repository</Button>
      </PopoverTrigger>
      <PopoverContent
        className="min-w-[400px] max-w-[500px] bg-primary-background border-border"
        side="bottom"
        align="end">
        {/* <DialogHeader> */}

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
        {/* </DialogHeader> */}
        <CloneRepoForm
          sshUrl="ssh://git@localhost:3022/pwproj/canary.git"
          httpsUrl="http://localhost:3000/git/pwproj/canary.git"
          currentTab={currentTab}
        />
        {/* <TokenCreateForm handleCreateToken={handleCreateToken} onClose={onClose} error={error} isLoading={isLoading} /> */}
      </PopoverContent>
    </Popover>
  )
}
