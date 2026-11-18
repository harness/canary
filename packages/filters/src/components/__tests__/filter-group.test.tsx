import { ReactNode, useState } from 'react'
import type { Location, NavigateFunction } from 'react-router-dom'

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { FilterFieldTypes, TooltipProvider, type FilterOptionConfig } from '@harnessio/ui/components'

import { RouterContextProvider } from '../../router-context'
import FilterGroup from '../filter-group'

type TestFilters = { status: string }

const filterOptions: FilterOptionConfig<'status', Record<string, unknown>>[] = [
  {
    label: 'Status',
    value: 'status',
    type: FilterFieldTypes.Custom,
    filterFieldConfig: {
      renderCustomComponent: ({ onChange }: { onChange: (value: any) => void }) => (
        <button onClick={() => onChange('success')}>set status</button>
      )
    }
  } as any
]

const TestRouter = ({ initialSearch = '', children }: { initialSearch?: string; children: ReactNode }) => {
  const [search, setSearch] = useState(initialSearch)

  const navigate = ((to: string) => {
    setSearch(to.includes('?') ? to.slice(to.indexOf('?')) : '')
  }) as NavigateFunction

  const location = { pathname: '/', search, hash: '', state: null, key: 'test' } as Location

  return (
    <RouterContextProvider location={location} navigate={navigate}>
      {children}
    </RouterContextProvider>
  )
}

const renderFilterGroup = ({
  initialSearch,
  onSaveFilters = vi.fn().mockResolvedValue(undefined)
}: {
  initialSearch?: string
  onSaveFilters?: (data: any) => Promise<void> | void
} = {}) => {
  render(
    <TooltipProvider>
      <TestRouter initialSearch={initialSearch}>
        <FilterGroup<TestFilters, 'status'>
          hideSearch
          handleInputChange={vi.fn()}
          filterOptions={filterOptions}
          savedFiltersConfig={{
            savedFiltersOptions: [{ value: 'saved1', label: 'Saved 1' }],
            onSaveFilters,
            getSavedFiltersValues: async () => ({ status: 'failed' })
          }}
        />
      </TestRouter>
    </TooltipProvider>
  )
  return { onSaveFilters }
}

/** Opens the Status chip and picks a new value, i.e. a user edit of the applied filters. */
const changeStatus = async () => {
  const chip = screen.getByText('Status').closest('button') as HTMLElement
  chip.focus()
  userEvent.keyboard('{enter}')
  userEvent.click(await screen.findByText('set status'))
  userEvent.keyboard('{esc}')
  await waitFor(() => expect(screen.queryByText('set status')).not.toBeInTheDocument())
}

const getSaveTrigger = () => screen.getByRole('button', { name: 'Save' })

describe('FilterGroup Save filter button', () => {
  test('is enabled for manually built filters', async () => {
    renderFilterGroup({ initialSearch: '?status=failed' })

    await screen.findByText('Status')

    await waitFor(() => expect(getSaveTrigger()).toBeEnabled())
  })

  test('is disabled when a saved filter is applied and nothing changed', async () => {
    renderFilterGroup({ initialSearch: '?status=failed&filterIdentifier=saved1' })

    await screen.findByText('Status')

    await waitFor(() => expect(getSaveTrigger()).toBeDisabled())
  })

  test('is enabled again once the user changes a filter of the applied saved filter', async () => {
    renderFilterGroup({ initialSearch: '?status=failed&filterIdentifier=saved1' })

    await waitFor(() => expect(getSaveTrigger()).toBeDisabled())

    await changeStatus()

    await waitFor(() => expect(getSaveTrigger()).toBeEnabled())
  })

  test('is disabled after the current filters are saved as a new filter', async () => {
    const { onSaveFilters } = renderFilterGroup({ initialSearch: '?status=failed' })

    await screen.findByText('Status')
    await waitFor(() => expect(getSaveTrigger()).toBeEnabled())

    userEvent.click(getSaveTrigger())
    const dialog = await screen.findByRole('dialog')
    userEvent.type(within(dialog).getByRole('textbox'), 'my_filter')
    userEvent.click(within(dialog).getByRole('radio', { name: 'Everyone' }))
    userEvent.click(within(dialog).getAllByRole('button', { name: 'Save' }).pop() as HTMLElement)

    await waitFor(() => expect(onSaveFilters).toHaveBeenCalledWith({ identifier: 'my_filter', visibility: 'EveryOne' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(getSaveTrigger()).toBeDisabled()
  })

  test('stays enabled when saving the filter fails', async () => {
    const onSaveFilters = vi.fn().mockRejectedValue({ errMessage: 'Duplicate identifier' })
    renderFilterGroup({ initialSearch: '?status=failed', onSaveFilters })

    await screen.findByText('Status')
    await waitFor(() => expect(getSaveTrigger()).toBeEnabled())

    userEvent.click(getSaveTrigger())
    const dialog = await screen.findByRole('dialog')
    userEvent.type(within(dialog).getByRole('textbox'), 'my_filter')
    userEvent.click(within(dialog).getByRole('radio', { name: 'Everyone' }))
    userEvent.click(within(dialog).getAllByRole('button', { name: 'Save' }).pop() as HTMLElement)

    expect(await within(dialog).findByText('Duplicate identifier')).toBeInTheDocument()
    userEvent.click(within(dialog).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(getSaveTrigger()).toBeEnabled()
  })
})
