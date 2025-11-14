import { render, screen } from '@testing-library/react'

import { MessageTheme } from '../form-primitives.types'
import { Message } from '../message'

describe('Message', () => {
  it.each([
    { theme: MessageTheme.SUCCESS, expectedClass: 'text-cn-success', role: 'status', ariaLive: 'polite' },
    { theme: MessageTheme.WARNING, expectedClass: 'text-cn-warning', role: 'status', ariaLive: 'polite' },
    { theme: MessageTheme.ERROR, expectedClass: 'text-cn-danger', role: 'alert', ariaLive: 'assertive' },
    { theme: MessageTheme.DEFAULT, expectedClass: 'text-cn-3', role: 'status', ariaLive: 'polite' }
  ])('renders %s message with correct semantics', ({ theme, expectedClass, role, ariaLive }) => {
    const messageText = `Content ${theme}`

    render(
      <Message theme={theme} className="custom">
        {messageText}
      </Message>
    )

    const text = screen.getByText(messageText)
    const element = text.parentElement as HTMLElement
    expect(element).not.toBeNull()
    expect(element).toHaveClass(expectedClass, 'custom')
    expect(element).toHaveAttribute('role', role)
    expect(element).toHaveAttribute('aria-live', ariaLive)
  })
})
