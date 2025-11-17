import { render, screen } from '@testing-library/react'

import { Fieldset } from '../fieldset'

describe('Fieldset', () => {
  it('renders fieldset with required accessibility attributes', () => {
    render(
      <Fieldset data-testid="fieldset">
        <div>Child</div>
      </Fieldset>
    )

    const element = screen.getByTestId('fieldset')
    expect(element.tagName.toLowerCase()).toBe('fieldset')
    expect(element).toHaveClass('flex', 'flex-col', 'gap-y-cn-xl')
    expect(element).toHaveAttribute('role', 'group')
    expect(element).toHaveAttribute('aria-describedby', 'fieldset-description')
  })

  it('applies custom classes and props', () => {
    render(
      <Fieldset data-testid="custom-fieldset" className="extra">
        <div />
      </Fieldset>
    )

    const element = screen.getByTestId('custom-fieldset')
    expect(element).toHaveClass('flex', 'flex-col', 'gap-y-cn-xl', 'extra')
  })
})
