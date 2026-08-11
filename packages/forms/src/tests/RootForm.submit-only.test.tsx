import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import { RootForm } from '../core/components/RootForm'

describe('RootForm submit-only validation', () => {
  it('does not revalidate value changes after submit when validateAfterFirstSubmit is false', async () => {
    const resolver = jest.fn(async values => ({ values, errors: {} }))
    const onSubmit = jest.fn()
    const onValuesChange = jest.fn()

    render(
      <RootForm
        defaultValues={{ name: '' }}
        onSubmit={onSubmit}
        onValuesChange={onValuesChange}
        resolver={resolver}
        mode="onSubmit"
        validateAfterFirstSubmit={false}
      >
        {({ setValue, submitForm }) => (
          <div>
            <button onClick={submitForm}>Submit</button>
            <button onClick={() => setValue('name', 'John')}>Set Name</button>
          </div>
        )}
      </RootForm>
    )

    await userEvent.click(screen.getByText('Submit'))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    const validationCountAfterSubmit = resolver.mock.calls.length

    await userEvent.click(screen.getByText('Set Name'))
    await waitFor(() => expect(onValuesChange).toHaveBeenCalledWith({ name: 'John' }))

    expect(resolver).toHaveBeenCalledTimes(validationCountAfterSubmit)
  })
})
