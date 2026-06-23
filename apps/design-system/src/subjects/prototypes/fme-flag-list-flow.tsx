import { useMemo, useState } from 'react'
import type { OnChangeFn, SortingState } from '@tanstack/react-table'

import { DataTable } from '@harnessio/ui/components'

import { FlagListPage } from './_shared/fme-chrome'
import { CreateFlagDrawer } from './_shared/create-flag-drawer'
import { FlagListEmpty, makeFlagColumns, type FlagRow } from './_shared/flag-data'

/**
 * FME → Feature Flag List — the INTERACTIVE FLOW (one surface, many states).
 *
 * This stitches the three Figma artboards into a single living prototype rather
 * than three routes: the list holds real state, the create drawer is an OVERLAY
 * STATE of it, and Confirm mutates the list. The journey reads as
 *   empty (first-run)  →  [click New Feature Flag]  →  create drawer over the list
 *                      →  [Confirm]  →  the list, now populated
 * — fewer screens, more states, exactly as a real flow behaves.
 *
 * Starts EMPTY on purpose so you can walk the whole first-run path: create a flag
 * and it appears at the top of the now-populated list. For the rich operational
 * state (all nine status variants), the `fme-flag-list` route starts pre-populated
 * and wires the same drawer — both are live, not statics.
 *
 * Shares chrome (fme-chrome), data/cells (flag-data), and the drawer
 * (create-flag-drawer) so nothing drifts between the two entry points.
 */
export default function FmeFlagListFlowPrototype(): JSX.Element {
  const [flags, setFlags] = useState<FlagRow[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
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
        // While empty, the single filled primary is the in-body NoData CTA, so the
        // title-row button demotes to outline (→ *hierarchy earns attention*). Once
        // populated, the title-row primary is the only create entry point → fill it.
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
