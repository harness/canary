import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { IconWithTooltip } from './icon-with-tooltip'
import { TooltipProvider } from './tooltip'

describe('IconWithTooltip', () => {
  test.each(['click', 'Enter', 'Space'])('does not submit its parent form on %s', async activation => {
    const onSubmit = vi.fn(event => event.preventDefault())

    render(
      <TooltipProvider>
        <form onSubmit={onSubmit}>
          <IconWithTooltip content="Help text" delay={0} />
          <button type="submit">Submit</button>
        </form>
      </TooltipProvider>
    )

    const trigger = screen.getAllByRole('button')[0]
    if (activation === 'click') {
      userEvent.click(trigger)
    } else {
      userEvent.tab()
      expect(trigger).toHaveFocus()
      expect(await screen.findByRole('tooltip')).toHaveTextContent('Help text')
      userEvent.keyboard(activation === 'Enter' ? '{Enter}' : ' ')
    }

    expect(onSubmit).not.toHaveBeenCalled()

    userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
