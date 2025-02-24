import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'

import { Accordion } from '../accordion'

describe('Accordion Component', () => {
  test('renders the accordion with trigger and content', () => {
    render(
      <Accordion.Root type="single">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Trigger</Accordion.Trigger>
          <Accordion.Content>Content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    )

    // const accordion = screen.getByText('')

    expect(screen.getByText('Trigger')).toBeInTheDocument()
  })
})
