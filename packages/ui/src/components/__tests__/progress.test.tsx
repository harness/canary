import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { Progress } from '../progress'

describe('Progress', () => {
  describe('Rendering', () => {
    test('should render with default props', () => {
      const { container } = render(<Progress value={0.5} />)
      const progress = container.querySelector('.cn-progress')
      expect(progress).toBeInTheDocument()
      const progressBar = container.querySelector('.cn-progress-root')
      expect(progressBar).toHaveAttribute('value', '50')
    })

    test('should render with label', () => {
      render(<Progress value={0.5} label="Loading" />)
      expect(screen.getByText('Loading')).toBeInTheDocument()
    })

    test('should render with description', () => {
      render(<Progress value={0.5} description="Processing files" />)
      expect(screen.getByText('Processing files')).toBeInTheDocument()
    })

    test('should render with subtitle', () => {
      render(<Progress value={0.5} subtitle="2 of 4 files" />)
      expect(screen.getByText('2 of 4 files')).toBeInTheDocument()
    })

    test('should render with all metadata', () => {
      render(<Progress value={0.5} label="Upload" description="Uploading files" subtitle="50% complete" />)
      expect(screen.getByText('Upload')).toBeInTheDocument()
      expect(screen.getByText('Uploading files')).toBeInTheDocument()
      expect(screen.getByText('50% complete')).toBeInTheDocument()
    })
  })

  describe('Value handling', () => {
    test('should display correct percentage', () => {
      render(<Progress value={0.75} />)
      expect(screen.getByText('75%')).toBeInTheDocument()
    })

    test('should clamp value to 0-1 range (below 0)', () => {
      const { container } = render(<Progress value={-0.5} />)
      const progressBar = container.querySelector('.cn-progress-root')
      expect(progressBar).toHaveAttribute('value', '0')
    })

    test('should clamp value to 0-1 range (above 1)', () => {
      const { container } = render(<Progress value={1.5} />)
      const progressBar = container.querySelector('.cn-progress-root')
      expect(progressBar).toHaveAttribute('value', '100')
    })

    test('should handle zero value', () => {
      render(<Progress value={0} />)
      expect(screen.getByText('0%')).toBeInTheDocument()
    })

    test('should handle full value', () => {
      render(<Progress value={1} />)
      expect(screen.getByText('100%')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    test('should render indeterminate variant', () => {
      const { container } = render(<Progress variant="indeterminate" />)
      const fakeProgress = container.querySelector('.cn-progress-indeterminate-fake')
      expect(fakeProgress).toBeInTheDocument()
    })

    test('should not show percentage in indeterminate mode', () => {
      const { container } = render(<Progress variant="indeterminate" />)
      expect(container.textContent).not.toContain('%')
    })
  })

  describe('States', () => {
    test('should render with default state', () => {
      const { container } = render(<Progress value={0.5} />)
      const progress = container.querySelector('.cn-progress')
      expect(progress).toBeInTheDocument()
    })

    test('should render with processing state', () => {
      const { container } = render(<Progress value={0.5} state="processing" />)
      const progress = container.querySelector('.cn-progress')
      expect(progress).toHaveClass('cn-progress-processing')
      const processingOverlay = container.querySelector('.cn-progress-processing-fake')
      expect(processingOverlay).toBeInTheDocument()
    })

    test('should render with completed state and icon', () => {
      const { container } = render(<Progress value={1} state="completed" />)
      const progress = container.querySelector('.cn-progress')
      expect(progress).toHaveClass('cn-progress-completed')
      const icon = container.querySelector('.cn-progress-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render with paused state and icon', () => {
      const { container } = render(<Progress value={0.5} state="paused" />)
      const progress = container.querySelector('.cn-progress')
      expect(progress).toHaveClass('cn-progress-paused')
      const icon = container.querySelector('.cn-progress-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render with failed state and icon', () => {
      const { container } = render(<Progress value={0.3} state="failed" />)
      const progress = container.querySelector('.cn-progress')
      expect(progress).toHaveClass('cn-progress-failed')
      const icon = container.querySelector('.cn-progress-icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    test('should render with small size', () => {
      const { container } = render(<Progress value={0.5} size="sm" />)
      const progress = container.querySelector('.cn-progress')
      expect(progress).toHaveClass('cn-progress-sm')
    })

    test('should render with medium size (default)', () => {
      const { container } = render(<Progress value={0.5} size="md" />)
      const progress = container.querySelector('.cn-progress')
      expect(progress).toBeInTheDocument()
    })

    test('should render with large size', () => {
      const { container } = render(<Progress value={0.5} size="lg" />)
      const progress = container.querySelector('.cn-progress')
      expect(progress).toHaveClass('cn-progress-lg')
    })
  })

  describe('Hide options', () => {
    test('should hide percentage when hidePercentage is true', () => {
      const { container } = render(<Progress value={0.5} hidePercentage />)
      expect(container.textContent).not.toContain('50%')
    })

    test('should hide icon when hideIcon is true', () => {
      const { container } = render(<Progress value={0.5} state="completed" hideIcon />)
      const icon = container.querySelector('.cn-progress-icon')
      expect(icon).not.toBeInTheDocument()
    })

    test('should hide header when no label, percentage or icon', () => {
      const { container } = render(<Progress value={0.5} hidePercentage hideIcon />)
      const header = container.querySelector('.cn-progress-header')
      expect(header).not.toBeInTheDocument()
    })

    test('should hide footer when no description or subtitle', () => {
      const { container } = render(<Progress value={0.5} />)
      const footer = container.querySelector('.cn-progress-footer')
      expect(footer).not.toBeInTheDocument()
    })
  })

  describe('Custom ID', () => {
    test('should use custom id when provided', () => {
      const { container } = render(<Progress value={0.5} id="custom-progress" />)
      const progressBar = container.querySelector('#custom-progress')
      expect(progressBar).toBeInTheDocument()
    })

    test('should generate unique id when not provided', () => {
      const { container: container1 } = render(<Progress value={0.5} />)
      const { container: container2 } = render(<Progress value={0.5} />)
      const progress1 = container1.querySelector('.cn-progress-root')
      const progress2 = container2.querySelector('.cn-progress-root')
      expect(progress1?.id).toBeTruthy()
      expect(progress2?.id).toBeTruthy()
      expect(progress1?.id).not.toBe(progress2?.id)
    })

    test('should link label to progress with htmlFor', () => {
      const { container } = render(<Progress value={0.5} id="test-progress" label="Test" />)
      const label = container.querySelector('label')
      expect(label).toHaveAttribute('for', 'test-progress')
    })
  })

  describe('Custom styling', () => {
    test('should apply custom className', () => {
      const { container } = render(<Progress value={0.5} className="custom-class" />)
      const progress = container.querySelector('.cn-progress')
      expect(progress).toHaveClass('custom-class')
    })

    test('should forward additional HTML attributes', () => {
      const { container } = render(<Progress value={0.5} data-testid="custom-progress" />)
      const progress = container.querySelector('[data-testid="custom-progress"]')
      expect(progress).toBeInTheDocument()
    })
  })

  describe('Processing overlay', () => {
    test('should render processing overlay with correct transform', () => {
      const { container } = render(<Progress value={0.6} state="processing" />)
      const overlay = container.querySelector('.cn-progress-processing-fake') as HTMLElement
      expect(overlay).toHaveStyle({ transform: 'translateX(-40%)' })
    })

    test('should not render processing overlay for other states', () => {
      const { container } = render(<Progress value={0.5} state="completed" />)
      const overlay = container.querySelector('.cn-progress-processing-fake')
      expect(overlay).not.toBeInTheDocument()
    })
  })

  describe('hideContainer prop', () => {
    test('should set max to value when hideContainer is true', () => {
      const { container } = render(<Progress value={0.5} hideContainer />)
      const progressBar = container.querySelector('.cn-progress-root')
      expect(progressBar).toHaveAttribute('max', '50')
    })

    test('should set max to 100 when hideContainer is false', () => {
      const { container } = render(<Progress value={0.5} hideContainer={false} />)
      const progressBar = container.querySelector('.cn-progress-root')
      expect(progressBar).toHaveAttribute('max', '100')
    })

    test('should default hideContainer to false', () => {
      const { container } = render(<Progress value={0.5} />)
      const progressBar = container.querySelector('.cn-progress-root')
      expect(progressBar).toHaveAttribute('max', '100')
    })
  })

  describe('Component Display Name', () => {
    test('should have correct display name', () => {
      expect(Progress.displayName).toBe('Progress')
    })
  })

  describe('Additional Edge Cases', () => {
    test('should handle value exactly at 0.5', () => {
      render(<Progress value={0.5} />)
      expect(screen.getByText('50%')).toBeInTheDocument()
    })

    test('should handle value at boundary 0.01', () => {
      render(<Progress value={0.01} />)
      expect(screen.getByText('1%')).toBeInTheDocument()
    })

    test('should handle value at boundary 0.99', () => {
      render(<Progress value={0.99} />)
      expect(screen.getByText('99%')).toBeInTheDocument()
    })

    test('should handle negative value clamping', () => {
      const { container } = render(<Progress value={-10} />)
      expect(screen.getByText('0%')).toBeInTheDocument()
      const progressBar = container.querySelector('.cn-progress-root')
      expect(progressBar).toHaveAttribute('value', '0')
    })

    test('should handle very large value clamping', () => {
      const { container } = render(<Progress value={999} />)
      expect(screen.getByText('100%')).toBeInTheDocument()
      const progressBar = container.querySelector('.cn-progress-root')
      expect(progressBar).toHaveAttribute('value', '100')
    })

    test('should handle very long label text', () => {
      const longLabel = 'This is a very long label that should still render properly'
      render(<Progress value={0.5} label={longLabel} />)

      expect(screen.getByText(longLabel)).toBeInTheDocument()
    })

    test('should handle special characters in label', () => {
      render(<Progress value={0.5} label="<Loading & Processing>" />)

      expect(screen.getByText('<Loading & Processing>')).toBeInTheDocument()
    })

    test('should handle empty string label', () => {
      render(<Progress value={0.5} label="" />)

      expect(screen.getByText('50%')).toBeInTheDocument()
    })

    test('should handle empty string description', () => {
      const { container } = render(<Progress value={0.5} description="" />)
      const footer = container.querySelector('.cn-progress-footer')
      expect(footer).not.toBeInTheDocument()
    })

    test('should handle empty string subtitle', () => {
      const { container } = render(<Progress value={0.5} subtitle="" />)
      const footer = container.querySelector('.cn-progress-footer')
      expect(footer).not.toBeInTheDocument()
    })
  })

  describe('State Icons', () => {
    test('should render check-circle icon for completed state', () => {
      const { container } = render(<Progress value={1} state="completed" />)
      const icon = container.querySelector('.cn-progress-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render pause icon for paused state', () => {
      const { container } = render(<Progress value={0.5} state="paused" />)
      const icon = container.querySelector('.cn-progress-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render xmark-circle icon for failed state', () => {
      const { container } = render(<Progress value={0.3} state="failed" />)
      const icon = container.querySelector('.cn-progress-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should render clock icon for default state', () => {
      const { container } = render(<Progress value={0.5} state="default" />)
      const icon = container.querySelector('.cn-progress-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should not render icon when hideIcon is true', () => {
      const { container } = render(<Progress value={0.5} state="completed" hideIcon />)
      const icon = container.querySelector('.cn-progress-icon')
      expect(icon).not.toBeInTheDocument()
    })

    test('should not render icon for indeterminate variant', () => {
      const { container } = render(<Progress variant="indeterminate" />)
      const icon = container.querySelector('.cn-progress-icon')
      expect(icon).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper progress element', () => {
      const { container } = render(<Progress value={0.5} />)
      const progressBar = container.querySelector('progress')
      expect(progressBar).toBeInTheDocument()
    })

    test('should link label to progress via htmlFor', () => {
      const { container } = render(<Progress value={0.5} id="test-id" label="Loading" />)
      const label = container.querySelector('label')
      expect(label).toHaveAttribute('for', 'test-id')
    })

    test('should have generated id when not provided', () => {
      const { container } = render(<Progress value={0.5} />)
      const progressBar = container.querySelector('.cn-progress-root')
      expect(progressBar).toHaveAttribute('id')
    })
  })

  describe('Re-rendering', () => {
    test('should update when value changes', () => {
      const { rerender } = render(<Progress value={0.3} />)

      expect(screen.getByText('30%')).toBeInTheDocument()

      rerender(<Progress value={0.7} />)

      expect(screen.getByText('70%')).toBeInTheDocument()
      expect(screen.queryByText('30%')).not.toBeInTheDocument()
    })

    test('should update when state changes', () => {
      const { rerender, container } = render(<Progress value={0.5} state="processing" />)

      expect(container.querySelector('.cn-progress-processing')).toBeInTheDocument()

      rerender(<Progress value={0.5} state="completed" />)

      expect(container.querySelector('.cn-progress-completed')).toBeInTheDocument()
      expect(container.querySelector('.cn-progress-processing')).not.toBeInTheDocument()
    })

    test('should update when label changes', () => {
      const { rerender } = render(<Progress value={0.5} label="Initial" />)

      expect(screen.getByText('Initial')).toBeInTheDocument()

      rerender(<Progress value={0.5} label="Updated" />)

      expect(screen.getByText('Updated')).toBeInTheDocument()
      expect(screen.queryByText('Initial')).not.toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should render with all props together', () => {
      render(
        <Progress
          value={0.65}
          size="lg"
          state="processing"
          label="Uploading"
          description="Processing files"
          subtitle="65% complete"
          id="upload-progress"
          className="custom-progress"
        />
      )

      expect(screen.getByText('65%')).toBeInTheDocument()
      expect(screen.getByText('Uploading')).toBeInTheDocument()
      expect(screen.getByText('Processing files')).toBeInTheDocument()
      expect(screen.getByText('65% complete')).toBeInTheDocument()
    })

    test('should render indeterminate with label and description', () => {
      render(<Progress variant="indeterminate" label="Loading" description="Please wait" />)

      expect(screen.getByText('Loading')).toBeInTheDocument()
      expect(screen.getByText('Please wait')).toBeInTheDocument()
    })

    test('should hide header elements correctly', () => {
      const { container } = render(<Progress value={0.5} hidePercentage hideIcon />)

      const header = container.querySelector('.cn-progress-header')
      expect(header).not.toBeInTheDocument()
    })

    test('should show header with label even when percentage and icon hidden', () => {
      const { container } = render(<Progress value={0.5} label="Loading" hidePercentage hideIcon />)

      const header = container.querySelector('.cn-progress-header')
      expect(header).toBeInTheDocument()
    })
  })

  describe('Props Forwarding', () => {
    test('should forward data attributes', () => {
      const { container } = render(<Progress value={0.5} data-testid="progress-test" />)

      const progress = container.querySelector('[data-testid="progress-test"]')
      expect(progress).toBeInTheDocument()
    })

    test('should forward aria attributes', () => {
      const { container } = render(<Progress value={0.5} aria-label="Upload progress" />)

      const progress = container.querySelector('[aria-label="Upload progress"]')
      expect(progress).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to progress element', () => {
      const ref = vi.fn()

      render(<Progress ref={ref} value={0.5} />)

      expect(ref).toHaveBeenCalled()
    })
  })
})
