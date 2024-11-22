import { useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog'
import { Root as SearchBox } from './search-box'
import { Spacer } from './spacer'

interface ProjectProps {
  logo: React.ReactNode
}

function Root({ logo }: ProjectProps) {
  const [isSearchDialogOpen, setSearchDialogOpen] = useState(false)

  const openSearchDialog = () => {
    setSearchDialogOpen(true)
  }

  const closeSearchDialog = () => {
    setSearchDialogOpen(false)
  }

  return (
    <div className="flex w-full flex-col items-start justify-items-start px-5 pb-[1.375rem]">
      <div className="flex h-[58px] items-center">{logo}</div>
      <SearchBox
        width="full"
        placeholder="Search..."
        hasShortcut
        shortcutLetter="K"
        shortcutModifier="cmd"
        onSearch={openSearchDialog}
        showOnFocus
      />
      <Dialog open={isSearchDialogOpen} onOpenChange={closeSearchDialog}>
        <DialogContent className="border-border bg-primary-background h-[600px] max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              <Spacer size={6} />
              <SearchBox width="full" placeholder="Search..." />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { Root }
