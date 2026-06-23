import { useMemo, useState } from 'react'
import type { OnChangeFn, SortingState } from '@tanstack/react-table'

import { DataTable } from '@harnessio/ui/components'

import { FlagListPage } from './_shared/fme-chrome'
import { CreateFlagDrawer } from './_shared/create-flag-drawer'
import {
  FlagListEmpty,
  makeFlagColumns,
  seedFlags,
  type FlagRow
} from './_shared/flag-data'

/**
 * FME → Feature Flag List — the POPULATED operational state, fully interactive.
 *
 * Same living surface as `fme-flag-list-flow`, but pre-seeded with the realistic
 * list (all nine Rollout Status variants, pinned rows) so you land on the rich
 * reviewable state. "New Feature Flag" (title row) opens the same create drawer
 * over the list; Confirm prepends the new flag. If you delete every row the
 * surface falls back to the first-run empty state — fewer screens, more states.
 *
 * This reproduces Figma artboards 3037:110288 / 3661:98124 (pixel-identical
 * populated duplicates). Shares chrome, data/cells, and the drawer with the flow.
 */
export default function FmeFlagListPrototype(): JSX.Element {
  const [flags, setFlags] = useState<FlagRow[]>(seedFlags)
  const [drawerOpen, setDrawerOpen] = useState(false)
  // Name sorted ascending by default, matching the frame's Name ↓ caret.
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])

  const columns = useMemo(() => makeFlagColumns(), [])

  const handleSortingChange: OnChangeFn<SortingState> = updater => {
    setSorting(prev => (typeof updater === 'function' ? updater(prev) : updater))
  }

  const isEmpty = flags.length === 0

  return (
    <>
      <FlagListPage
        onCreate={() => setDrawerOpen(true)}
        createVariant={isEmpty ? 'outline' : 'primary'}
      >
        {isEmpty ? (
          <FlagListEmpty onCreate={() => setDrawerOpen(true)} />
        ) : (
          <DataTable<FlagRow>
            columns={columns}
            data={flags}
            getRowId={row => row.id}
            size="compact"
            currentSorting={sorting}
            onSortingChange={handleSortingChange}
            paginationProps={{
              currentPage: 1,
              pageSize: 25,
              totalItems: flags.length,
              goToPage: () => {}
            }}
          />
        )}
      </FlagListPage>

      <CreateFlagDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onCreate={flag => setFlags(prev => [flag, ...prev])}
      />
    </>
  )
}
