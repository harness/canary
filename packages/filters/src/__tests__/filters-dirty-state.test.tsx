import { ReactNode, useState } from 'react'
import type { Location, NavigateFunction } from 'react-router-dom'

import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { Filters, useFiltersContext } from '../Filters'
import { RouterContextProvider } from '../router-context'

const SAVED_FILTER_KEY = 'filterIdentifier'

type TestFilters = { status: string; branch: string }

const savedFilters: Record<string, Partial<TestFilters>> = {
  saved1: { status: 'failed' },
  saved2: { status: 'success', branch: 'main' }
}

/** Minimal in-memory router so the Filters component can read/update the URL. */
const TestRouter = ({ initialSearch = '', children }: { initialSearch?: string; children: ReactNode }) => {
  const [search, setSearch] = useState(initialSearch)

  const navigate = ((to: string) => {
    const query = to.includes('?') ? to.slice(to.indexOf('?')) : ''
    setSearch(query)
  }) as NavigateFunction

  const location = { pathname: '/', search, hash: '', state: null, key: 'test' } as Location

  return (
    <RouterContextProvider location={location} navigate={navigate}>
      {children}
    </RouterContextProvider>
  )
}

/** Exposes the filters context through buttons and renders the current `isFilterDirty` value. */
const Probe = () => {
  const { isFilterDirty, applySavedFilter, addFilter, updateFilter, removeFilter, resetFilters, markFiltersSaved } =
    useFiltersContext<TestFilters>()

  return (
    <div>
      <span data-testid="dirty">{String(isFilterDirty)}</span>
      <button onClick={() => applySavedFilter('saved1')}>apply saved1</button>
      <button onClick={() => applySavedFilter('saved2')}>apply saved2</button>
      <button onClick={() => applySavedFilter('unknown')}>apply unknown</button>
      <button onClick={() => addFilter('branch')}>add</button>
      <button onClick={() => updateFilter('status', 'success', 'success')}>update</button>
      <button onClick={() => removeFilter('status')}>remove</button>
      <button onClick={() => resetFilters()}>reset</button>
      <button onClick={() => markFiltersSaved()}>mark saved</button>
    </div>
  )
}

const renderFilters = (initialSearch = '') =>
  render(
    <TestRouter initialSearch={initialSearch}>
      <Filters
        savedFiltersConfig={{
          savedFilterKey: SAVED_FILTER_KEY,
          getSavedFilters: id => savedFilters[id]
        }}
      >
        <Probe />
      </Filters>
    </TestRouter>
  )

const expectDirty = (value: boolean) => expect(screen.getByTestId('dirty')).toHaveTextContent(String(value))

describe('Filters isFilterDirty', () => {
  test('is dirty by default so manually built filters can be saved', () => {
    renderFilters()

    expectDirty(true)
  })

  test('is clean after a saved filter is applied', async () => {
    renderFilters()

    userEvent.click(screen.getByText('apply saved1'))

    await waitFor(() => expectDirty(false))
  })

  test.each([
    ['updating a filter value', 'update'],
    ['adding a filter', 'add'],
    ['removing a filter', 'remove']
  ])('becomes dirty again after %s', async (_label, button) => {
    renderFilters()

    userEvent.click(screen.getByText('apply saved1'))
    await waitFor(() => expectDirty(false))

    userEvent.click(screen.getByText(button))

    await waitFor(() => expectDirty(true))
  })

  test('becomes dirty after a reset that clears the saved filter', async () => {
    renderFilters()

    userEvent.click(screen.getByText('apply saved1'))
    await waitFor(() => expectDirty(false))

    userEvent.click(screen.getByText('reset'))

    await waitFor(() => expectDirty(true))
  })

  test('stays clean when switching to another saved filter', async () => {
    renderFilters()

    userEvent.click(screen.getByText('apply saved1'))
    await waitFor(() => expectDirty(false))

    userEvent.click(screen.getByText('apply saved2'))

    await waitFor(() => expectDirty(false))
  })

  test('applying a saved filter after edits makes it clean again', async () => {
    renderFilters()

    userEvent.click(screen.getByText('update'))
    await waitFor(() => expectDirty(true))

    userEvent.click(screen.getByText('apply saved1'))

    await waitFor(() => expectDirty(false))
  })

  test('stays dirty when the saved filter cannot be loaded', async () => {
    renderFilters()

    userEvent.click(screen.getByText('apply unknown'))

    // give the async applySavedFilter a chance to (incorrectly) flip the flag
    await act(async () => {
      await Promise.resolve()
    })
    expectDirty(true)
  })

  test('markFiltersSaved marks the current filters as saved until they change again', async () => {
    renderFilters()

    userEvent.click(screen.getByText('mark saved'))
    expectDirty(false)

    userEvent.click(screen.getByText('update'))
    await waitFor(() => expectDirty(true))
  })
})
