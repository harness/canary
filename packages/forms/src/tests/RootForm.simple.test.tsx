import * as React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { RootForm } from '../core'

describe('RootForm Simple Tests', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render form with submit button', () => {
    const defaultValues = { name: 'John' }

    render(
      <RootForm defaultValues={defaultValues} onSubmit={mockOnSubmit} resolver={undefined} mode="onSubmit">
        {({ submitForm }) => <button onClick={submitForm}>Submit</button>}
      </RootForm>
    )

    // Use basic DOM queries instead of jest-dom matchers
    const submitButton = screen.getByText('Submit')
    expect(submitButton).toBeTruthy()
    expect(submitButton.tagName).toBe('BUTTON')
  })

  it('should call onSubmit when submit button is clicked', async () => {
    const defaultValues = { name: 'John' }

    render(
      <RootForm defaultValues={defaultValues} onSubmit={mockOnSubmit} resolver={undefined} mode="onSubmit">
        {({ submitForm }) => <button onClick={submitForm}>Submit</button>}
      </RootForm>
    )

    const submitButton = screen.getByText('Submit')
    await userEvent.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith(defaultValues)
  })
})
