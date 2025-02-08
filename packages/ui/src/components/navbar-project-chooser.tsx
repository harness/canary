import { FormEvent, ReactNode, useState } from 'react'

import { Dialog } from './dialog'
import { Root as SearchBox } from './search-box'
import { Spacer } from './spacer'

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
        <Dialog.Content className="h-[600px] max-w-[800px]">
          <Dialog.Header>
            <Dialog.Title>Search</Dialog.Title>
            <Dialog.Description>
              <Spacer size={6} />
              <SearchBox width="full" placeholder="Search..." />
            </Dialog.Description>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}

export { Root }
