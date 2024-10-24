import React, { useState } from 'react'
import { Root as SearchBox } from './search-box'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog'
import { Spacer } from './spacer'

interface ProjectProps {
  avatarLink: React.ReactNode
  productLink: React.ReactNode
}

function Root({ avatarLink, productLink }: ProjectProps) {
  const [isSearchDialogOpen, setSearchDialogOpen] = useState(false)

  const openSearchDialog = () => {
    setSearchDialogOpen(true)
  }

  const closeSearchDialog = () => {
    setSearchDialogOpen(false)
  }

  return (
    <div className="flex flex-col w-full items-start justify-items-start px-5 pb-5">
      <div className="h-[55px] flex items-center gap-1.5">
        {avatarLink}
        {productLink}
      </div>
      <SearchBox
        textSize={1}
        width="full"
        placeholder="Search..."
        hasShortcut
        shortcutLetter="K"
        shortcutModifier="cmd"
        onSearch={openSearchDialog}
        showOnFocus
        className="rounded-sm"
      />
      <Dialog open={isSearchDialogOpen} onOpenChange={closeSearchDialog}>
        <DialogContent className="max-w-[800px] h-[600px] bg-primary-background border-border">
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
