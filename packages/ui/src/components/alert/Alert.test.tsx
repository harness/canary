import { render, screen } from '@testing-library/react'

import { Alert } from './'

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('Alert', () => {
  test('it should display the alert title and description', async () => {
    const title = 'TEST TITLE'
    const description = 'TEST DESCRIPTION'

    render(
      <Alert.Root>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>
          <p>{description}</p>
        </Alert.Description>
      </Alert.Root>
    )

    expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument()
    expect(await screen.findByText(description)).toBeInTheDocument()
  })
})
