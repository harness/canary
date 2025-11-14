import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { FormCaption } from '../form-caption'

vi.mock('@components/icon-v2', () => ({
  IconV2: ({ name, ...props }: any) => (
    <span data-component="mock-icon" data-name={name} {...props}>
      Icon
    </span>
  )
}))

const expectCaptionClass = (text: string, ...classes: string[]) => {
  const textNode = screen.getByText(text)
  const captionElement = textNode.closest('.cn-caption') ?? textNode
  classes.forEach(cls => expect(captionElement).toHaveClass(cls))
  return captionElement
}

describe('FormCaption', () => {
  it('returns null when no children are provided', () => {
    const { container } = render(<FormCaption>{undefined}</FormCaption>)

    expect(container.firstChild).toBeNull()
  })

  it('renders default theme with provided variant', () => {
    render(
      <FormCaption variant="body-normal" className="custom-class">
        Default theme
      </FormCaption>
    )

    const element = expectCaptionClass('Default theme', 'cn-caption', 'custom-class', 'font-body-normal', 'text-cn-3')
    expect(element.querySelector('[data-component="mock-icon"]')).toBeNull()
  })

  it.each([
    ['danger', 'xmark-circle', 'text-cn-danger'],
    ['warning', 'warning-triangle', 'text-cn-warning']
  ] as const)('renders %s theme with icon', (theme, iconName, expectedColorClass) => {
    render(<FormCaption theme={theme}>With icon</FormCaption>)

    expectCaptionClass('With icon', 'cn-caption', expectedColorClass)
    const icon = screen.getByText('Icon')
    expect(icon).toHaveAttribute('data-name', iconName)
  })

  it('applies success theme without icon', () => {
    render(<FormCaption theme="success">Success</FormCaption>)

    expectCaptionClass('Success', 'cn-caption', 'text-cn-success')
    expect(screen.queryByText('Icon')).not.toBeInTheDocument()
  })

  it('sets disabled state when requested', () => {
    render(
      <FormCaption theme="danger" disabled>
        Disabled caption
      </FormCaption>
    )

    expectCaptionClass('Disabled caption', 'cn-caption', 'text-cn-danger', 'opacity-cn-disabled')
  })
})
