import { useEffect, useState } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  ButtonGroup,
  Icon,
  ScrollArea,
  Text
} from '@/components'
import useDragAndDrop from '@/hooks/use-drag-and-drop'
import { MenuGroupType, NavbarItemType } from '@components/navbar/types'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

import { DraggableItem } from './draggable-item'
import { ManageNavigationSearch } from './manage-navigation-search'

interface ManageNavigationProps {
  pinnedItems: NavbarItemType[]
  navbarMenuData: MenuGroupType[]
  showManageNavigation: boolean
  recentItems: NavbarItemType[]
  onSave: (recentItems: NavbarItemType[], currentPinnedItems: NavbarItemType[]) => void
  onClose: () => void
  isSubmitting: boolean
  submitted: boolean
}

const filterRecentItems = (pinnedItems: NavbarItemType[], recentItems: NavbarItemType[]) => {
  return recentItems.filter(item => !pinnedItems.some(pinnedItem => pinnedItem.id === item.id))
}

const filterMenuData = (menuData: MenuGroupType[], pinnedItems: NavbarItemType[]): MenuGroupType[] => {
  return menuData
    .map(group => ({
      ...group,
      items: group.items.filter(item => !pinnedItems.some(pinnedItem => pinnedItem.id === item.id))
    }))
    .filter(group => group.items.length > 0)
}

export const ManageNavigation = ({
  pinnedItems,
  recentItems,
  navbarMenuData,
  showManageNavigation,
  onSave,
  onClose,
  isSubmitting,
  submitted
}: ManageNavigationProps) => {
  const [currentPinnedItems, setCurrentPinnedItems] = useState<NavbarItemType[]>(pinnedItems)
  const [currentFilteredRecentItems, setCurrentFilteredRecentItems] = useState<NavbarItemType[]>(
    filterRecentItems(pinnedItems, recentItems)
  )
  const [isRecentCleared, setIsRecentCleared] = useState(false)

  useEffect(() => {
    setCurrentPinnedItems(pinnedItems)
  }, [pinnedItems])

  useEffect(() => {
    setCurrentFilteredRecentItems(filterRecentItems(pinnedItems, recentItems))
  }, [recentItems, pinnedItems])

  const { handleDragEnd, getItemId } = useDragAndDrop<NavbarItemType>({
    items: currentPinnedItems,
    onReorder: setCurrentPinnedItems
  })

  const handleCancel = () => {
    setCurrentPinnedItems(pinnedItems)
    setCurrentFilteredRecentItems(filterRecentItems(pinnedItems, recentItems))
    onClose()
  }

  const handleClearRecent = () => {
    setCurrentFilteredRecentItems([])
    setIsRecentCleared(true)
  }

  const onSubmit = () => {
    onSave(currentFilteredRecentItems, currentPinnedItems)
    onClose()
  }

  const updatePinnedItems = (items: NavbarItemType[]) => {
    setCurrentPinnedItems(items)
    setCurrentFilteredRecentItems(prevRecentItems => {
      if (isRecentCleared) {
        const unpinnedItems = currentPinnedItems
          .filter(item => !items.some(newItem => newItem.id === item.id))
          .filter(item => recentItems.some(recentItem => recentItem.id === item.id))
        return [...prevRecentItems, ...unpinnedItems]
      } else {
        return filterRecentItems(items, recentItems)
      }
    })
  }

  const addToPinnedItems = (item: NavbarItemType) => {
    const isAlreadyPinned = currentPinnedItems.some(pinnedItem => pinnedItem.id === item.id)

    if (!isAlreadyPinned) {
      updatePinnedItems([...currentPinnedItems, item])
    }
  }

  const removeFromPinnedItems = (item: NavbarItemType) => {
    updatePinnedItems(currentPinnedItems.filter(pinnedItem => pinnedItem.id !== item.id))
  }

  return (
    <AlertDialog open={showManageNavigation} onOpenChange={handleCancel}>
      <AlertDialogContent className="h-[574px] max-h-[70vh] max-w-[410px]" onOverlayClick={handleCancel}>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-4">Manage navigation</AlertDialogTitle>
          <ManageNavigationSearch
            navbarMenuData={filterMenuData(navbarMenuData, currentPinnedItems)}
            addToPinnedItems={addToPinnedItems}
          />
        </AlertDialogHeader>
        <ScrollArea className="-mx-5 -mb-5 mt-1">
          <div className="px-5">
            <Text className="text-foreground-7 inline-block leading-none" size={1}>
              Pinned
            </Text>
            {!currentPinnedItems.length ? (
              <Text className="mt-3 block text-foreground-5" size={1}>
                No pinned items
              </Text>
            ) : (
              <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                <SortableContext items={currentPinnedItems.map((_, index) => getItemId(index))}>
                  <ul className="-mx-3 mb-1 mt-3.5 flex flex-col gap-y-0.5">
                    {currentPinnedItems.map((item, index) => (
                      <DraggableItem id={getItemId(index)} tag="li" key={item.title}>
                        {({ attributes, listeners }) => (
                          <>
                            <Button
                              className="w-full grow cursor-grab gap-x-2.5 rounded p-1 px-3 active:cursor-grabbing"
                              variant="ghost"
                              {...attributes}
                              {...listeners}
                            >
                              <Icon className="w-3.5" name="grid-dots" size={14} />
                              <Text className="w-full text-left text-[inherit]">{item.title}</Text>
                            </Button>
                            <Button
                              className="absolute right-1 top-0.5 z-20 text-icons-4 hover:text-icons-2"
                              size="sm_icon"
                              variant="custom"
                              onClick={() => removeFromPinnedItems(item)}
                            >
                              <Icon className="w-3.5" name="x-mark" size={14} />
                            </Button>
                          </>
                        )}
                      </DraggableItem>
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            )}
            {currentFilteredRecentItems.length > 0 && (
              <>
                <div className="mt-4 flex items-center justify-between">
                  <Text className="inline-block leading-none text-foreground-7" size={1}>
                    Recent
                  </Text>
                  <Button className="-mr-1.5" variant="link_accent" size="xs" onClick={handleClearRecent}>
                    Clear all
                  </Button>
                </div>
                <ul className="mt-3 flex flex-col gap-y-0.5 pb-5">
                  {currentFilteredRecentItems.map((item, index) => (
                    <li className="relative flex h-8 items-center" key={`recent-${item.id}-${index}`}>
                      <div className="flex w-full grow items-center gap-x-2.5">
                        <Icon className="text-icons-4" name="clock-icon" size={14} />
                        <Text className="w-full text-left text-foreground-8">{item.title}</Text>
                      </div>
                      <Button
                        className="absolute -right-2 top-0.5 text-icons-4 hover:text-icons-2"
                        size="sm_icon"
                        variant="custom"
                        onClick={() => addToPinnedItems(item)}
                      >
                        <Icon name="pin" size={14} />
                      </Button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </ScrollArea>
        <AlertDialogFooter>
          <ButtonGroup.Root>
            {!submitted ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="button" theme="primary" onClick={onSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                type="button"
                size="sm"
                theme="success"
                className="pointer-events-none flex gap-2"
                disabled={submitted}
              >
                Saved
                <Icon name="tick" size={14} />
              </Button>
            )}
          </ButtonGroup.Root>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
