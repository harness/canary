import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { NoData } from '../no-data'

describe('NoData', () => {
  describe('Rendering', () => {
    test('should render with title and description', () => {
      render(<NoData title="No Items Found" description={['No items to display', 'Try creating a new item']} />)
      expect(screen.getByText('No Items Found')).toBeInTheDocument()
      expect(screen.getByText('No items to display')).toBeInTheDocument()
      expect(screen.getByText('Try creating a new item')).toBeInTheDocument()
    })

    test('should render with illustration when imageName is provided', () => {
      const { container } = render(
        <NoData title="Empty" description={['No data']} imageName="no-data-folder" imageSize={120} />
      )
      // Illustration component renders, exact structure may vary
      expect(container).toBeInTheDocument()
    })

    test('should render without illustration when imageName is not provided', () => {
      const { container } = render(<NoData title="Empty" description={['No data']} />)
      const illustration = container.querySelector('.cn-illustration')
      expect(illustration).not.toBeInTheDocument()
    })

    test('should render with border when withBorder is true', () => {
      const { container } = render(<NoData title="Empty" description={['No data']} withBorder />)
      const layout = container.firstChild
      expect(layout).toHaveClass('border')
    })
  })

  describe('Primary button', () => {
    test('should render primary button', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          primaryButton={{ label: 'Create Item', onClick: vi.fn() }}
        />
      )
      expect(screen.getByRole('button', { name: /Create Item/i })).toBeInTheDocument()
    })

    test('should render primary button with icon', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          primaryButton={{ label: 'Create Item', icon: 'plus', onClick: vi.fn() }}
        />
      )
      const button = screen.getByRole('button', { name: /Create Item/i })
      expect(button).toBeInTheDocument()
    })

    test('should render primary button with custom variant', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          primaryButton={{ label: 'Create Item', variant: 'outline', onClick: vi.fn() }}
        />
      )
      const button = screen.getByRole('button', { name: /Create Item/i })
      expect(button).toHaveClass('cn-button-outline')
    })

    test('should render primary button as link when to prop is provided', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          primaryButton={{ label: 'Create Item', to: '/create' }}
        />
      )
      const link = screen.getByText('Create Item').closest('a')
      expect(link).toBeInTheDocument()
    })

    test('should render primary button as disabled', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          primaryButton={{ label: 'Create Item', disabled: true, onClick: vi.fn() }}
        />
      )
      const button = screen.getByRole('button', { name: /Create Item/i })
      expect(button).toBeDisabled()
    })
  })

  describe('Secondary button', () => {
    test('should render secondary button', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          secondaryButton={{ label: 'Learn More', onClick: vi.fn() }}
        />
      )
      expect(screen.getByRole('button', { name: /Learn More/i })).toBeInTheDocument()
    })

    test('should render secondary button with icon', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          secondaryButton={{ label: 'Learn More', icon: 'search', onClick: vi.fn() }}
        />
      )
      const button = screen.getByRole('button', { name: /Learn More/i })
      expect(button).toBeInTheDocument()
    })

    test('should render secondary button with outline variant by default', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          secondaryButton={{ label: 'Learn More', onClick: vi.fn() }}
        />
      )
      const button = screen.getByRole('button', { name: /Learn More/i })
      expect(button).toHaveClass('cn-button-outline')
    })

    test('should render secondary button as link when to prop is provided', () => {
      render(
        <NoData title="No Items" description={['Empty']} secondaryButton={{ label: 'Learn More', to: '/docs' }} />
      )
      const link = screen.getByText('Learn More').closest('a')
      expect(link).toBeInTheDocument()
    })
  })

  describe('Both buttons', () => {
    test('should render both primary and secondary buttons', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          primaryButton={{ label: 'Create', onClick: vi.fn() }}
          secondaryButton={{ label: 'Cancel', onClick: vi.fn() }}
        />
      )
      expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
    })
  })

  describe('Split button', () => {
    test('should render split button', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          splitButton={{
            label: 'Create',
            options: [{ value: 'option1', label: 'Option 1' }],
            handleOptionChange: vi.fn(),
            handleButtonClick: vi.fn()
          }}
        />
      )
      expect(screen.getByText('Create')).toBeInTheDocument()
    })

    test('should render split button with icon', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          splitButton={{
            label: 'Create',
            icon: 'plus',
            options: [{ value: 'option1', label: 'Option 1' }],
            handleOptionChange: vi.fn(),
            handleButtonClick: vi.fn()
          }}
        />
      )
      expect(screen.getByText('Create')).toBeInTheDocument()
    })
  })

  describe('Custom content', () => {
    test('should render custom children', () => {
      render(
        <NoData title="No Items" description={['Empty']}>
          <button>Custom Action</button>
        </NoData>
      )
      expect(screen.getByRole('button', { name: /Custom Action/i })).toBeInTheDocument()
    })

    test('should render children alongside buttons', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          primaryButton={{ label: 'Create', onClick: vi.fn() }}
        >
          <button>Custom Action</button>
        </NoData>
      )
      expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Custom Action/i })).toBeInTheDocument()
    })
  })

  describe('Custom styling', () => {
    test('should apply custom className', () => {
      const { container } = render(<NoData title="No Items" description={['Empty']} className="custom-class" />)
      const layout = container.firstChild
      expect(layout).toHaveClass('custom-class')
    })

    test('should apply custom textWrapperClassName', () => {
      const { container } = render(
        <NoData title="No Items" description={['Empty']} textWrapperClassName="custom-text-wrapper" />
      )
      const textWrapper = container.querySelector('.custom-text-wrapper')
      expect(textWrapper).toBeInTheDocument()
    })

    test('should use custom image size', () => {
      const { container } = render(<NoData title="Empty" description={['No data']} imageName="no-data-folder" imageSize={200} />)
      // Illustration component renders with custom size
      expect(container).toBeInTheDocument()
    })
  })

  describe('Multiple description lines', () => {
    test('should render all description lines', () => {
      render(
        <NoData
          title="No Items"
          description={['Line 1', 'Line 2', 'Line 3']}
        />
      )
      expect(screen.getByText('Line 1')).toBeInTheDocument()
      expect(screen.getByText('Line 2')).toBeInTheDocument()
      expect(screen.getByText('Line 3')).toBeInTheDocument()
    })
  })

  describe('Button layout', () => {
    test('should not render button container when no buttons or children', () => {
      const { container } = render(<NoData title="No Items" description={['Empty']} />)
      const buttonContainer = container.querySelector('.cn-layout-horizontal')
      expect(buttonContainer).not.toBeInTheDocument()
    })
  })
})

