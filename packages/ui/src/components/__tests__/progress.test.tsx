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
    test('should affect max attribute when hideContainer is true', () => {
      const { container } = render(<Progress value={0.5} hideContainer />)
      const progressBar = container.querySelector('.cn-progress-root')
      expect(progressBar).toHaveAttribute('max', '50')
    })

    test('should use 100 as max when hideContainer is false', () => {
      const { container } = render(<Progress value={0.5} hideContainer={false} />)
      const progressBar = container.querySelector('.cn-progress-root')
      expect(progressBar).toHaveAttribute('max', '100')
    })
  })
})

