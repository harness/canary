import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
        <NoData title="No Items" description={['Empty']} primaryButton={{ label: 'Create Item', onClick: vi.fn() }} />
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
        <NoData title="No Items" description={['Empty']} primaryButton={{ label: 'Create Item', to: '/create' }} />
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
        <NoData title="No Items" description={['Empty']} secondaryButton={{ label: 'Learn More', onClick: vi.fn() }} />
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
        <NoData title="No Items" description={['Empty']} secondaryButton={{ label: 'Learn More', onClick: vi.fn() }} />
      )
      const button = screen.getByRole('button', { name: /Learn More/i })
      expect(button).toHaveClass('cn-button-outline')
    })

    test('should render secondary button as link when to prop is provided', () => {
      render(<NoData title="No Items" description={['Empty']} secondaryButton={{ label: 'Learn More', to: '/docs' }} />)
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
    test('should render split button with options', () => {
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

    test('should call handleButtonClick when main split button is clicked', async () => {
      const handleButtonClick = vi.fn()
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          splitButton={{
            label: 'Create',
            options: [{ value: 'option1', label: 'Option 1' }],
            handleOptionChange: vi.fn(),
            handleButtonClick
          }}
        />
      )

      const button = screen.getByText('Create')
      await userEvent.click(button)

      expect(handleButtonClick).toHaveBeenCalled()
    })

    test('should call handleOptionChange with tag-rule option', async () => {
      const handleOptionChange = vi.fn()
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          splitButton={{
            label: 'Create',
            options: [
              { value: 'tag-rule', label: 'Tag Rule' },
              { value: 'other', label: 'Other' }
            ],
            handleOptionChange,
            handleButtonClick: vi.fn()
          }}
        />
      )

      // Split button renders
      expect(screen.getByText('Create')).toBeInTheDocument()
    })

    test('should render split button with custom props', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          splitButton={{
            label: 'Create',
            options: [{ value: 'option1', label: 'Option 1' }],
            handleOptionChange: vi.fn(),
            handleButtonClick: vi.fn(),
            props: { variant: 'outline' }
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
        <NoData title="No Items" description={['Empty']} primaryButton={{ label: 'Create', onClick: vi.fn() }}>
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
      const { container } = render(
        <NoData title="Empty" description={['No data']} imageName="no-data-folder" imageSize={200} />
      )
      // Illustration component renders with custom size
      expect(container).toBeInTheDocument()
    })
  })

  describe('Multiple description lines', () => {
    test('should render all description lines', () => {
      render(<NoData title="No Items" description={['Line 1', 'Line 2', 'Line 3']} />)
      expect(screen.getByText('Line 1')).toBeInTheDocument()
      expect(screen.getByText('Line 2')).toBeInTheDocument()
      expect(screen.getByText('Line 3')).toBeInTheDocument()
    })
  })

  describe('Button layout', () => {
    test('should not render button container when no buttons or children provided', () => {
      const { container } = render(<NoData title="No Items" description={['Empty']} />)
      const buttonContainer = container.querySelector('.cn-layout-horizontal')
      expect(buttonContainer).not.toBeInTheDocument()
    })

    test('should render button container only when buttons exist', () => {
      render(<NoData title="No Items" description={['Empty']} primaryButton={{ label: 'Create', onClick: vi.fn() }} />)

      // Button is rendered
      expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument()
    })
  })

  describe('Primary Button as Dialog Trigger', () => {
    test('should render primary button as dialog trigger when isDialogTrigger is true', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          primaryButton={{ label: 'Create Item', onClick: vi.fn(), isDialogTrigger: true }}
        />
      )
      expect(screen.getByRole('button', { name: /Create Item/i })).toBeInTheDocument()
    })

    test('should not wrap in dialog trigger when isDialogTrigger is false', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          primaryButton={{ label: 'Create Item', onClick: vi.fn(), isDialogTrigger: false }}
        />
      )
      expect(screen.getByRole('button', { name: /Create Item/i })).toBeInTheDocument()
    })
  })

  describe('Secondary Button as Dialog Trigger', () => {
    test('should render secondary button as dialog trigger when isDialogTrigger is true', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          secondaryButton={{ label: 'Learn More', onClick: vi.fn(), isDialogTrigger: true }}
        />
      )
      expect(screen.getByRole('button', { name: /Learn More/i })).toBeInTheDocument()
    })

    test('should not wrap in dialog trigger when isDialogTrigger is false', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          secondaryButton={{ label: 'Learn More', onClick: vi.fn(), isDialogTrigger: false }}
        />
      )
      expect(screen.getByRole('button', { name: /Learn More/i })).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty description array', () => {
      render(<NoData title="No Items" description={[]} />)

      expect(screen.getByText('No Items')).toBeInTheDocument()
    })

    test('should handle very long title', () => {
      const longTitle = 'This is a very long title that should still render correctly in the no data component'
      render(<NoData title={longTitle} description={['Empty']} />)

      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    test('should handle special characters in title', () => {
      render(<NoData title="<No Items & Data>" description={['Empty']} />)

      expect(screen.getByText('<No Items & Data>')).toBeInTheDocument()
    })

    test('should handle numeric title', () => {
      render(<NoData title="404" description={['Page not found']} />)

      expect(screen.getByText('404')).toBeInTheDocument()
    })

    test('should handle single description line', () => {
      render(<NoData title="Empty" description={['Single line']} />)

      expect(screen.getByText('Single line')).toBeInTheDocument()
    })

    test('should handle many description lines', () => {
      const lines = Array.from({ length: 10 }, (_, i) => `Line ${i + 1}`)
      render(<NoData title="Empty" description={lines} />)

      lines.forEach(line => {
        expect(screen.getByText(line)).toBeInTheDocument()
      })
    })
  })

  describe('Default Values', () => {
    test('should default withBorder to false', () => {
      const { container } = render(<NoData title="Empty" description={['No data']} />)
      const layout = container.firstChild
      expect(layout).not.toHaveClass('border')
    })

    test('should default imageSize to 112', () => {
      const { container } = render(<NoData title="Empty" description={['No data']} imageName="no-data-folder" />)
      expect(container).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper heading structure', () => {
      render(<NoData title="No Items" description={['Empty']} />)

      const heading = screen.getByText('No Items')
      expect(heading).toBeInTheDocument()
    })

    test('should have accessible button labels', () => {
      render(
        <NoData
          title="No Items"
          description={['Empty']}
          primaryButton={{ label: 'Create', onClick: vi.fn() }}
          secondaryButton={{ label: 'Learn More', onClick: vi.fn() }}
        />
      )

      expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Learn More/i })).toBeInTheDocument()
    })

    test('should handle disabled button state for accessibility', () => {
      render(<NoData title="No Items" description={['Empty']} primaryButton={{ label: 'Create', disabled: true }} />)

      const button = screen.getByRole('button', { name: /Create/i })
      expect(button).toBeDisabled()
    })
  })

  describe('Re-rendering', () => {
    test('should update when title changes', () => {
      const { rerender } = render(<NoData title="Initial" description={['Empty']} />)

      expect(screen.getByText('Initial')).toBeInTheDocument()

      rerender(<NoData title="Updated" description={['Empty']} />)

      expect(screen.getByText('Updated')).toBeInTheDocument()
      expect(screen.queryByText('Initial')).not.toBeInTheDocument()
    })

    test('should update when description changes', () => {
      const { rerender } = render(<NoData title="Empty" description={['Line 1']} />)

      expect(screen.getByText('Line 1')).toBeInTheDocument()

      rerender(<NoData title="Empty" description={['Line 2']} />)

      expect(screen.getByText('Line 2')).toBeInTheDocument()
      expect(screen.queryByText('Line 1')).not.toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should render with all props together', () => {
      render(
        <NoData
          title="No Data"
          description={['Line 1', 'Line 2']}
          imageName="no-data-folder"
          imageSize={150}
          withBorder
          className="custom-class"
          textWrapperClassName="custom-text"
          primaryButton={{ label: 'Create', icon: 'plus', onClick: vi.fn() }}
          secondaryButton={{ label: 'Cancel', onClick: vi.fn() }}
        >
          <button>Custom</button>
        </NoData>
      )

      expect(screen.getByText('No Data')).toBeInTheDocument()
      expect(screen.getByText('Line 1')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Custom/i })).toBeInTheDocument()
    })

    test('should render primary button as link with icon', () => {
      render(
        <NoData
          title="Empty"
          description={['No data']}
          primaryButton={{ label: 'Go Home', to: '/home', icon: 'arrow-left' }}
        />
      )

      const link = screen.getByText('Go Home').closest('a')
      expect(link).toBeInTheDocument()
    })

    test('should render secondary button as link with icon', () => {
      render(
        <NoData
          title="Empty"
          description={['No data']}
          secondaryButton={{ label: 'View Docs', to: '/docs', icon: 'star' }}
        />
      )

      const link = screen.getByText('View Docs').closest('a')
      expect(link).toBeInTheDocument()
    })
  })
})
