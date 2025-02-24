/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentProps } from 'react'

import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Accordion } from '../accordion'

const renderComponent = (props: Partial<ComponentProps<typeof Accordion.Root>> = {}): RenderResult =>
  render(
    <Accordion.Root type="single" {...(props as any)}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Trigger 1</Accordion.Trigger>
        <Accordion.Content>Content 1</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Trigger 2</Accordion.Trigger>
        <Accordion.Content>Content 2</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )

describe('Accordion', () => {
  test('it should render trigger with content initially hidden', async () => {
    renderComponent()

    expect(await screen.findByRole('button', { name: 'Trigger 1' })).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Content 1' })).not.toBeInTheDocument()
  })

  test('it should show the content when the trigger is clicked', async () => {
    renderComponent()

    expect(screen.queryByText('Content')).not.toBeInTheDocument()

    userEvent.click(await screen.findByRole('button', { name: 'Trigger 1' }))

    expect(await screen.findByText('Content 1')).toBeInTheDocument()
  })

  test('it should toggle the content when collapsible is set', async () => {
    renderComponent({ collapsible: true })

    const trigger = await screen.findByRole('button', { name: 'Trigger 1' })

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()

    userEvent.click(trigger)
    expect(await screen.findByText('Content 1')).toBeInTheDocument()

    userEvent.click(trigger)
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
  })

  test('it should not toggle the content when collapsible is not set', async () => {
    renderComponent({ collapsible: false })

    const trigger = await screen.findByRole('button', { name: 'Trigger 1' })

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()

    userEvent.click(trigger)
    expect(await screen.findByText('Content 1')).toBeInTheDocument()

    userEvent.click(trigger)
    expect(await screen.findByText('Content 1')).toBeInTheDocument()
  })

  test('it should allow multiple items to be open when type is multiple', async () => {
    renderComponent({ type: 'multiple' })

    const trigger1 = await screen.findByRole('button', { name: 'Trigger 1' })
    const trigger2 = await screen.findByRole('button', { name: 'Trigger 2' })

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()

    userEvent.click(trigger1)
    expect(await screen.findByText('Content 1')).toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()

    userEvent.click(trigger2)
    expect(await screen.findByText('Content 2')).toBeInTheDocument()
    expect(await screen.findByText('Content 1')).toBeInTheDocument()
  })

  test('it should not allow multiple items to be open when type is single', async () => {
    renderComponent({ type: 'single' })

    const trigger1 = await screen.findByRole('button', { name: 'Trigger 1' })
    const trigger2 = await screen.findByRole('button', { name: 'Trigger 2' })

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()

    userEvent.click(trigger1)
    expect(await screen.findByText('Content 1')).toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()

    userEvent.click(trigger2)
    expect(await screen.findByText('Content 2')).toBeInTheDocument()
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
  })
})
