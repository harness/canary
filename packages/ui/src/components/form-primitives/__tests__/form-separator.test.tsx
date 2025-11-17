import { render } from '@testing-library/react'

import { FormSeparator } from '../separator'

describe('FormSeparator', () => {
  it('renders horizontal separator with default styling', () => {
    const { container } = render(<FormSeparator />)

    const separator = container.firstElementChild as HTMLElement
    expect(separator).toHaveClass('border-b')
    expect(separator).toHaveAttribute('role', 'separator')
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it.each([
    [{ dashed: true }, ['border-b', 'border-dashed']],
    [{ dotted: true }, ['border-b', 'border-dotted']],
    [{ dashed: true, dotted: true }, ['border-b', 'border-dotted']]
  ])('applies %o styles', (props, expectedClasses) => {
    const { container } = render(<FormSeparator {...props} className="custom" />)

    const separator = container.firstElementChild as HTMLElement
    expectedClasses.forEach(cls => {
      expect(separator).toHaveClass(cls)
    })
    expect(separator).toHaveClass('custom')
  })
})
