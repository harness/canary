import { useEffect, useState } from 'react'

import { Icon } from '@/components'
import { useTranslation } from '@/context'

import { CommandPalette } from './command-palette'
import { useSearch } from './search-context'

enum PageKey {
  REPOSITORIES = 'repositories',
  PROJECTS = 'projects',
  PIPELINES = 'pipelines'
}

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
        icon: () => <Icon name="repositories" size={14} className="text-icons-1" />
      },
      {
        label: 'Create repository',
        action: () => alert('Create Repository'),
        icon: () => <Icon name="plus" size={14} className="text-icons-1" />
      },
      {
        label: 'Import repository',
        action: () => alert('Import Repository'),
        icon: () => <Icon name="download" size={14} className="text-icons-1" />
      }
    ],
    [PageKey.PROJECTS]: [
      {
        label: 'Search projects...',
        key: PageKey.PROJECTS,
        shortcut: ['⇧', 'P'],
        icon: () => <Icon name="environment" size={14} className="text-icons-1" />
      },
      {
        label: 'Create project',
        action: () => alert('Create Project'),
        icon: () => <Icon name="plus" size={14} className="text-icons-1" />
      },
      {
        label: 'Import project',
        action: () => alert('Import Project'),
        icon: () => <Icon name="download" size={14} className="text-icons-1" />
      }
    ],
    [PageKey.PIPELINES]: [
      {
        label: 'Search pipelines...',
        key: PageKey.PIPELINES,
        shortcut: ['⇧', 'L'],
        icon: () => <Icon name="pipelines" size={14} className="text-icons-1" />
      },
      {
        label: 'Create pipeline',
        action: () => alert('Create Pipeline'),
        icon: () => <Icon name="plus" size={14} className="text-icons-1" />
      }
    ]
  }

  const SUB_ITEMS: Record<PageKey, CommandOption[]> = {
    [PageKey.REPOSITORIES]: [
      {
        label: 'petstore-app',
        url: '/canary/repos/petstore-app/summary',
        icon: () => <Icon name="repositories" size={14} className="text-icons-1" />
      },
      {
        label: 'RealWorld',
        url: '/canary/repos/real-world/summary',
        icon: () => <Icon name="repositories" size={14} className="text-icons-1" />
      },
      {
        label: 'sock shop',
        url: '/canary/repos/sock-shop/summary',
        icon: () => <Icon name="repositories" size={14} className="text-icons-1" />
      },
      {
        label: 'anthos',
        url: '/canary/repos/anthos/summary',
        icon: () => <Icon name="repositories" size={14} className="text-icons-1" />
      },
      {
        label: 'acme-web',
        url: '/canary/repos/acme-web/summary',
        icon: () => <Icon name="repositories" size={14} className="text-icons-1" />
      }
    ],
    [PageKey.PROJECTS]: [
      {
        label: 'Canary',
        url: '/canary/repos/petstore-app/summary',
        icon: () => <Icon name="file" size={14} className="text-icons-1" />
      },
      {
        label: 'Paypal',
        url: '/canary/repos/real-world/summary',
        icon: () => <Icon name="file" size={14} className="text-icons-1" />
      }
    ],
    [PageKey.PIPELINES]: [
      {
        label: 'build-pipeline',
        url: '/canary/pipelines/build-pipeline/studio',
        icon: () => <Icon name="pipelines" size={14} className="text-icons-1" />
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
                    <div className="">{label}</div>
                    {shortcut && (
                      <CommandPalette.Shortcut>
                        <span>{shortcut[0]}</span>
                        <span>{shortcut[1]}</span>
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
