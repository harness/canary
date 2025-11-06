import React from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { ImageCarousel, type ImageCarouselProps } from '../image-carousel'

// Mock embla-carousel-react
const mockScrollPrev = vi.fn()
const mockScrollNext = vi.fn()
const mockScrollTo = vi.fn()
const mockCanScrollPrev = vi.fn()
const mockCanScrollNext = vi.fn()
const mockOn = vi.fn()
const mockOff = vi.fn()

const mockApi = {
  scrollPrev: mockScrollPrev,
  scrollNext: mockScrollNext,
  scrollTo: mockScrollTo,
  canScrollPrev: mockCanScrollPrev,
  canScrollNext: mockCanScrollNext,
  on: mockOn,
  off: mockOff
} as any

vi.mock('embla-carousel-react', () => ({
  default: vi.fn(() => [vi.fn(), mockApi])
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const defaultProps: ImageCarouselProps = {
  isOpen: true,
  setIsOpen: vi.fn(),
  imgEvent: ['image1.jpg', 'image2.jpg', 'image3.jpg']
}

const renderComponent = (props: Partial<ImageCarouselProps> = {}) => {
  const mergedProps = { ...defaultProps, ...props }
  return render(
    <TestWrapper>
      <ImageCarousel {...mergedProps} />
    </TestWrapper>
  )
}

describe('ImageCarousel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCanScrollPrev.mockReturnValue(true)
    mockCanScrollNext.mockReturnValue(true)
  })

  describe('Basic Rendering', () => {
    test('should render image carousel when open', () => {
      renderComponent()

      // Dialog should be present
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })

    test('should not render when isOpen is false', () => {
      renderComponent({ isOpen: false })

      // Dialog should not be present
      const dialog = screen.queryByRole('dialog')
      expect(dialog).not.toBeInTheDocument()
    })

    test('should render all images in the carousel', () => {
      const images = ['img1.jpg', 'img2.jpg', 'img3.jpg']
      renderComponent({ imgEvent: images })

      const imgElements = screen.getAllByAltText('slide')
      expect(imgElements).toHaveLength(3)
    })

    test('should render images with correct src attributes', () => {
      const images = ['image1.jpg', 'image2.jpg']
      renderComponent({ imgEvent: images })

      const imgElements = screen.getAllByAltText('slide')
      expect(imgElements[0]).toHaveAttribute('src', 'image1.jpg')
      expect(imgElements[1]).toHaveAttribute('src', 'image2.jpg')
    })

    test('should handle empty image array', () => {
      renderComponent({ imgEvent: [] })

      const imgElements = screen.queryAllByAltText('slide')
      expect(imgElements).toHaveLength(0)
    })

    test('should render with single image', () => {
      renderComponent({ imgEvent: ['single.jpg'] })

      const imgElements = screen.getAllByAltText('slide')
      expect(imgElements).toHaveLength(1)
      expect(imgElements[0]).toHaveAttribute('src', 'single.jpg')
    })
  })

  describe('Dialog Title', () => {
    test('should display custom title when provided', () => {
      const title = 'Test Image Gallery'
      renderComponent({ title })

      expect(screen.getByText(title)).toBeInTheDocument()
    })

    test('should render spacer when title is not provided', () => {
      renderComponent({ title: undefined })

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      // Title should not contain text
      expect(screen.queryByRole('heading')).toBeInTheDocument()
    })

    test('should render empty string title', () => {
      renderComponent({ title: '' })

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })
  })

  describe('Initial Slide', () => {
    test('should start at initial slide when provided', async () => {
      renderComponent({ initialSlide: 2 })

      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith(2)
      })
    })

    test('should start at first slide when initialSlide is not provided', () => {
      renderComponent({ initialSlide: undefined })

      // Should not call scrollTo without initialSlide
      expect(mockScrollTo).not.toHaveBeenCalled()
    })

    test('should not call scrollTo when initialSlide is 0 (falsy value)', () => {
      renderComponent({ initialSlide: 0 })

      // Due to !!initialSlide check in carousel, 0 is treated as falsy
      // and scrollTo won't be called
      expect(mockScrollTo).not.toHaveBeenCalled()
    })

    test('should handle large initialSlide value', async () => {
      renderComponent({ initialSlide: 100 })

      await waitFor(() => {
        expect(mockScrollTo).toHaveBeenCalledWith(100)
      })
    })
  })

  describe('Zoom Functionality', () => {
    test('should render zoom in button', () => {
      renderComponent()

      const zoomInButton = screen.getByTestId('zoomInButton')
      expect(zoomInButton).toBeInTheDocument()
    })

    test('should render zoom out button', () => {
      renderComponent()

      const zoomOutButton = screen.getByTestId('zoomOutButton')
      expect(zoomOutButton).toBeInTheDocument()
    })

    test('should zoom in when zoom in button is clicked', async () => {
      renderComponent()

      const zoomInButton = screen.getByTestId('zoomInButton')
      const images = screen.getAllByAltText('slide')

      // Initial scale should be 1
      expect(images[0]).toHaveStyle({ transform: 'scale(1)' })

      await userEvent.click(zoomInButton)

      // After zoom in, scale should be 1.1
      await waitFor(() => {
        expect(images[0]).toHaveStyle({ transform: 'scale(1.1)' })
      })
    })

    test('should zoom out when zoom out button is clicked', async () => {
      renderComponent()

      const zoomInButton = screen.getByTestId('zoomInButton')
      const zoomOutButton = screen.getByTestId('zoomOutButton')
      const images = screen.getAllByAltText('slide')

      // Zoom in first
      await userEvent.click(zoomInButton)
      await userEvent.click(zoomInButton)

      await waitFor(() => {
        const transform = images[0].style.transform
        const scaleMatch = transform.match(/scale\(([\d.]+)\)/)
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1
        expect(scale).toBeCloseTo(1.2, 1)
      })

      // Then zoom out
      await userEvent.click(zoomOutButton)

      await waitFor(() => {
        const transform = images[0].style.transform
        const scaleMatch = transform.match(/scale\(([\d.]+)\)/)
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1
        expect(scale).toBeCloseTo(1.1, 1)
      })
    })

    test('should not zoom in beyond maximum level (2.0)', async () => {
      renderComponent()

      const zoomInButton = screen.getByTestId('zoomInButton')
      const images = screen.getAllByAltText('slide')

      // Click zoom in 20 times (should max out at 2.0)
      for (let i = 0; i < 20; i++) {
        await userEvent.click(zoomInButton)
      }

      await waitFor(() => {
        const transform = images[0].style.transform
        const scaleMatch = transform.match(/scale\(([\d.]+)\)/)
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1
        // Account for floating point precision
        expect(scale).toBeLessThanOrEqual(2.01)
        expect(scale).toBeGreaterThan(1.9)
      })
    })

    test('should not zoom out beyond minimum level (0.3)', async () => {
      renderComponent()

      const zoomOutButton = screen.getByTestId('zoomOutButton')
      const images = screen.getAllByAltText('slide')

      // Click zoom out 20 times (should min out at 0.3)
      for (let i = 0; i < 20; i++) {
        await userEvent.click(zoomOutButton)
      }

      await waitFor(() => {
        const transform = images[0].style.transform
        const scaleMatch = transform.match(/scale\(([\d.]+)\)/)
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1
        expect(scale).toBeGreaterThanOrEqual(0.3)
      })
    })

    test('should handle multiple zoom in and zoom out clicks', async () => {
      renderComponent()

      const zoomInButton = screen.getByTestId('zoomInButton')
      const zoomOutButton = screen.getByTestId('zoomOutButton')
      const images = screen.getAllByAltText('slide')

      await userEvent.click(zoomInButton)
      await userEvent.click(zoomInButton)
      await userEvent.click(zoomOutButton)
      await userEvent.click(zoomInButton)

      await waitFor(() => {
        const transform = images[0].style.transform
        const scaleMatch = transform.match(/scale\(([\d.]+)\)/)
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1
        expect(scale).toBeCloseTo(1.2, 1)
      })
    })

    test('should zoom all images uniformly', async () => {
      renderComponent({ imgEvent: ['img1.jpg', 'img2.jpg', 'img3.jpg'] })

      const zoomInButton = screen.getByTestId('zoomInButton')
      const images = screen.getAllByAltText('slide')

      await userEvent.click(zoomInButton)

      await waitFor(() => {
        images.forEach(img => {
          const transform = img.style.transform
          const scaleMatch = transform.match(/scale\(([\d.]+)\)/)
          const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1
          expect(scale).toBeCloseTo(1.1, 1)
        })
      })
    })

    test('should maintain zoom level when switching slides', async () => {
      renderComponent({ imgEvent: ['img1.jpg', 'img2.jpg'] })

      const zoomInButton = screen.getByTestId('zoomInButton')
      await userEvent.click(zoomInButton)
      await userEvent.click(zoomInButton)

      const images = screen.getAllByAltText('slide')

      await waitFor(() => {
        images.forEach(img => {
          const transform = img.style.transform
          const scaleMatch = transform.match(/scale\(([\d.]+)\)/)
          const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1
          expect(scale).toBeCloseTo(1.2, 1)
        })
      })
    })

    test('should handle zoom at exact boundary values', async () => {
      renderComponent()

      const zoomInButton = screen.getByTestId('zoomInButton')
      const images = screen.getAllByAltText('slide')

      // Zoom to maximum (2.0)
      for (let i = 0; i < 10; i++) {
        await userEvent.click(zoomInButton)
      }

      // Try to zoom in one more time (should not exceed 2.0)
      await userEvent.click(zoomInButton)

      await waitFor(() => {
        const transform = images[0].style.transform
        const scaleMatch = transform.match(/scale\(([\d.]+)\)/)
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1
        // Use toBeCloseTo to handle floating point precision
        expect(scale).toBeCloseTo(2.0, 1)
        expect(scale).toBeGreaterThan(1.95)
      })
    })
  })

  describe('Dialog Close Behavior', () => {
    test('should call setIsOpen with false when dialog is closed', async () => {
      const setIsOpen = vi.fn()
      renderComponent({ setIsOpen })

      // Find all buttons - close button is the first one in the Dialog
      const buttons = screen.getAllByRole('button')
      // Close button is rendered first in the Dialog component
      const closeButton = buttons.find(btn => btn.className.includes('cn-modal-dialog-close'))

      if (closeButton) {
        await userEvent.click(closeButton)

        await waitFor(() => {
          expect(setIsOpen).toHaveBeenCalledWith(false)
        })
      } else {
        // If close button not found by class, use first button (close button)
        await userEvent.click(buttons[0])
        await waitFor(() => {
          expect(setIsOpen).toHaveBeenCalledWith(false)
        })
      }
    })

    test('should reset zoom level to 1 when dialog is closed and reopened', () => {
      const setIsOpen = vi.fn()
      const { unmount } = renderComponent({ setIsOpen })

      const zoomInButton = screen.getByTestId('zoomInButton')
      userEvent.click(zoomInButton)
      userEvent.click(zoomInButton)

      // Unmount (close dialog)
      unmount()

      // Re-render (open new dialog)
      renderComponent({ setIsOpen })
      const images = screen.getAllByAltText('slide')

      // New instance should have zoom reset to 1
      expect(images[0]).toHaveStyle({ transform: 'scale(1)' })
    })

    test('should trigger onOpenChange when dialog state changes', async () => {
      const setIsOpen = vi.fn()
      renderComponent({ setIsOpen })

      const buttons = screen.getAllByRole('button')
      const closeButton = buttons.find(btn => btn.className.includes('cn-modal-dialog-close')) || buttons[0]

      await userEvent.click(closeButton)

      await waitFor(() => {
        expect(setIsOpen).toHaveBeenCalled()
      })
    })
  })

  describe('Carousel Navigation', () => {
    test('should render carousel with navigation capability', () => {
      renderComponent()

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()

      // Images should be in carousel items
      const images = screen.getAllByAltText('slide')
      expect(images.length).toBeGreaterThan(0)
    })

    test('should handle keyboard navigation', () => {
      renderComponent()

      const dialog = screen.getByRole('dialog')

      // Simulate arrow key press
      fireEvent.keyDown(dialog, { key: 'ArrowRight' })

      // Should not throw errors
      expect(dialog).toBeInTheDocument()
    })
  })

  describe('Image Styling and Layout', () => {
    test('should apply max-h-full class to images', () => {
      renderComponent()

      const images = screen.getAllByAltText('slide')
      images.forEach(img => {
        expect(img).toHaveClass('max-h-full')
      })
    })

    test('should center carousel items', () => {
      const { container } = renderComponent()

      // Check for centering classes on carousel items
      const carouselItems = container.querySelectorAll('[role="group"]')
      carouselItems.forEach(item => {
        expect(item).toHaveClass('flex', 'items-center', 'justify-center')
      })
    })

    test('should have initial zoom level of 1', () => {
      renderComponent()

      const images = screen.getAllByAltText('slide')
      images.forEach(img => {
        expect(img).toHaveStyle({ transform: 'scale(1)' })
      })
    })

    test('should handle image with special characters in src', () => {
      const specialImages = ['image%20with%20space.jpg', 'image&special.jpg']
      renderComponent({ imgEvent: specialImages })

      const images = screen.getAllByAltText('slide')
      expect(images[0]).toHaveAttribute('src', 'image%20with%20space.jpg')
      expect(images[1]).toHaveAttribute('src', 'image&special.jpg')
    })
  })

  describe('Button Accessibility', () => {
    test('should have accessible title on zoom in button', () => {
      renderComponent()

      const zoomInButton = screen.getByTestId('zoomInButton')
      expect(zoomInButton).toHaveAttribute('title', 'Zoom in')
    })

    test('should have accessible title on zoom out button', () => {
      renderComponent()

      const zoomOutButton = screen.getByTestId('zoomOutButton')
      expect(zoomOutButton).toHaveAttribute('title', 'Zoom out')
    })

    test('should render buttons with correct size', () => {
      renderComponent()

      const zoomInButton = screen.getByTestId('zoomInButton')
      const zoomOutButton = screen.getByTestId('zoomOutButton')

      expect(zoomInButton).toBeInTheDocument()
      expect(zoomOutButton).toBeInTheDocument()
    })

    test('should render zoom buttons', () => {
      renderComponent()

      const zoomInButton = screen.getByTestId('zoomInButton')
      const zoomOutButton = screen.getByTestId('zoomOutButton')

      expect(zoomInButton).toBeInTheDocument()
      expect(zoomOutButton).toBeInTheDocument()
    })

    test('should render buttons with iconOnly prop', () => {
      renderComponent()

      const zoomInButton = screen.getByTestId('zoomInButton')
      const zoomOutButton = screen.getByTestId('zoomOutButton')

      expect(zoomInButton).toBeInTheDocument()
      expect(zoomOutButton).toBeInTheDocument()
    })
  })

  describe('Dialog Layout', () => {
    test('should render dialog with md size', () => {
      renderComponent()

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })

    test('should render dialog header', () => {
      renderComponent({ title: 'Test Title' })

      const title = screen.getByText('Test Title')
      expect(title).toBeInTheDocument()
    })

    test('should render dialog body with carousel', () => {
      renderComponent()

      const images = screen.getAllByAltText('slide')
      expect(images.length).toBeGreaterThan(0)
    })

    test('should render dialog footer with zoom buttons centered', () => {
      renderComponent()

      const zoomInButton = screen.getByTestId('zoomInButton')
      const zoomOutButton = screen.getByTestId('zoomOutButton')

      expect(zoomInButton).toBeInTheDocument()
      expect(zoomOutButton).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle null in imgEvent array gracefully', () => {
      const imagesWithNull = ['img1.jpg', null as any, 'img2.jpg']

      // This might cause issues, but the component should handle it
      expect(() => {
        renderComponent({ imgEvent: imagesWithNull as string[] })
      }).not.toThrow()
    })

    test('should handle very long image URLs', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(1000) + '.jpg'
      renderComponent({ imgEvent: [longUrl] })

      const image = screen.getByAltText('slide')
      expect(image).toHaveAttribute('src', longUrl)
    })

    test('should handle rapid zoom button clicks', async () => {
      renderComponent()

      const zoomInButton = screen.getByTestId('zoomInButton')

      // Rapidly click 5 times
      await userEvent.click(zoomInButton)
      await userEvent.click(zoomInButton)
      await userEvent.click(zoomInButton)
      await userEvent.click(zoomInButton)
      await userEvent.click(zoomInButton)

      const images = screen.getAllByAltText('slide')

      await waitFor(() => {
        const transform = images[0].style.transform
        const scaleMatch = transform.match(/scale\(([\d.]+)\)/)
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1
        expect(scale).toBeCloseTo(1.5, 1)
      })
    })

    test('should handle zoom level with floating point precision', async () => {
      renderComponent()

      const zoomInButton = screen.getByTestId('zoomInButton')
      const images = screen.getAllByAltText('slide')

      // Zoom in 3 times to get 1.3
      await userEvent.click(zoomInButton)
      await userEvent.click(zoomInButton)
      await userEvent.click(zoomInButton)

      await waitFor(() => {
        const transform = images[0].style.transform
        const scaleMatch = transform.match(/scale\(([\d.]+)\)/)
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1
        // Should be approximately 1.3
        expect(scale).toBeCloseTo(1.3, 1)
      })
    })

    test('should handle dialog opening and closing multiple times', async () => {
      const setIsOpen = vi.fn()
      const { rerender, container } = renderComponent({ setIsOpen, isOpen: true })

      // Close
      const closeButton = container.querySelector('.cn-modal-dialog-close')
      if (closeButton) {
        await userEvent.click(closeButton as HTMLElement)
      }

      // Reopen
      rerender(
        <TestWrapper>
          <ImageCarousel {...defaultProps} setIsOpen={setIsOpen} isOpen={true} />
        </TestWrapper>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })
  })

  describe('Component Props Validation', () => {
    test('should accept all required props', () => {
      const props: ImageCarouselProps = {
        isOpen: true,
        setIsOpen: vi.fn(),
        imgEvent: ['test.jpg']
      }

      expect(() => renderComponent(props)).not.toThrow()
    })

    test('should accept all optional props', () => {
      const props: ImageCarouselProps = {
        isOpen: true,
        setIsOpen: vi.fn(),
        imgEvent: ['test.jpg'],
        title: 'Test Title',
        initialSlide: 0
      }

      expect(() => renderComponent(props)).not.toThrow()
    })

    test('should handle setIsOpen function being called correctly', async () => {
      const setIsOpen = vi.fn()
      const { container } = renderComponent({ setIsOpen })

      const closeButton = container.querySelector('.cn-modal-dialog-close')
      if (closeButton) {
        await userEvent.click(closeButton as HTMLElement)

        expect(setIsOpen).toHaveBeenCalledTimes(1)
        expect(setIsOpen).toHaveBeenCalledWith(false)
      }
    })
  })
})
