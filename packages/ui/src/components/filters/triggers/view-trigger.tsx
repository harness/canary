import { FC, useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon
} from '@/components'

import { SavedView, ViewLayoutOption } from '../types'

interface ViewTriggerProps {
  savedViews: SavedView[]
  currentView: SavedView | null
  layoutOptions?: ViewLayoutOption[]
  currentLayout?: string
  onLayoutChange?: (layout: string) => void
  onManageClick: () => void
  onViewSelect: (view: SavedView) => void
}

const ViewTrigger: FC<ViewTriggerProps> = ({
  savedViews,
  currentView,
  layoutOptions,
  currentLayout,
  onLayoutChange,
  onManageClick,
  onViewSelect
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleManageClick = () => {
    setIsOpen(false)
    onManageClick()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex items-center gap-x-1.5">
        <span className="flex items-center gap-x-1 text-14 text-foreground-2 hover:text-foreground-1">
          View
          <Icon className="chevron-down text-icons-4" name="chevron-fill-down" size={6} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[358px] w-56 overflow-y-auto" align="end">
        {!!layoutOptions?.length && (
          <>
            <div className="px-2 py-2.5">
              <span className="text-13 leading-none text-foreground-7">Layout</span>
            </div>
            {layoutOptions.map(option => (
              <DropdownMenuItem key={option.value} onSelect={() => onLayoutChange?.(option.value)} className="gap-x-2">
                <span>{option.label}</span>
                {currentLayout === option.value && <Icon name="tick" size={12} className="ml-auto text-foreground-8" />}
              </DropdownMenuItem>
            ))}
          </>
        )}

        {savedViews.length > 0 && (
          <>
            {!!layoutOptions?.length && <DropdownMenuSeparator />}
            <div className="px-2 py-1.5">
              <div className="flex items-center justify-between">
                <span className="text-13 leading-none text-foreground-7">Saved views</span>
                <button
                  className="text-13 text-foreground-accent transition-colors duration-200 hover:text-foreground-1"
                  onClick={handleManageClick}
                >
                  Manage
                </button>
              </div>
            </div>
            {savedViews.map(view => (
              <DropdownMenuItem key={view.id} className="gap-x-2" onSelect={() => onViewSelect(view)}>
                <span>{view.name}</span>
                {currentView?.id === view.id && <Icon name="tick" size={12} className="ml-auto text-foreground-8" />}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ViewTrigger
