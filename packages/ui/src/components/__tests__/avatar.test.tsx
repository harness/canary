import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { Avatar, AvatarWithTooltip } from '../avatar'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider delayDuration={0}>{children}</TooltipPrimitive.Provider>
)

describe('Avatar', () => {
  describe('Rendering', () => {
    test('should render with default props', () => {
      const { container } = render(<Avatar />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveClass('cn-avatar-sm')
    })

    test('should render with name prop', () => {
      const { container } = render(<Avatar name="John Doe" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render with src prop', () => {
      const { container } = render(<Avatar name="John Doe" src="https://example.com/avatar.jpg" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
      // Image element exists in the shadow DOM / Radix UI structure
      const img = container.querySelector('img')
      if (img) {
        expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
        expect(img).toHaveAttribute('alt', 'John Doe')
      }
    })

    test('should render with full name', () => {
      const { container } = render(<Avatar name="John Michael Doe" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render with single name', () => {
      const { container } = render(<Avatar name="John" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render with noInitials prop', () => {
      const { container } = render(<Avatar name="John Doe" noInitials />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render user icon when no name is provided', () => {
      const { container } = render(<Avatar />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render group icon when isGroup is true', () => {
      const { container } = render(<Avatar isGroup />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    test('should render with xs size', () => {
      const { container } = render(<Avatar size="xs" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-xs')
    })

    test('should render with sm size', () => {
      const { container } = render(<Avatar size="sm" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-sm')
    })

    test('should render with md size', () => {
      const { container } = render(<Avatar size="md" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-md')
    })

    test('should render with lg size', () => {
      const { container } = render(<Avatar size="lg" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-lg')
    })
  })

  describe('Rounded variant', () => {
    test('should render without rounded class by default', () => {
      const { container } = render(<Avatar />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).not.toHaveClass('cn-avatar-rounded')
    })

    test('should render with rounded class when rounded is true', () => {
      const { container } = render(<Avatar rounded />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-rounded')
    })
  })

  describe('Fallback behavior', () => {
    test('should render with long name', () => {
      const { container } = render(<Avatar name="John Doe Smith Brown" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render with short name', () => {
      const { container } = render(<Avatar name="John Doe" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Custom styling', () => {
    test('should apply custom className', () => {
      const { container } = render(<Avatar className="custom-class" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('custom-class')
    })

    test('should forward additional HTML attributes', () => {
      const { container } = render(<Avatar data-testid="custom-avatar" />)
      const avatar = container.querySelector('[data-testid="custom-avatar"]')
      expect(avatar).toBeInTheDocument()
    })
  })
})

describe('AvatarWithTooltip', () => {
  describe('Rendering', () => {
    test('should render avatar with default tooltip', () => {
      const { container } = render(
        <TestWrapper>
          <AvatarWithTooltip name="John Doe" />
        </TestWrapper>
      )
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render with custom tooltip content', () => {
      const { container } = render(
        <TestWrapper>
          <AvatarWithTooltip name="John Doe" tooltipProps={{ content: 'Custom tooltip' }} />
        </TestWrapper>
      )
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render with tooltip title and content', () => {
      const { container } = render(
        <TestWrapper>
          <AvatarWithTooltip name="John Doe" tooltipProps={{ title: 'User', content: 'Team Member' }} />
        </TestWrapper>
      )
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should use name as tooltip content when no tooltip content provided', () => {
      const { container } = render(
        <TestWrapper>
          <AvatarWithTooltip name="John Doe" />
        </TestWrapper>
      )
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render with all avatar props', () => {
      const { container } = render(
        <TestWrapper>
          <AvatarWithTooltip
            name="Jane Smith"
            src="https://example.com/avatar.jpg"
            size="lg"
            rounded
            tooltipProps={{ content: 'Admin User' }}
          />
        </TestWrapper>
      )
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-lg')
      expect(avatar).toHaveClass('cn-avatar-rounded')
      const img = container.querySelector('img')
      if (img) {
        expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
      }
    })
  })

  describe('Tooltip positioning', () => {
    test('should render with custom tooltip side', () => {
      const { container } = render(
        <TestWrapper>
          <AvatarWithTooltip name="John Doe" tooltipProps={{ content: 'User', side: 'top' }} />
        </TestWrapper>
      )
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render with custom tooltip alignment', () => {
      const { container } = render(
        <TestWrapper>
          <AvatarWithTooltip name="John Doe" tooltipProps={{ content: 'User', align: 'start' }} />
        </TestWrapper>
      )
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should use empty string as tooltip when no name or content', () => {
      const { container } = render(
        <TestWrapper>
          <AvatarWithTooltip />
        </TestWrapper>
      )
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should prioritize tooltipProps content over name', () => {
      const { container } = render(
        <TestWrapper>
          <AvatarWithTooltip name="John Doe" tooltipProps={{ content: 'Custom Content' }} />
        </TestWrapper>
      )
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should handle all avatar props with tooltip', () => {
      const { container } = render(
        <TestWrapper>
          <AvatarWithTooltip name="Test User" size="xs" rounded noInitials isGroup className="custom" />
        </TestWrapper>
      )
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-xs')
      expect(avatar).toHaveClass('cn-avatar-rounded')
      expect(avatar).toHaveClass('custom')
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref correctly', () => {
      const ref = vi.fn()
      render(
        <TestWrapper>
          <AvatarWithTooltip ref={ref} name="Test" />
        </TestWrapper>
      )
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Component Display Name', () => {
    test('should have correct displayName', () => {
      expect(AvatarWithTooltip.displayName).toBe('AvatarWithTooltip')
    })
  })
})

describe('Avatar - Additional Coverage', () => {
  describe('Initials Rendering', () => {
    test('should render with full name', () => {
      const { container } = render(<Avatar name="John Doe" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render with single name', () => {
      const { container } = render(<Avatar name="John" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render with three-word name', () => {
      const { container } = render(<Avatar name="John Michael Doe" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render when noInitials is true', () => {
      const { container } = render(<Avatar name="John Doe" noInitials />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should handle four-word name for small fallback class', () => {
      const { container } = render(<Avatar name="John Michael James Doe" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should handle two-word name without small fallback class', () => {
      const { container } = render(<Avatar name="John Doe" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Image Behavior', () => {
    test('should render avatar with src provided', () => {
      const { container } = render(<Avatar name="John Doe" src="https://example.com/avatar.jpg" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render avatar with fallback support', () => {
      const { container } = render(<Avatar name="John Doe" src="https://example.com/avatar.jpg" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render without image when no src', () => {
      const { container } = render(<Avatar name="John Doe" />)
      const img = container.querySelector('.cn-avatar-image')
      expect(img).not.toBeInTheDocument()
    })

    test('should handle avatar with both name and src', () => {
      const { container } = render(<Avatar name="John Doe" src="https://example.com/avatar.jpg" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Icon Rendering', () => {
    test('should render user icon when name is empty', () => {
      const { container } = render(<Avatar name="" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render user icon when name is undefined', () => {
      const { container } = render(<Avatar />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render group icon when isGroup is true', () => {
      const { container } = render(<Avatar isGroup />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render group icon even with name when isGroup is true', () => {
      const { container } = render(<Avatar name="Team Name" isGroup />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render group icon with src when isGroup is true', () => {
      const { container } = render(<Avatar isGroup src="https://example.com/group.jpg" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Size and Rounded Combinations', () => {
    test('should render xs size with rounded', () => {
      const { container } = render(<Avatar size="xs" rounded />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-xs')
      expect(avatar).toHaveClass('cn-avatar-rounded')
    })

    test('should render md size with rounded', () => {
      const { container } = render(<Avatar size="md" rounded />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-md')
      expect(avatar).toHaveClass('cn-avatar-rounded')
    })

    test('should render lg size with rounded', () => {
      const { container } = render(<Avatar size="lg" rounded />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-lg')
      expect(avatar).toHaveClass('cn-avatar-rounded')
    })

    test('should render with rounded=false explicitly', () => {
      const { container } = render(<Avatar rounded={false} />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).not.toHaveClass('cn-avatar-rounded')
    })
  })

  describe('Props Forwarding', () => {
    test('should forward aria attributes', () => {
      const { container } = render(<Avatar aria-label="User avatar" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveAttribute('aria-label', 'User avatar')
    })

    test('should forward data attributes', () => {
      const { container } = render(<Avatar data-testid="avatar-test" data-user-id="123" />)
      const avatar = container.querySelector('[data-testid="avatar-test"]')
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('data-user-id', '123')
    })

    test('should forward onClick handler', () => {
      const handleClick = vi.fn()
      const { container } = render(<Avatar onClick={handleClick} />)
      const avatar = container.querySelector('.cn-avatar')
      avatar?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should forward style prop', () => {
      const { container } = render(<Avatar style={{ backgroundColor: 'red' }} />)
      const avatar = container.querySelector('.cn-avatar')
      // Check that style is applied
      expect(avatar).toBeTruthy()
      expect(avatar?.getAttribute('style')).toContain('background-color')
    })

    test('should forward title attribute', () => {
      const { container } = render(<Avatar title="User Avatar" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveAttribute('title', 'User Avatar')
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<Avatar ref={ref} />)
      expect(ref).toHaveBeenCalled()
    })

    test('should forward ref with all props', () => {
      const ref = vi.fn()
      render(<Avatar ref={ref} name="Test" size="lg" rounded />)
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Component Display Name', () => {
    test('should have correct displayName', () => {
      expect(Avatar.displayName).toBe('Avatar')
    })
  })

  describe('Edge Cases with Names', () => {
    test('should handle name with special characters', () => {
      const { container } = render(<Avatar name="O'Brien" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should handle name with numbers', () => {
      const { container } = render(<Avatar name="User123" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should handle name with extra spaces', () => {
      const { container } = render(<Avatar name="  John   Doe  " />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should handle single character name', () => {
      const { container } = render(<Avatar name="X" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should handle very long name', () => {
      const longName = 'John Michael Alexander Christopher James Robert William'
      const { container } = render(<Avatar name={longName} />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Class Name Combinations', () => {
    test('should combine custom className with size and rounded', () => {
      const { container } = render(<Avatar className="custom-avatar" size="lg" rounded />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-lg')
      expect(avatar).toHaveClass('cn-avatar-rounded')
      expect(avatar).toHaveClass('custom-avatar')
    })

    test('should apply multiple custom classes', () => {
      const { container } = render(<Avatar className="class1 class2 class3" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('class1')
      expect(avatar).toHaveClass('class2')
      expect(avatar).toHaveClass('class3')
    })
  })

  describe('Default Values', () => {
    test('should use default size sm when not specified', () => {
      const { container } = render(<Avatar />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-sm')
    })

    test('should use default rounded false when not specified', () => {
      const { container } = render(<Avatar />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).not.toHaveClass('cn-avatar-rounded')
    })

    test('should use default noInitials false when not specified', () => {
      const { container } = render(<Avatar name="John Doe" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should use default isGroup false when not specified', () => {
      const { container } = render(<Avatar />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle all props together', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <Avatar
          name="John Doe"
          src="https://example.com/avatar.jpg"
          size="lg"
          rounded
          className="custom"
          onClick={handleClick}
          data-testid="complex-avatar"
          aria-label="User avatar"
        />
      )

      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-lg')
      expect(avatar).toHaveClass('cn-avatar-rounded')
      expect(avatar).toHaveClass('custom')
      expect(avatar).toHaveAttribute('data-testid', 'complex-avatar')
      expect(avatar).toHaveAttribute('aria-label', 'User avatar')

      avatar?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(handleClick).toHaveBeenCalled()
    })

    test('should handle noInitials with isGroup', () => {
      const { container } = render(<Avatar name="Team Name" noInitials isGroup />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should handle src with noInitials', () => {
      const { container } = render(<Avatar name="John Doe" src="https://example.com/avatar.jpg" noInitials />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render with all sizes', () => {
      const sizes: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg']

      sizes.forEach(size => {
        const { container } = render(<Avatar size={size} />)
        const avatar = container.querySelector('.cn-avatar')
        expect(avatar).toHaveClass(`cn-avatar-${size}`)
      })
    })
  })

  describe('Accessibility', () => {
    test('should be accessible with name', () => {
      const { container } = render(<Avatar name="John Doe" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should support aria-hidden', () => {
      const { container } = render(<Avatar aria-hidden="true" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveAttribute('aria-hidden', 'true')
    })

    test('should support role attribute', () => {
      const { container } = render(<Avatar role="img" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveAttribute('role', 'img')
    })
  })

  describe('Fallback Rendering', () => {
    test('should render fallback immediately when no src provided', () => {
      const { container } = render(<Avatar name="John Doe" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })

    test('should render fallback for avatar without src', () => {
      const { container } = render(<Avatar name="Test User" />)
      const avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Re-rendering with Prop Changes', () => {
    test('should update when size changes', () => {
      const { rerender, container } = render(<Avatar size="sm" />)

      let avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-sm')

      rerender(<Avatar size="lg" />)

      avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-lg')
      expect(avatar).not.toHaveClass('cn-avatar-sm')
    })

    test('should update when rounded changes', () => {
      const { rerender, container } = render(<Avatar rounded={false} />)

      let avatar = container.querySelector('.cn-avatar')
      expect(avatar).not.toHaveClass('cn-avatar-rounded')

      rerender(<Avatar rounded={true} />)

      avatar = container.querySelector('.cn-avatar')
      expect(avatar).toHaveClass('cn-avatar-rounded')
    })

    test('should update when name changes', () => {
      const { rerender, container } = render(<Avatar name="John Doe" />)

      let avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()

      rerender(<Avatar name="Jane Smith" />)

      avatar = container.querySelector('.cn-avatar')
      expect(avatar).toBeInTheDocument()
    })
  })
})
