import { FormEvent, ReactNode, useState } from 'react'

import { ModalDialog } from './modal-dialog'
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
      <ModalDialog.Root open={isSearchDialogOpen} onOpenChange={closeSearchDialog}>
        <ModalDialog.Content size="md" className="h-[600px]">
          <ModalDialog.Header>
            <ModalDialog.Title>Search</ModalDialog.Title>
          </ModalDialog.Header>
          <ModalDialog.Body>
            <SearchBox width="full" placeholder="Search..." />
          </ModalDialog.Body>
        </ModalDialog.Content>
      </ModalDialog.Root>
    </div>
  )
}

export { Root }
