import { useEffect, useMemo, useState } from 'react'

import { Button, ButtonLayout, Dialog, IconV2, Layout, Text } from '@/components'
import useDragAndDrop from '@/hooks/use-drag-and-drop'
import { MenuGroupType, NavbarItemType } from '@components/app-sidebar/types'
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

  const permanentlyPinnedItems = useMemo(
    () => currentPinnedItems.filter(item => item.permanentlyPinned),
    [currentPinnedItems]
  )
  const draggablePinnedItems = useMemo(
    () => currentPinnedItems.filter(item => !item.permanentlyPinned),
    [currentPinnedItems]
  )

  return (
    <Dialog.Root open={showManageNavigation} onOpenChange={handleCancel}>
      <Dialog.Content className="max-h-[70vh]">
        <Dialog.Header>
          <Dialog.Title>Manage navigation</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body>
          <ManageNavigationSearch
            navbarMenuData={filterMenuData(navbarMenuData, currentPinnedItems)}
            addToPinnedItems={addToPinnedItems}
          />
          <Layout.Grid gapY="xs">
            <Text variant="body-single-line-normal" color="foreground-3">
              Pinned
            </Text>
            {!currentPinnedItems.length ? (
              <Text color="foreground-3">No pinned items</Text>
            ) : (
              <DndContext
                onDragEnd={handleDragEnd}
                collisionDetection={closestCenter}
                modifiers={[
                  args => ({
                    ...args.transform,
                    x: 0 // Prevent horizontal drag
                  })
                ]}
              >
                <SortableContext items={currentPinnedItems.map((_, index) => getItemId(index))}>
                  <Layout.Flex direction="column" gapY="4xs" as="ul">
                    {permanentlyPinnedItems.map(item => {
                      return (
                        <Layout.Flex
                          align="center"
                          as="li"
                          key={item.id}
                          gapX="xs"
                          className="w-full grow cursor-not-allowed rounded p-1 px-0 opacity-55"
                        >
                          <IconV2 className="w-3.5" name="lock" size="xs" />
                          <Text>{item.title}</Text>
                        </Layout.Flex>
                      )
                    })}
                    {draggablePinnedItems.map((item, index) => (
                      <DraggableItem id={getItemId(index + permanentlyPinnedItems.length)} tag="li" key={item.title}>
                        {({ attributes, listeners }) => {
                          return (
                            <Layout.Flex
                              justify="between"
                              gapX="xs"
                              align="center"
                              className="hover:bg-cn-3 w-full grow cursor-grab rounded active:cursor-grabbing"
                            >
                              <Button {...attributes} {...listeners} variant="transparent" className="justify-start">
                                <IconV2 name="grip-dots" size="xs" />
                                <Text color="inherit">{item.title}</Text>
                              </Button>
                              <Button
                                iconOnly
                                size="sm"
                                variant="transparent"
                                onClick={() => {
                                  removeFromPinnedItems(item)
                                }}
                              >
                                <IconV2 name="xmark" size="xs" />
                              </Button>
                            </Layout.Flex>
                          )
                        }}
                      </DraggableItem>
                    ))}
                  </Layout.Flex>
                </SortableContext>
              </DndContext>
            )}
          </Layout.Grid>

          {currentFilteredRecentItems.length > 0 && (
            <Layout.Grid gapY="xs">
              <Layout.Flex align="center" justify="between">
                <Text variant="body-single-line-normal" color="foreground-3" as="span">
                  Recent
                </Text>
                <Button variant="link" size="sm" onClick={handleClearRecent}>
                  Clear all
                </Button>
              </Layout.Flex>
              <Layout.Flex direction="column" gapY="4xs" as="ul">
                {currentFilteredRecentItems.map((item, index) => (
                  <Layout.Flex
                    align="center"
                    justify="between"
                    className="relative h-8"
                    key={`recent-${item.id}-${index}`}
                    as="li"
                  >
                    <Layout.Flex align="center" gap="xs" className="w-full grow">
                      <IconV2 className="text-icons-4" name="clock" size="xs" />
                      <Text color="foreground-1">{item.title}</Text>
                    </Layout.Flex>

                    <Button iconOnly size="sm" variant="transparent" onClick={() => addToPinnedItems(item)}>
                      <IconV2 name="pin" size="xs" />
                    </Button>
                  </Layout.Flex>
                ))}
              </Layout.Flex>
            </Layout.Grid>
          )}
        </Dialog.Body>

        <Dialog.Footer>
          <ButtonLayout>
            {!submitted ? (
              <>
                <Dialog.Close disabled={isSubmitting}>Cancel</Dialog.Close>
                <Button type="button" variant="primary" onClick={onSubmit} disabled={isSubmitting}>
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
                <IconV2 name="check" size="xs" />
              </Button>
            )}
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
