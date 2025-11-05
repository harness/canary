import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { CardSelect } from '../card-select'

const renderComponent = (component: React.ReactElement) => {
  return render(component)
}

describe('CardSelect', () => {
  describe('CardSelect.Root', () => {
    describe('Basic Rendering', () => {
      test('should render card select root element', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('.cn-card-select-root')
        expect(root).toBeInTheDocument()
      })

      test('should render children', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      test('should have radiogroup role for single type', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('[role="radiogroup"]')
        expect(root).toBeInTheDocument()
      })

      test('should have group role for multiple type', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="multiple">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('[role="group"]')
        expect(root).toBeInTheDocument()
      })
    })

    describe('Layout Variants', () => {
      test('should apply vertical layout by default', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('.cn-card-select-vertical')
        expect(root).toBeInTheDocument()
      })

      test('should apply horizontal layout', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single" layout="horizontal">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('.cn-card-select-horizontal')
        expect(root).toBeInTheDocument()
      })

      test('should apply grid layout', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single" layout="grid">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('.cn-card-select-grid')
        expect(root).toBeInTheDocument()
      })
    })

    describe('Gap Variants', () => {
      test('should apply medium gap by default', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('.gap-cn-md')
        expect(root).toBeInTheDocument()
      })

      test('should apply xs gap', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single" gap="xs">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('.gap-cn-xs')
        expect(root).toBeInTheDocument()
      })

      test('should apply sm gap', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single" gap="sm">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('.gap-cn-sm')
        expect(root).toBeInTheDocument()
      })

      test('should apply lg gap', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single" gap="lg">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('.gap-cn-lg')
        expect(root).toBeInTheDocument()
      })
    })

    describe('Grid Layout Customization', () => {
      test('should apply custom cols', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single" layout="grid" cols={3}>
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('.cn-card-select-root') as HTMLElement
        expect(root.style.getPropertyValue('--cols')).toBe('3')
      })

      test('should apply custom rows', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single" layout="grid" rows={2}>
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('.cn-card-select-root') as HTMLElement
        expect(root.style.getPropertyValue('--rows')).toBe('2')
      })

      test('should apply both cols and rows', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single" layout="grid" cols={3} rows={2}>
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('.cn-card-select-root') as HTMLElement
        expect(root.style.getPropertyValue('--cols')).toBe('3')
        expect(root.style.getPropertyValue('--rows')).toBe('2')
      })
    })

    describe('Single Selection', () => {
      test('should handle uncontrolled single selection', async () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
            <CardSelect.Item value="option2">Option 2</CardSelect.Item>
          </CardSelect.Root>
        )

        const option1 = screen.getByRole('radio', { name: /option 1/i })
        await userEvent.click(option1)

        expect(option1).toHaveAttribute('aria-checked', 'true')
      })

      test('should handle controlled single selection', async () => {
        const onValueChange = vi.fn()
        renderComponent(
          <CardSelect.Root type="single" value="option1" onValueChange={onValueChange}>
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
            <CardSelect.Item value="option2">Option 2</CardSelect.Item>
          </CardSelect.Root>
        )

        const option2 = screen.getByRole('radio', { name: /option 2/i })
        await userEvent.click(option2)

        expect(onValueChange).toHaveBeenCalledWith('option2')
      })

      test('should use defaultValue for initial selection', () => {
        renderComponent(
          <CardSelect.Root type="single" defaultValue="option2">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
            <CardSelect.Item value="option2">Option 2</CardSelect.Item>
          </CardSelect.Root>
        )

        const option2 = screen.getByRole('radio', { name: /option 2/i })
        expect(option2).toHaveAttribute('aria-checked', 'true')
      })

      test('should only allow one selection', async () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
            <CardSelect.Item value="option2">Option 2</CardSelect.Item>
          </CardSelect.Root>
        )

        const option1 = screen.getByRole('radio', { name: /option 1/i })
        const option2 = screen.getByRole('radio', { name: /option 2/i })

        await userEvent.click(option1)
        expect(option1).toHaveAttribute('aria-checked', 'true')

        await userEvent.click(option2)
        expect(option2).toHaveAttribute('aria-checked', 'true')
        expect(option1).toHaveAttribute('aria-checked', 'false')
      })
    })

    describe('Multiple Selection', () => {
      test('should handle uncontrolled multiple selection', async () => {
        renderComponent(
          <CardSelect.Root type="multiple">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
            <CardSelect.Item value="option2">Option 2</CardSelect.Item>
          </CardSelect.Root>
        )

        const option1 = screen.getByRole('checkbox', { name: /option 1/i })
        await userEvent.click(option1)

        expect(option1).toHaveAttribute('aria-checked', 'true')
      })

      test('should handle controlled multiple selection', async () => {
        const onValueChange = vi.fn()
        renderComponent(
          <CardSelect.Root type="multiple" value={['option1']} onValueChange={onValueChange}>
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
            <CardSelect.Item value="option2">Option 2</CardSelect.Item>
          </CardSelect.Root>
        )

        const option2 = screen.getByRole('checkbox', { name: /option 2/i })
        await userEvent.click(option2)

        expect(onValueChange).toHaveBeenCalledWith(['option1', 'option2'])
      })

      test('should allow multiple selections', async () => {
        renderComponent(
          <CardSelect.Root type="multiple">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
            <CardSelect.Item value="option2">Option 2</CardSelect.Item>
            <CardSelect.Item value="option3">Option 3</CardSelect.Item>
          </CardSelect.Root>
        )

        const option1 = screen.getByRole('checkbox', { name: /option 1/i })
        const option2 = screen.getByRole('checkbox', { name: /option 2/i })
        const option3 = screen.getByRole('checkbox', { name: /option 3/i })

        await userEvent.click(option1)
        await userEvent.click(option2)
        await userEvent.click(option3)

        expect(option1).toHaveAttribute('aria-checked', 'true')
        expect(option2).toHaveAttribute('aria-checked', 'true')
        expect(option3).toHaveAttribute('aria-checked', 'true')
      })

      test('should toggle selection on multiple clicks', async () => {
        renderComponent(
          <CardSelect.Root type="multiple">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const option1 = screen.getByRole('checkbox', { name: /option 1/i })

        await userEvent.click(option1)
        expect(option1).toHaveAttribute('aria-checked', 'true')

        await userEvent.click(option1)
        expect(option1).toHaveAttribute('aria-checked', 'false')
      })

      test('should use defaultValue for initial multiple selection', () => {
        renderComponent(
          <CardSelect.Root type="multiple" defaultValue={['option1', 'option3']}>
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
            <CardSelect.Item value="option2">Option 2</CardSelect.Item>
            <CardSelect.Item value="option3">Option 3</CardSelect.Item>
          </CardSelect.Root>
        )

        const option1 = screen.getByRole('checkbox', { name: /option 1/i })
        const option2 = screen.getByRole('checkbox', { name: /option 2/i })
        const option3 = screen.getByRole('checkbox', { name: /option 3/i })

        expect(option1).toHaveAttribute('aria-checked', 'true')
        expect(option2).toHaveAttribute('aria-checked', 'false')
        expect(option3).toHaveAttribute('aria-checked', 'true')
      })

      test('should handle multiple type with non-array initial value', async () => {
        renderComponent(
          <CardSelect.Root type="multiple">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const option1 = screen.getByRole('checkbox', { name: /option 1/i })
        await userEvent.click(option1)

        expect(option1).toHaveAttribute('aria-checked', 'true')
      })
    })

    describe('Disabled State', () => {
      test('should disable all items when root is disabled', async () => {
        renderComponent(
          <CardSelect.Root type="single" disabled>
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
            <CardSelect.Item value="option2">Option 2</CardSelect.Item>
          </CardSelect.Root>
        )

        const option1 = screen.getByRole('radio', { name: /option 1/i })
        await userEvent.click(option1)

        expect(option1).toHaveAttribute('aria-checked', 'false')
      })

      test('should not call onValueChange when disabled', async () => {
        const onValueChange = vi.fn()
        renderComponent(
          <CardSelect.Root type="single" disabled onValueChange={onValueChange}>
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const option1 = screen.getByRole('radio', { name: /option 1/i })
        await userEvent.click(option1)

        expect(onValueChange).not.toHaveBeenCalled()
      })

      test('should prevent value changes when root disabled in controlled mode', async () => {
        const onValueChange = vi.fn()
        const { container } = renderComponent(
          <CardSelect.Root type="single" disabled value="option1" onValueChange={onValueChange}>
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
            <CardSelect.Item value="option2">Option 2</CardSelect.Item>
          </CardSelect.Root>
        )

        // Try clicking through hidden input (direct onChange trigger)
        const input = container.querySelector('input[value="option2"]') as HTMLInputElement
        if (input) {
          fireEvent.click(input)
        }

        expect(onValueChange).not.toHaveBeenCalled()
      })

      test('should prevent multiple selection changes when disabled', async () => {
        const onValueChange = vi.fn()
        renderComponent(
          <CardSelect.Root type="multiple" disabled onValueChange={onValueChange}>
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
            <CardSelect.Item value="option2">Option 2</CardSelect.Item>
          </CardSelect.Root>
        )

        const option1 = screen.getByRole('checkbox', { name: /option 1/i })
        await userEvent.click(option1)

        expect(onValueChange).not.toHaveBeenCalled()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single" className="custom-card-select">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('.custom-card-select')
        expect(root).toBeInTheDocument()
      })

      test('should combine custom className with variant classes', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single" className="custom-class" layout="horizontal" gap="lg">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const root = container.querySelector('.custom-class.cn-card-select-horizontal.gap-cn-lg')
        expect(root).toBeInTheDocument()
      })
    })

    describe('Name Generation', () => {
      test('should generate unique name when not provided', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const input = container.querySelector('input')
        const name = input?.getAttribute('name')
        expect(name).toMatch(/^card-select-/)
      })

      test('should use provided name', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single" name="custom-name">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const input = container.querySelector('input')
        expect(input).toHaveAttribute('name', 'custom-name')
      })
    })
  })

  describe('CardSelect.Item', () => {
    describe('Basic Rendering', () => {
      test('should render card select item', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      test('should apply cn-card-select-item class', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const item = container.querySelector('.cn-card-select-item')
        expect(item).toBeInTheDocument()
      })

      test('should render as label element', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const label = container.querySelector('label')
        expect(label).toBeInTheDocument()
      })

      test('should forward ref to label element', () => {
        const ref = React.createRef<HTMLLabelElement>()
        render(
          <CardSelect.Root type="single">
            <CardSelect.Item ref={ref} value="option1">
              Option 1
            </CardSelect.Item>
          </CardSelect.Root>
        )

        expect(ref.current).toBeInstanceOf(HTMLLabelElement)
      })

      test('should have correct display name', () => {
        expect(CardSelect.Item.displayName).toBe('CardSelectItem')
      })
    })

    describe('Radio Role for Single Type', () => {
      test('should have radio role', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const item = container.querySelector('[role="radio"]')
        expect(item).toBeInTheDocument()
      })

      test('should render radio input', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const input = container.querySelector('input[type="radio"]')
        expect(input).toBeInTheDocument()
      })
    })

    describe('Checkbox Role for Multiple Type', () => {
      test('should have checkbox role', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="multiple">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const item = container.querySelector('[role="checkbox"]')
        expect(item).toBeInTheDocument()
      })

      test('should render checkbox input', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="multiple">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const input = container.querySelector('input[type="checkbox"]')
        expect(input).toBeInTheDocument()
      })
    })

    describe('Checked State', () => {
      test('should not be checked by default', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        expect(option).toHaveAttribute('aria-checked', 'false')
      })

      test('should show check icon when selected', async () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        await userEvent.click(option)

        const checkIcon = container.querySelector('.cn-card-select-check')
        expect(checkIcon).toBeInTheDocument()
      })

      test('should apply checked data state', async () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        await userEvent.click(option)

        expect(option).toHaveAttribute('data-state', 'checked')
      })
    })

    describe('Disabled State', () => {
      test('should handle item-level disabled', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1" disabled>
              Option 1
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        expect(option).toHaveAttribute('aria-disabled', 'true')
      })

      test('should apply disabled data attribute', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1" disabled>
              Option 1
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        expect(option).toHaveAttribute('data-disabled', '')
      })

      test('should set tabIndex to -1 when disabled', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1" disabled>
              Option 1
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        expect(option).toHaveAttribute('tabIndex', '-1')
      })

      test('should not respond to clicks when disabled', async () => {
        const onValueChange = vi.fn()
        renderComponent(
          <CardSelect.Root type="single" onValueChange={onValueChange}>
            <CardSelect.Item value="option1" disabled>
              Option 1
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        await userEvent.click(option)

        expect(option).toHaveAttribute('aria-checked', 'false')
        expect(onValueChange).not.toHaveBeenCalled()
      })

      test('should inherit disabled from root', () => {
        renderComponent(
          <CardSelect.Root type="single" disabled>
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        expect(option).toHaveAttribute('aria-disabled', 'true')
      })
    })

    describe('Icon Support', () => {
      test('should render icon when provided', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1" icon="xmark">
              Option 1
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const icon = container.querySelector('.cn-card-select-icon')
        expect(icon).toBeInTheDocument()
      })

      test('should render content with icon', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1" icon="xmark">
              Option 1
            </CardSelect.Item>
          </CardSelect.Root>
        )

        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })
    })

    describe('Logo Support', () => {
      test('should render logo when provided', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1" logo="harness">
              Option 1
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const logo = container.querySelector('.cn-card-select-logo')
        expect(logo).toBeInTheDocument()
      })

      test('should not render logo when icon is also provided', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1" icon="xmark" logo="harness">
              Option 1
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const logo = container.querySelector('.cn-card-select-logo')
        expect(logo).not.toBeInTheDocument()
      })
    })

    describe('Keyboard Navigation', () => {
      test('should select on Space key', async () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        option.focus()
        fireEvent.keyDown(option, { key: ' ' })

        expect(option).toHaveAttribute('aria-checked', 'true')
      })

      test('should select on Enter key', async () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        option.focus()
        fireEvent.keyDown(option, { key: 'Enter' })

        expect(option).toHaveAttribute('aria-checked', 'true')
      })

      test('should prevent default on Space key', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true })
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
        option.dispatchEvent(event)

        expect(preventDefaultSpy).toHaveBeenCalled()
      })

      test('should prevent default on Enter key', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
        option.dispatchEvent(event)

        expect(preventDefaultSpy).toHaveBeenCalled()
      })

      test('should not select on Space when disabled', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1" disabled>
              Option 1
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        fireEvent.keyDown(option, { key: ' ' })

        expect(option).toHaveAttribute('aria-checked', 'false')
      })

      test('should not select on Enter when disabled', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1" disabled>
              Option 1
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        fireEvent.keyDown(option, { key: 'Enter' })

        expect(option).toHaveAttribute('aria-checked', 'false')
      })

      test('should not prevent default on other keys', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
        option.dispatchEvent(event)

        expect(preventDefaultSpy).not.toHaveBeenCalled()
      })

      test('should be keyboard accessible with tabIndex 0', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const option = screen.getByRole('radio', { name: /option 1/i })
        expect(option).toHaveAttribute('tabIndex', '0')
      })
    })

    describe('Hidden Input', () => {
      test('should render hidden input with aria-hidden', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const input = container.querySelector('.cn-card-select-hidden-input')
        expect(input).toHaveAttribute('aria-hidden', 'true')
      })

      test('should set input tabIndex to -1', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const input = container.querySelector('input')
        expect(input).toHaveAttribute('tabIndex', '-1')
      })

      test('should set input value', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="test-value">Option 1</CardSelect.Item>
          </CardSelect.Root>
        )

        const input = container.querySelector('input')
        expect(input).toHaveAttribute('value', 'test-value')
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className to item', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1" className="custom-item">
              Option 1
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const item = container.querySelector('.custom-item')
        expect(item).toBeInTheDocument()
      })
    })

    describe('Error Handling', () => {
      test('should throw error when used outside CardSelect.Root', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(() => {
          render(<CardSelect.Item value="option1">Option 1</CardSelect.Item>)
        }).toThrow('CardSelect.Item must be used within CardSelect.Root')

        consoleError.mockRestore()
      })
    })
  })

  describe('CardSelect.Title', () => {
    describe('Basic Rendering', () => {
      test('should render title element', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">
              <CardSelect.Title>Title</CardSelect.Title>
            </CardSelect.Item>
          </CardSelect.Root>
        )

        expect(screen.getByText('Title')).toBeInTheDocument()
      })

      test('should apply cn-card-select-title class', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">
              <CardSelect.Title>Title</CardSelect.Title>
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const title = container.querySelector('.cn-card-select-title')
        expect(title).toBeInTheDocument()
      })

      test('should forward ref to div element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(<CardSelect.Title ref={ref}>Title</CardSelect.Title>)

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })

      test('should have correct display name', () => {
        expect(CardSelect.Title.displayName).toBe('CardSelectTitle')
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">
              <CardSelect.Title className="custom-title">Title</CardSelect.Title>
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const title = container.querySelector('.custom-title')
        expect(title).toBeInTheDocument()
      })
    })
  })

  describe('CardSelect.Description', () => {
    describe('Basic Rendering', () => {
      test('should render description element', () => {
        renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">
              <CardSelect.Description>Description</CardSelect.Description>
            </CardSelect.Item>
          </CardSelect.Root>
        )

        expect(screen.getByText('Description')).toBeInTheDocument()
      })

      test('should apply cn-card-select-description class', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">
              <CardSelect.Description>Description</CardSelect.Description>
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const description = container.querySelector('.cn-card-select-description')
        expect(description).toBeInTheDocument()
      })

      test('should forward ref to div element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(<CardSelect.Description ref={ref}>Description</CardSelect.Description>)

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })

      test('should have correct display name', () => {
        expect(CardSelect.Description.displayName).toBe('CardSelectDescription')
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <CardSelect.Root type="single">
            <CardSelect.Item value="option1">
              <CardSelect.Description className="custom-description">Description</CardSelect.Description>
            </CardSelect.Item>
          </CardSelect.Root>
        )

        const description = container.querySelector('.custom-description')
        expect(description).toBeInTheDocument()
      })
    })
  })

  describe('CardSelect Namespace', () => {
    test('should export all subcomponents', () => {
      expect(CardSelect.Root).toBeDefined()
      expect(CardSelect.Item).toBeDefined()
      expect(CardSelect.Title).toBeDefined()
      expect(CardSelect.Description).toBeDefined()
    })
  })

  describe('Complete CardSelect', () => {
    test('should render complete card select with all components', () => {
      renderComponent(
        <CardSelect.Root type="single" layout="grid" cols={2}>
          <CardSelect.Item value="option1" icon="xmark">
            <CardSelect.Title>Option 1</CardSelect.Title>
            <CardSelect.Description>Description 1</CardSelect.Description>
          </CardSelect.Item>
          <CardSelect.Item value="option2" logo="harness">
            <CardSelect.Title>Option 2</CardSelect.Title>
            <CardSelect.Description>Description 2</CardSelect.Description>
          </CardSelect.Item>
        </CardSelect.Root>
      )

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Description 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Description 2')).toBeInTheDocument()
    })
  })
})
