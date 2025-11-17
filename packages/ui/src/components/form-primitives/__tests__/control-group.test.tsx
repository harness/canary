import type { ReactElement } from 'react'

import { render, screen } from '@testing-library/react'

import { ControlGroup } from '../control-group'

const renderGroup = (ui: ReactElement) => {
  render(ui)
  return screen.getByRole('group')
}

describe('ControlGroup', () => {
  it('applies default configuration for input groups', () => {
    const group = renderGroup(
      <ControlGroup.Root>
        <span>Content</span>
      </ControlGroup.Root>
    )

    expect(group).toHaveClass('cn-control-group')
    expect(group).not.toHaveClass('cn-control-group-horizontal')
    expect(group).toHaveAttribute('aria-label', 'Input control group')
  })

  it('adds horizontal styling when input orientation is horizontal', () => {
    const group = renderGroup(
      <ControlGroup.Root orientation="horizontal">
        <span>Content</span>
      </ControlGroup.Root>
    )

    expect(group).toHaveClass('cn-control-group', 'cn-control-group-horizontal')
  })

  it('does not apply horizontal styling when type is button', () => {
    const group = renderGroup(
      <ControlGroup.Root type="button" orientation="horizontal">
        <span>Content</span>
      </ControlGroup.Root>
    )

    expect(group).toHaveClass('cn-control-group')
    expect(group).not.toHaveClass('cn-control-group-horizontal')
    expect(group).toHaveAttribute('aria-label', 'Button control group')
  })

  it('forwards props through the composite ControlGroup component', () => {
    render(
      <ControlGroup data-testid="composite-group" className="custom" orientation="horizontal">
        <span>Child</span>
      </ControlGroup>
    )

    const group = screen.getByTestId('composite-group')
    expect(group).toHaveClass('cn-control-group', 'cn-control-group-horizontal', 'custom')
    expect(group).toHaveAttribute('aria-label', 'Input control group')
  })

  it('renders label wrapper with base styles', () => {
    render(
      <ControlGroup.LabelWrapper className="extra-class">
        <span>Label</span>
      </ControlGroup.LabelWrapper>
    )

    const element = screen.getByText('Label').parentElement
    expect(element).toHaveClass('cn-control-group-label', 'extra-class')
  })

  it('renders input wrapper with base styles', () => {
    render(
      <ControlGroup.InputWrapper className="extra-class">
        <span>Input</span>
      </ControlGroup.InputWrapper>
    )

    const element = screen.getByText('Input').parentElement
    expect(element).toHaveClass('cn-control-group-input', 'extra-class')
  })
})
