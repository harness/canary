import { Button, DropdownMenu, Icon, SearchBox } from '@/components'
import { TranslationStore } from '@/views'
import { cn } from '@utils/cn'

interface LabelsHeaderProps {
  labelsList?: { key?: string; id?: number; color?: string }[]
  selectedLabels?: { key?: string; id?: number; color?: string }[]
  addLabel?: (id?: number) => void
  searchQuery?: string
  setSearchQuery?: (query: string) => void
  useTranslationStore: () => TranslationStore
}

const LabelsHeader = ({
  labelsList,
  selectedLabels,
  addLabel,
  searchQuery,
  setSearchQuery,
  useTranslationStore
}: LabelsHeaderProps) => {
  const { t } = useTranslationStore()
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery?.(event.target.value)
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-14 font-medium">{t('views:pullRequests.labels')}</span>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button size="sm" variant="ghost" className="px-2 py-1 text-tertiary-background">
            <Icon name="vertical-ellipsis" size={12} />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[298px] p-0" align="start">
          <div className="px-3 pt-2">
            <div role="presentation" onKeyDown={e => e.stopPropagation()}>
              <SearchBox.Root
                className="mt-2 w-full"
                placeholder={t('views:pullRequests.searchLabels')}
                value={searchQuery}
                handleChange={handleSearchChange}
                showOnFocus
              />
            </div>
            <div className="mt-1">
              {labelsList?.length === 0 && (
                <div className="px-5 py-4 text-center">
                  <span className="text-14 leading-tight text-foreground-2">{t('views:pullRequests.noLabels')}</span>
                </div>
              )}
              <div className="max-h-[360px] overflow-y-auto px-1">
                {labelsList?.map(({ key, id }) => {
                  const isSelected = selectedLabels?.find(label => label.id === id)
                  return (
                    <DropdownMenu.Item
                      className={cn('hover:bg-background-4 cursor-pointer py-1', {
                        'bg-background-4': isSelected,
                        'pl-7': !isSelected
                      })}
                      key={id}
                      onClick={() => {
                        addLabel?.(id)
                      }}
                    >
                      <div className="flex w-full min-w-0 items-center gap-x-2">
                        {isSelected && <Icon name="tick" size={12} className="min-w-[12px] text-foreground-1" />}
                        <span
                          className={cn('text-foreground-2 truncate', {
                            'text-foreground-1': isSelected
                          })}
                        >
                          {key}
                        </span>
                      </div>
                    </DropdownMenu.Item>
                  )
                })}
              </div>
            </div>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export { LabelsHeader }
