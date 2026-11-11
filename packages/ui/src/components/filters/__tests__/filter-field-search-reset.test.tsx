import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TooltipProvider } from '../../tooltip'
import FilterField from '../filters-field'
import { FilterFieldTypes } from '../types'

describe('FilterField async search reset', () => {
  test('resets remote search when the filter dropdown closes', async () => {
    const onSearch = vi.fn()
    const onOpenChange = vi.fn()

    render(
      <TooltipProvider>
        <FilterField<'users', Array<{ label: string; value: string }>>
          filterOption={{
            label: 'Users',
            value: 'users',
            type: FilterFieldTypes.MultiSelect,
            filterFieldConfig: {
              options: [{ label: 'Alice', value: 'alice' }],
              onSearch,
              allowSearch: true
            }
          }}
          removeFilter={() => {}}
          shouldOpenFilter
          onChange={() => {}}
          onOpenChange={onOpenChange}
        />
      </TooltipProvider>
    )

    await userEvent.keyboard('{Escape}')

    expect(onSearch).toHaveBeenCalledWith('')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  test('resets remote search when the filter is removed', async () => {
    const onSearch = vi.fn()
    const removeFilter = vi.fn()

    render(
      <TooltipProvider>
        <FilterField<'users', Array<{ label: string; value: string }>>
          filterOption={{
            label: 'Users',
            value: 'users',
            type: FilterFieldTypes.MultiSelect,
            filterFieldConfig: {
              options: [{ label: 'Alice', value: 'alice' }],
              onSearch,
              allowSearch: true
            }
          }}
          removeFilter={removeFilter}
          shouldOpenFilter
          onChange={() => {}}
        />
      </TooltipProvider>
    )

    await userEvent.click(screen.getByRole('button', { name: /delete filter/i }))

    expect(onSearch).toHaveBeenCalledWith('')
    expect(removeFilter).toHaveBeenCalled()
  })
})
