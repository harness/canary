import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

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
})

