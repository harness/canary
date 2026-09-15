import { render, screen } from '@testing-library/react'

import { TooltipProvider } from '../../tooltip'
import FilterField from '../filters-field'
import { FilterFieldTypes } from '../types'

const renderField = (variant?: 'secondary' | 'outline') =>
  render(
    <TooltipProvider>
      <FilterField<'status', string>
        filterOption={{
          label: 'Status',
          value: 'status',
          type: FilterFieldTypes.Text
        }}
        removeFilter={() => {}}
        shouldOpenFilter={false}
        onChange={() => {}}
        variant={variant}
      />
    </TooltipProvider>
  )

describe('FilterField trigger variant', () => {
  test('defaults to secondary so existing callers stay unchanged', () => {
    renderField()

    const trigger = screen.getByText('Status').closest('button')

    expect(trigger).toHaveClass('cn-button-secondary')
    expect(trigger).not.toHaveClass('cn-button-outline')
  })

  test('supports outline for standalone filters', () => {
    renderField('outline')

    const trigger = screen.getByText('Status').closest('button')

    expect(trigger).toHaveClass('cn-button-outline')
    expect(trigger).not.toHaveClass('cn-button-secondary')
  })
})
