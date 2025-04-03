import { FC, useState } from 'react'

import { DropdownMenu, Icon } from '@/components'

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
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger className="flex items-center gap-x-1.5">
        <span className="flex items-center gap-x-1 text-14 text-cn-foreground-2 hover:text-cn-foreground-1">
          View
          <Icon className="chevron-down text-icons-4" name="chevron-fill-down" size={6} />
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="max-h-[358px] w-56 overflow-y-auto" align="end">
        {!!layoutOptions?.length && (
          <>
            <div className="px-2 py-2.5">
              <span className="text-13 leading-none text-cn-foreground-3">Layout</span>
            </div>
            {layoutOptions.map(option => (
              <DropdownMenu.Item key={option.value} onSelect={() => onLayoutChange?.(option.value)} className="gap-x-2">
                <span>{option.label}</span>
                {currentLayout === option.value && (
                  <Icon name="tick" size={12} className="ml-auto text-cn-foreground-1" />
                )}
              </DropdownMenu.Item>
            ))}
          </>
        )}

        {savedViews.length > 0 && (
          <>
            {!!layoutOptions?.length && <DropdownMenu.Separator />}
            <div className="px-2 py-1.5">
              <div className="flex items-center justify-between">
                <span className="text-13 leading-none text-cn-foreground-3">Saved views</span>
                <button
                  className="text-13 text-cn-foreground-accent transition-colors duration-200 hover:text-cn-foreground-1"
                  onClick={handleManageClick}
                >
                  Manage
                </button>
              </div>
            </div>
            {savedViews.map(view => (
              <DropdownMenu.Item key={view.id} className="gap-x-2" onSelect={() => onViewSelect(view)}>
                <span>{view.name}</span>
                {currentView?.id === view.id && <Icon name="tick" size={12} className="ml-auto text-cn-foreground-1" />}
              </DropdownMenu.Item>
            ))}
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default ViewTrigger
