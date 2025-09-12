import { useEffect, useState } from 'react'

import { IconPropsV2, IconV2, Text } from '@/components'
import { useTranslation } from '@/context'

import { CommandPalette } from './command-palette'
import { useSearch } from './search-context'

enum PageKey {
  REPOSITORIES = 'repositories',
  PROJECTS = 'projects',
  PIPELINES = 'pipelines'
}

const renderIcon = (name: NonNullable<IconPropsV2['name']>) => <IconV2 name={name} size="xs" className="text-cn-3" />

interface CommandOption {
  label: string
  key?: PageKey
  shortcut?: [string, string] // Symbol + Key (e.g., ["⇧", "R"])
  url?: string
  action?: () => void
  icon?: () => JSX.Element
}

export function CommandPaletteWrapper() {
  const { t } = useTranslation()

  const { isOpen, setIsOpen } = useSearch()
  const [search, setSearch] = useState('')
  const [pages, setPages] = useState<PageKey[]>([])
  const page = pages[pages.length - 1]

  const DEFAULT = {
    placeholder: 'What do you need?'
  }

  const [placeholder, setPlaceholder] = useState(DEFAULT.placeholder)

  useEffect(() => {
    setPlaceholder(page ? `Search ${page}...` : DEFAULT.placeholder)
  }, [page])

  function onItemClick(target: PageKey) {
    setPages([...pages, target])
    setSearch('')
  }

  const MENU_OPTIONS: Record<PageKey, CommandOption[]> = {
    [PageKey.REPOSITORIES]: [
      {
        label: 'Search repositories...',
        key: PageKey.REPOSITORIES,
        shortcut: ['⇧', 'R'],
        icon: () => renderIcon('repository')
      },
      {
        label: 'Create repository',
        action: () => alert('Create Repository'),
        icon: () => renderIcon('plus')
      },
      {
        label: 'Import repository',
        action: () => alert('Import Repository'),
        icon: () => renderIcon('download')
      }
    ],
    [PageKey.PROJECTS]: [
      {
        label: 'Search projects...',
        key: PageKey.PROJECTS,
        shortcut: ['⇧', 'P'],
        icon: () => renderIcon('environments')
      },
      {
        label: 'Create project',
        action: () => alert('Create Project'),
        icon: () => renderIcon('plus')
      },
      {
        label: 'Import project',
        action: () => alert('Import Project'),
        icon: () => renderIcon('download')
      }
    ],
    [PageKey.PIPELINES]: [
      {
        label: 'Search pipelines...',
        key: PageKey.PIPELINES,
        shortcut: ['⇧', 'L'],
        icon: () => renderIcon('pipeline')
      },
      {
        label: 'Create pipeline',
        action: () => alert('Create Pipeline'),
        icon: () => renderIcon('plus')
      }
    ]
  }

  const SUB_ITEMS: Record<PageKey, CommandOption[]> = {
    [PageKey.REPOSITORIES]: [
      {
        label: 'petstore-app',
        url: '/canary/repos/petstore-app/summary',
        icon: () => renderIcon('repository')
      },
      {
        label: 'RealWorld',
        url: '/canary/repos/real-world/summary',
        icon: () => renderIcon('repository')
      },
      {
        label: 'sock shop',
        url: '/canary/repos/sock-shop/summary',
        icon: () => renderIcon('repository')
      },
      {
        label: 'anthos',
        url: '/canary/repos/anthos/summary',
        icon: () => renderIcon('repository')
      },
      {
        label: 'acme-web',
        url: '/canary/repos/acme-web/summary',
        icon: () => renderIcon('repository')
      }
    ],
    [PageKey.PROJECTS]: [
      {
        label: 'Canary',
        url: '/canary/repos/petstore-app/summary',
        icon: () => renderIcon('page')
      },
      {
        label: 'Paypal',
        url: '/canary/repos/real-world/summary',
        icon: () => renderIcon('page')
      }
    ],
    [PageKey.PIPELINES]: [
      {
        label: 'build-pipeline',
        url: '/canary/pipelines/build-pipeline/studio',
        icon: () => renderIcon('pipeline')
      }
    ]
  }

  return (
    <CommandPalette.Dialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandPalette.Root
        label={t('component:navbar.command-palette', 'Command Palette')}
        onKeyDown={(e: any) => {
          if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
            e.preventDefault()
            setPages(pages => pages.slice(0, -1))
          }
        }}
      >
        <CommandPalette.Input placeholder={placeholder} value={search} onValueChange={setSearch} />
        <CommandPalette.List className="pb-3">
          <CommandPalette.Empty>{t('component:navbar.nothing-found', 'Nothing Found')}</CommandPalette.Empty>

          {!page ? (
            Object.entries(MENU_OPTIONS).map(([key, items]) => (
              <CommandPalette.Group key={key} heading={key}>
                {items.map(({ label, key, action, icon, shortcut }) => (
                  <CommandPalette.Item key={label} onSelect={() => (key ? onItemClick(key) : action?.())}>
                    <div className="mr-2.5">{icon && icon()}</div>
                    <Text color="foreground-1">{label}</Text>
                    {shortcut && (
                      <CommandPalette.Shortcut>
                        <Text variant="caption-light">{shortcut[0]}</Text>
                        <Text variant="caption-light">{shortcut[1]}</Text>
                      </CommandPalette.Shortcut>
                    )}
                  </CommandPalette.Item>
                ))}
              </CommandPalette.Group>
            ))
          ) : (
            <CommandPalette.Group heading={page}>
              {SUB_ITEMS[page]?.map(({ label, url, icon }) => (
                <CommandPalette.Item key={label} onSelect={() => (window.location.href = url!)}>
                  <div className="mr-2.5">{icon && icon()}</div>
                  <div className="">{label}</div>
                </CommandPalette.Item>
              ))}
            </CommandPalette.Group>
          )}
        </CommandPalette.List>
      </CommandPalette.Root>
    </CommandPalette.Dialog>
  )
}
