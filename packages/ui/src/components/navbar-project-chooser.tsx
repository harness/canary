import { FormEvent, ReactNode, useState } from 'react'

import { Dialog } from './dialog'
import { Root as SearchBox } from './search-box'

interface ProjectProps {
  logo: ReactNode
}

function Root({ logo }: ProjectProps) {
  const [isSearchDialogOpen, setSearchDialogOpen] = useState(false)

  const openSearchDialog = (e?: FormEvent<HTMLInputElement>) => {
    e?.preventDefault()
    e?.stopPropagation()

    setSearchDialogOpen(true)
  }

  const closeSearchDialog = () => {
    setSearchDialogOpen(false)
  }

  return (
    <div className="flex w-full flex-col place-items-start px-3 pb-3">
      <div className="flex h-[58px] items-center px-1">{logo}</div>
      <SearchBox
        width="full"
        placeholder="Search..."
        hasShortcut
        shortcutLetter="K"
        shortcutModifier="cmd"
        value=""
        onSearch={openSearchDialog}
        handleChange={openSearchDialog}
      />
      <Dialog.Root open={isSearchDialogOpen} onOpenChange={closeSearchDialog}>
        <Dialog.Content size="md" className="h-[600px]">
          <Dialog.Header>
            <Dialog.Title>Search</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <SearchBox width="full" placeholder="Search..." />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}

export { Root }
