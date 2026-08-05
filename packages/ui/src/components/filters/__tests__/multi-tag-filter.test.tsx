import { useState } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { MultiSelectOption } from '../../multi-select'
import { TooltipProvider } from '../../tooltip'
import FilterField from '../filters-field'
import { FilterFieldTypes } from '../types'

const TagsFilter = ({ onChange }: { onChange: (values: MultiSelectOption[]) => void }) => {
  const [value, setValue] = useState<MultiSelectOption[]>()

  return (
    <TooltipProvider>
      <FilterField<'tags', MultiSelectOption[]>
        filterOption={{
          label: 'Tags',
          value: 'tags',
          type: FilterFieldTypes.MultiTag
        }}
        removeFilter={() => {}}
        shouldOpenFilter
        value={value}
        onChange={values => {
          setValue(values)
          onChange(values)
        }}
      />
    </TooltipProvider>
  )
}

describe('MultiTag filter field', () => {
  test('applies the typed tag on Enter', async () => {
    const onChange = vi.fn()
    render(<TagsFilter onChange={onChange} />)

    const input = await screen.findByPlaceholderText('Filter a tag')
    await userEvent.click(input)
    await userEvent.type(input, 'Tag:Test')
    await userEvent.keyboard('{Enter}')

    expect(onChange).toHaveBeenCalledWith([{ key: 'Tag', value: 'Test', id: 'Tag:Test' }])
    expect(await screen.findByText('Tag')).toBeInTheDocument()
  })

  test('emits a new array on Enter so previously emitted values stay untouched', async () => {
    const emitted: MultiSelectOption[][] = []
    render(<TagsFilter onChange={values => emitted.push(values)} />)

    const input = await screen.findByPlaceholderText('Filter a tag')
    await userEvent.click(input)
    await userEvent.type(input, 'Tag:Test')
    await userEvent.keyboard('{Enter}')

    await userEvent.click(document.querySelector('.cn-tag-action-icon-button')!)

    await userEvent.click(input)
    await userEvent.type(input, 'Tag:Test')
    await userEvent.keyboard('{Enter}')

    expect(emitted).toHaveLength(3)
    // Consumers keep the emitted array in state and diff against the next one,
    // so the cleared value must not be mutated by the re-add.
    expect(emitted[1]).toEqual([])
    expect(emitted[2]).toEqual([{ key: 'Tag', value: 'Test', id: 'Tag:Test' }])
    expect(emitted[1]).not.toBe(emitted[2])
  })
})
