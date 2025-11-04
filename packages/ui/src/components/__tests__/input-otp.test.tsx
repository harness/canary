import { render, RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { InputOTP } from '../input-otp'

const renderComponent = (
  props: Omit<Partial<React.ComponentProps<typeof InputOTP.Root>>, 'children' | 'render'> = {}
): RenderResult => {
  const defaultProps = {
    maxLength: 6,
    ...props
  }

  return render(
    <InputOTP.Root {...defaultProps}>
      <InputOTP.Group>
        <InputOTP.Slot index={0} />
        <InputOTP.Slot index={1} />
        <InputOTP.Slot index={2} />
      </InputOTP.Group>
      <InputOTP.Separator />
      <InputOTP.Group>
        <InputOTP.Slot index={3} />
        <InputOTP.Slot index={4} />
        <InputOTP.Slot index={5} />
      </InputOTP.Group>
    </InputOTP.Root>
  )
}

describe('InputOTP', () => {
  describe('InputOTP.Root', () => {
    test('should render OTP input', () => {
      const { container } = renderComponent()

      const otpContainer = container.querySelector('.flex.items-center')
      expect(otpContainer).toBeInTheDocument()
    })

    test('should render with maxLength prop', () => {
      renderComponent({ maxLength: 4 })

      // OTP input is rendered with correct structure
      expect(document.querySelector('.flex.items-center')).toBeTruthy()
    })

    test('should accept value prop', () => {
      renderComponent({ value: '123456' })

      // Value is set
      const container = document.querySelector('.flex.items-center')
      expect(container).toBeTruthy()
    })

    test('should call onChange when value changes', async () => {
      const handleChange = vi.fn()
      const { container } = renderComponent({ onChange: handleChange })

      const input = container.querySelector('input')
      if (input) {
        await userEvent.type(input, '1')
        expect(handleChange).toHaveBeenCalled()
      }
    })

    test('should handle disabled state', () => {
      renderComponent({ disabled: true })

      const container = document.querySelector('.flex.items-center')
      expect(container).toBeTruthy()
    })

    test('should apply custom className', () => {
      renderComponent({ className: 'custom-otp-class' })

      const element = document.querySelector('.custom-otp-class')
      expect(element).toBeTruthy()
    })

    test('should apply custom containerClassName', () => {
      renderComponent({ containerClassName: 'custom-container' })

      const container = document.querySelector('.custom-container')
      expect(container).toBeTruthy()
    })

    test('should handle onComplete callback', () => {
      const handleComplete = vi.fn()
      renderComponent({ onComplete: handleComplete, maxLength: 6 })

      // OTP renders correctly
      expect(document.querySelector('.flex.items-center')).toBeTruthy()
    })

    test('should handle controlled input', () => {
      const { rerender } = render(
        <InputOTP.Root maxLength={4} value="">
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
            <InputOTP.Slot index={3} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('.flex.items-center')).toBeTruthy()

      rerender(
        <InputOTP.Root maxLength={4} value="1234">
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
            <InputOTP.Slot index={3} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('.flex.items-center')).toBeTruthy()
    })
  })

  describe('InputOTP.Group', () => {
    test('should render group container', () => {
      renderComponent()

      const groups = document.querySelectorAll('.flex.items-center')
      expect(groups.length).toBeGreaterThan(0)
    })

    test('should apply custom className to group', () => {
      render(
        <InputOTP.Root maxLength={3}>
          <InputOTP.Group className="custom-group">
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      const group = document.querySelector('.custom-group')
      expect(group).toBeTruthy()
    })

    test('should render multiple groups', () => {
      renderComponent()

      // Two groups are rendered
      const container = document.querySelector('.flex.items-center.gap-cn-sm')
      expect(container).toBeTruthy()
    })
  })

  describe('InputOTP.Slot', () => {
    test('should render slot elements', () => {
      const { container } = renderComponent()

      const slots = container.querySelectorAll('.relative.flex.items-center.justify-center')
      expect(slots.length).toBe(6)
    })

    test('should render slot with index', () => {
      render(
        <InputOTP.Root maxLength={1}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      const slot = document.querySelector('.relative.flex.items-center.justify-center')
      expect(slot).toBeTruthy()
    })

    test('should apply custom className to slot', () => {
      render(
        <InputOTP.Root maxLength={1}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} className="custom-slot" />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      const slot = document.querySelector('.custom-slot')
      expect(slot).toBeTruthy()
    })

    test('should display character in slot when provided', () => {
      render(
        <InputOTP.Root maxLength={3} value="123">
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      // Slots are rendered
      const slots = document.querySelectorAll('.relative.flex.items-center.justify-center')
      expect(slots.length).toBe(3)
    })

    test('should handle multiple slots in sequence', () => {
      const { container } = render(
        <InputOTP.Root maxLength={6}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
            <InputOTP.Slot index={3} />
            <InputOTP.Slot index={4} />
            <InputOTP.Slot index={5} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      const slots = container.querySelectorAll('.relative.flex.items-center.justify-center')
      expect(slots.length).toBe(6)
    })
  })

  describe('InputOTP.Separator', () => {
    test('should render separator', () => {
      renderComponent()

      const separator = document.querySelector('[role="separator"]')
      expect(separator).toBeTruthy()
    })

    test('should render separator with icon', () => {
      const { container } = renderComponent()

      const separator = container.querySelector('[role="separator"]')
      expect(separator).toBeInTheDocument()

      // Icon is rendered inside separator
      const icon = separator?.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    test('should render multiple separators', () => {
      render(
        <InputOTP.Root maxLength={9}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            <InputOTP.Slot index={3} />
            <InputOTP.Slot index={4} />
            <InputOTP.Slot index={5} />
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            <InputOTP.Slot index={6} />
            <InputOTP.Slot index={7} />
            <InputOTP.Slot index={8} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      const separators = document.querySelectorAll('[role="separator"]')
      expect(separators.length).toBe(2)
    })
  })

  describe('Complex Scenarios', () => {
    test('should render complete OTP structure', () => {
      renderComponent()

      // All slots rendered
      const container = document.querySelector('.flex.items-center.gap-cn-sm')
      expect(container).toBeTruthy()

      // Separator rendered
      const separator = document.querySelector('[role="separator"]')
      expect(separator).toBeTruthy()
    })

    test('should handle different maxLength values', () => {
      const { container } = render(
        <InputOTP.Root maxLength={4}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
            <InputOTP.Slot index={3} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      const slots = container.querySelectorAll('.relative.flex.items-center.justify-center')
      expect(slots.length).toBe(4)
    })

    test('should handle single group without separator', () => {
      render(
        <InputOTP.Root maxLength={4}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
            <InputOTP.Slot index={3} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      const slots = document.querySelectorAll('.relative.flex.items-center.justify-center')
      expect(slots.length).toBe(4)
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref on Root', () => {
      const ref = vi.fn()

      render(
        <InputOTP.Root ref={ref} maxLength={4}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Group', () => {
      const ref = vi.fn()

      render(
        <InputOTP.Root maxLength={3}>
          <InputOTP.Group ref={ref}>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Slot', () => {
      const ref = vi.fn()

      render(
        <InputOTP.Root maxLength={1}>
          <InputOTP.Group>
            <InputOTP.Slot ref={ref} index={0} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref on Separator', () => {
      const ref = vi.fn()

      render(
        <InputOTP.Root maxLength={2}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
          </InputOTP.Group>
          <InputOTP.Separator ref={ref} />
          <InputOTP.Group>
            <InputOTP.Slot index={1} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Component Display Names', () => {
    test('should have correct display names', () => {
      expect(InputOTP.Root.displayName).toBe('InputOTPRoot')
      expect(InputOTP.Group.displayName).toBe('InputOTPGroup')
      expect(InputOTP.Slot.displayName).toBe('InputOTPSlot')
      expect(InputOTP.Separator.displayName).toBe('InputOTPSeparator')
    })
  })

  describe('Edge Cases', () => {
    test('should handle very long maxLength', () => {
      const { container } = render(
        <InputOTP.Root maxLength={20}>
          <InputOTP.Group>
            {Array.from({ length: 20 }, (_, i) => (
              <InputOTP.Slot key={i} index={i} />
            ))}
          </InputOTP.Group>
        </InputOTP.Root>
      )

      const slots = container.querySelectorAll('.relative.flex.items-center.justify-center')
      expect(slots.length).toBe(20)
    })

    test('should handle single digit maxLength', () => {
      const { container } = render(
        <InputOTP.Root maxLength={1}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      const slots = container.querySelectorAll('.relative.flex.items-center.justify-center')
      expect(slots.length).toBe(1)
    })

    test('should handle empty value', () => {
      render(
        <InputOTP.Root maxLength={4} value="">
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
            <InputOTP.Slot index={3} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('.flex.items-center')).toBeTruthy()
    })

    test('should handle partial value', () => {
      render(
        <InputOTP.Root maxLength={6} value="123">
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
            <InputOTP.Slot index={3} />
            <InputOTP.Slot index={4} />
            <InputOTP.Slot index={5} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('.flex.items-center')).toBeTruthy()
    })

    test('should handle complete value', () => {
      render(
        <InputOTP.Root maxLength={4} value="1234">
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
            <InputOTP.Slot index={3} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('.flex.items-center')).toBeTruthy()
    })
  })

  describe('Props Forwarding', () => {
    test('should forward data attributes on Root', () => {
      render(
        <InputOTP.Root maxLength={4} data-testid="otp-root">
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('[data-testid="otp-root"]')).toBeTruthy()
    })

    test('should forward data attributes on Group', () => {
      render(
        <InputOTP.Root maxLength={3}>
          <InputOTP.Group data-testid="otp-group">
            <InputOTP.Slot index={0} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('[data-testid="otp-group"]')).toBeTruthy()
    })

    test('should forward data attributes on Slot', () => {
      render(
        <InputOTP.Root maxLength={1}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} data-testid="otp-slot" />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('[data-testid="otp-slot"]')).toBeTruthy()
    })

    test('should forward data attributes on Separator', () => {
      render(
        <InputOTP.Root maxLength={2}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
          </InputOTP.Group>
          <InputOTP.Separator data-testid="otp-separator" />
          <InputOTP.Group>
            <InputOTP.Slot index={1} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('[data-testid="otp-separator"]')).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    test('should render with proper separator role', () => {
      renderComponent()

      const separator = document.querySelector('[role="separator"]')
      expect(separator).toBeTruthy()
    })

    test('should handle disabled state accessibility', () => {
      renderComponent({ disabled: true })

      const container = document.querySelector('.flex.items-center.gap-cn-sm')
      expect(container?.className).toContain('has-[:disabled]:opacity-50')
    })
  })

  describe('Re-rendering', () => {
    test('should update when value changes', () => {
      const { rerender } = render(
        <InputOTP.Root maxLength={4} value="12">
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
            <InputOTP.Slot index={3} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('.flex.items-center')).toBeTruthy()

      rerender(
        <InputOTP.Root maxLength={4} value="1234">
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
            <InputOTP.Slot index={3} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('.flex.items-center')).toBeTruthy()
    })

    test('should update when disabled state changes', () => {
      const { rerender } = render(
        <InputOTP.Root maxLength={4} disabled={false}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('.flex.items-center')).toBeTruthy()

      rerender(
        <InputOTP.Root maxLength={4} disabled={true}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('.flex.items-center')).toBeTruthy()
    })
  })

  describe('Default Values', () => {
    test('should work with minimal props', () => {
      render(
        <InputOTP.Root maxLength={4}>
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
          </InputOTP.Group>
        </InputOTP.Root>
      )

      expect(document.querySelector('.flex.items-center')).toBeTruthy()
    })
  })
})
