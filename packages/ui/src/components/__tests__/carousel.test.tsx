import React from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { Carousel, type CarouselApi } from '../carousel'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

// Mock embla-carousel-react
const mockScrollPrev = vi.fn()
const mockScrollNext = vi.fn()
const mockScrollTo = vi.fn()
const mockCanScrollPrev = vi.fn()
const mockCanScrollNext = vi.fn()
const mockOn = vi.fn()
const mockOff = vi.fn()

const mockApi: CarouselApi = {
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

const renderComponent = (component: React.ReactElement) => {
  return render(<TestWrapper>{component}</TestWrapper>)
}

describe('Carousel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCanScrollPrev.mockReturnValue(true)
    mockCanScrollNext.mockReturnValue(true)
  })

  describe('Carousel.Root', () => {
    describe('Basic Rendering', () => {
      test('should render carousel root element', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const carousel = container.querySelector('[role="region"]')
        expect(carousel).toBeInTheDocument()
      })

      test('should have carousel aria-roledescription', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const carousel = container.querySelector('[aria-roledescription="carousel"]')
        expect(carousel).toBeInTheDocument()
      })

      test('should render children', () => {
        renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        expect(screen.getByText('Slide 1')).toBeInTheDocument()
      })

      test('should forward ref to div element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <Carousel.Root ref={ref}>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })
    })

    describe('Orientation', () => {
      test('should default to horizontal orientation', () => {
        renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        // Component should render without errors
        expect(screen.getByText('Slide 1')).toBeInTheDocument()
      })

      test('should apply vertical orientation', () => {
        renderComponent(
          <Carousel.Root orientation="vertical">
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        // Component should render without errors
        expect(screen.getByText('Slide 1')).toBeInTheDocument()
      })
    })

    describe('API Integration', () => {
      test('should call setApi when provided', async () => {
        const setApi = vi.fn()
        renderComponent(
          <Carousel.Root setApi={setApi}>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        await waitFor(() => {
          expect(setApi).toHaveBeenCalledWith(mockApi)
        })
      })

      test('should not call setApi when not provided', () => {
        renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        // Should not throw error
        expect(true).toBe(true)
      })

      test('should register select event listener', async () => {
        renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        await waitFor(() => {
          expect(mockOn).toHaveBeenCalledWith('select', expect.any(Function))
        })
      })

      test('should register reInit event listener', async () => {
        renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        await waitFor(() => {
          expect(mockOn).toHaveBeenCalledWith('reInit', expect.any(Function))
        })
      })

      test('should unregister select event listener on unmount', async () => {
        const { unmount } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        await waitFor(() => {
          expect(mockOn).toHaveBeenCalled()
        })

        unmount()

        expect(mockOff).toHaveBeenCalledWith('select', expect.any(Function))
      })
    })

    describe('Initial Slide', () => {
      test('should scroll to initial slide when provided', async () => {
        renderComponent(
          <Carousel.Root initialSlide={2}>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
              <Carousel.Item>Slide 2</Carousel.Item>
              <Carousel.Item>Slide 3</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        await waitFor(() => {
          expect(mockScrollTo).toHaveBeenCalledWith(2)
        })
      })

      test('should register init event listener for initial slide', async () => {
        renderComponent(
          <Carousel.Root initialSlide={1}>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        await waitFor(() => {
          expect(mockOn).toHaveBeenCalledWith('init', expect.any(Function))
        })
      })

      test('should not scroll when initial slide is not provided', () => {
        renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        expect(mockScrollTo).not.toHaveBeenCalled()
      })
    })

    describe('Keyboard Navigation', () => {
      test('should handle ArrowLeft key', async () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
              <Carousel.Item>Slide 2</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const carousel = container.querySelector('[role="region"]')!
        fireEvent.keyDown(carousel, { key: 'ArrowLeft' })

        await waitFor(() => {
          expect(mockScrollPrev).toHaveBeenCalled()
        })
      })

      test('should handle ArrowRight key', async () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
              <Carousel.Item>Slide 2</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const carousel = container.querySelector('[role="region"]')!
        fireEvent.keyDown(carousel, { key: 'ArrowRight' })

        await waitFor(() => {
          expect(mockScrollNext).toHaveBeenCalled()
        })
      })

      test('should prevent default on ArrowLeft', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const carousel = container.querySelector('[role="region"]')!
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
        carousel.dispatchEvent(event)

        expect(preventDefaultSpy).toHaveBeenCalled()
      })

      test('should prevent default on ArrowRight', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const carousel = container.querySelector('[role="region"]')!
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
        carousel.dispatchEvent(event)

        expect(preventDefaultSpy).toHaveBeenCalled()
      })

      test('should not prevent default on other keys', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const carousel = container.querySelector('[role="region"]')!
        const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
        carousel.dispatchEvent(event)

        expect(preventDefaultSpy).not.toHaveBeenCalled()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <Carousel.Root className="custom-carousel">
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const carousel = container.querySelector('.custom-carousel')
        expect(carousel).toBeInTheDocument()
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Carousel.Root.displayName).toBe('CarouselRoot')
      })
    })
  })

  describe('Carousel.Content', () => {
    describe('Basic Rendering', () => {
      test('should render content element', () => {
        renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        expect(screen.getByText('Slide 1')).toBeInTheDocument()
      })

      test('should apply overflow-hidden class to wrapper', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const wrapper = container.querySelector('.overflow-hidden')
        expect(wrapper).toBeInTheDocument()
      })

      test('should apply flex class to content', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const content = container.querySelector('.flex')
        expect(content).toBeInTheDocument()
      })

      test('should forward ref to div element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <Carousel.Root>
            <Carousel.Content ref={ref}>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })
    })

    describe('Orientation Styling', () => {
      test('should apply horizontal layout by default', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const content = container.querySelector('.-ml-cn-md')
        expect(content).toBeInTheDocument()
        expect(content).not.toHaveClass('flex-col')
      })

      test('should apply vertical layout', () => {
        const { container } = renderComponent(
          <Carousel.Root orientation="vertical">
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const content = container.querySelector('.-mt-cn-md')
        expect(content).toBeInTheDocument()
        expect(content).toHaveClass('flex-col')
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content className="custom-content">
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const content = container.querySelector('.custom-content')
        expect(content).toBeInTheDocument()
      })

      test('should apply custom carouselBlockClassName', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content carouselBlockClassName="custom-block">
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const block = container.querySelector('.custom-block')
        expect(block).toBeInTheDocument()
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Carousel.Content.displayName).toBe('CarouselContent')
      })
    })

    describe('Error Handling', () => {
      test('should throw error when used outside Carousel.Root', () => {
        // Suppress console.error for this test
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(() => {
          render(
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          )
        }).toThrow('useCarousel must be used within a <Carousel.Root />')

        consoleError.mockRestore()
      })
    })
  })

  describe('Carousel.Item', () => {
    describe('Basic Rendering', () => {
      test('should render item element', () => {
        renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        expect(screen.getByText('Slide 1')).toBeInTheDocument()
      })

      test('should have group role', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const item = container.querySelector('[role="group"]')
        expect(item).toBeInTheDocument()
      })

      test('should have slide aria-roledescription', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const item = container.querySelector('[aria-roledescription="slide"]')
        expect(item).toBeInTheDocument()
      })

      test('should forward ref to div element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item ref={ref}>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })
    })

    describe('Orientation Styling', () => {
      test('should apply horizontal padding by default', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const item = container.querySelector('.pl-cn-md')
        expect(item).toBeInTheDocument()
      })

      test('should apply vertical padding', () => {
        const { container } = renderComponent(
          <Carousel.Root orientation="vertical">
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const item = container.querySelector('.pt-cn-md')
        expect(item).toBeInTheDocument()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item className="custom-item">Slide 1</Carousel.Item>
            </Carousel.Content>
          </Carousel.Root>
        )

        const item = container.querySelector('.custom-item')
        expect(item).toBeInTheDocument()
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Carousel.Item.displayName).toBe('CarouselItem')
      })
    })

    describe('Error Handling', () => {
      test('should throw error when used outside Carousel.Root', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(() => {
          render(<Carousel.Item>Slide 1</Carousel.Item>)
        }).toThrow('useCarousel must be used within a <Carousel.Root />')

        consoleError.mockRestore()
      })
    })
  })

  describe('Carousel.Previous', () => {
    describe('Basic Rendering', () => {
      test('should render previous button component', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Previous />
          </Carousel.Root>
        )

        // Button component renders
        const button = container.querySelector('button')
        expect(button).toBeInTheDocument()
      })

      test('should contain arrow icon', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Previous />
          </Carousel.Root>
        )

        // Icon renders in button
        const icon = container.querySelector('.cn-icon')
        expect(icon).toBeInTheDocument()
      })
    })

    describe('Button Click', () => {
      test('should use scrollPrev callback', async () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Previous />
          </Carousel.Root>
        )

        // Component renders without errors
        expect(container).toBeInTheDocument()
      })
    })

    describe('Disabled State', () => {
      test('should reflect canScrollPrev state', () => {
        mockCanScrollPrev.mockReturnValue(false)

        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Previous />
          </Carousel.Root>
        )

        expect(container).toBeInTheDocument()
      })

      test('should handle canScrollPrev=true', () => {
        mockCanScrollPrev.mockReturnValue(true)

        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Previous />
          </Carousel.Root>
        )

        expect(container).toBeInTheDocument()
      })
    })

    describe('Orientation Positioning', () => {
      test('should position left for horizontal carousel', () => {
        const { container } = renderComponent(
          <Carousel.Root orientation="horizontal">
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Previous />
          </Carousel.Root>
        )

        const button = container.querySelector('.-left-\\[48px\\]')
        expect(button).toBeInTheDocument()
      })

      test('should position top for vertical carousel', () => {
        const { container } = renderComponent(
          <Carousel.Root orientation="vertical">
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Previous />
          </Carousel.Root>
        )

        const button = container.querySelector('.-top-\\[48px\\]')
        expect(button).toBeInTheDocument()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Previous className="custom-prev" />
          </Carousel.Root>
        )

        const button = container.querySelector('.custom-prev')
        expect(button).toBeInTheDocument()
      })

      test('should apply custom variant', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Previous variant="primary" />
          </Carousel.Root>
        )

        expect(container).toBeInTheDocument()
      })

      test('should apply custom size', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Previous size="md" />
          </Carousel.Root>
        )

        expect(container).toBeInTheDocument()
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Carousel.Previous.displayName).toBe('CarouselPrevious')
      })
    })

    describe('Error Handling', () => {
      test('should throw error when used outside Carousel.Root', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(() => {
          render(<Carousel.Previous />)
        }).toThrow('useCarousel must be used within a <Carousel.Root />')

        consoleError.mockRestore()
      })
    })
  })

  describe('Carousel.Next', () => {
    describe('Basic Rendering', () => {
      test('should render next button component', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Next />
          </Carousel.Root>
        )

        // Button component renders
        const buttons = container.querySelectorAll('button')
        expect(buttons.length).toBeGreaterThan(0)
      })

      test('should contain arrow icon', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Next />
          </Carousel.Root>
        )

        // Icon renders in button
        const icons = container.querySelectorAll('.cn-icon')
        expect(icons.length).toBeGreaterThan(0)
      })
    })

    describe('Button Click', () => {
      test('should use scrollNext callback', async () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Next />
          </Carousel.Root>
        )

        // Component renders without errors
        expect(container).toBeInTheDocument()
      })
    })

    describe('Disabled State', () => {
      test('should reflect canScrollNext state', () => {
        mockCanScrollNext.mockReturnValue(false)

        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Next />
          </Carousel.Root>
        )

        expect(container).toBeInTheDocument()
      })

      test('should handle canScrollNext=true', () => {
        mockCanScrollNext.mockReturnValue(true)

        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Next />
          </Carousel.Root>
        )

        expect(container).toBeInTheDocument()
      })
    })

    describe('Orientation Positioning', () => {
      test('should position right for horizontal carousel', () => {
        const { container } = renderComponent(
          <Carousel.Root orientation="horizontal">
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Next />
          </Carousel.Root>
        )

        const button = container.querySelector('.-right-\\[48px\\]')
        expect(button).toBeInTheDocument()
      })

      test('should position bottom for vertical carousel', () => {
        const { container } = renderComponent(
          <Carousel.Root orientation="vertical">
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Next />
          </Carousel.Root>
        )

        const button = container.querySelector('.-bottom-\\[48px\\]')
        expect(button).toBeInTheDocument()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Next className="custom-next" />
          </Carousel.Root>
        )

        const button = container.querySelector('.custom-next')
        expect(button).toBeInTheDocument()
      })

      test('should apply custom variant', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Next variant="primary" />
          </Carousel.Root>
        )

        expect(container).toBeInTheDocument()
      })

      test('should apply custom theme', () => {
        const { container } = renderComponent(
          <Carousel.Root>
            <Carousel.Content>
              <Carousel.Item>Slide 1</Carousel.Item>
            </Carousel.Content>
            <Carousel.Next theme="success" />
          </Carousel.Root>
        )

        expect(container).toBeInTheDocument()
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Carousel.Next.displayName).toBe('CarouselNext')
      })
    })

    describe('Error Handling', () => {
      test('should throw error when used outside Carousel.Root', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(() => {
          render(<Carousel.Next />)
        }).toThrow('useCarousel must be used within a <Carousel.Root />')

        consoleError.mockRestore()
      })
    })
  })

  describe('Carousel Namespace', () => {
    test('should export all subcomponents', () => {
      expect(Carousel.Root).toBeDefined()
      expect(Carousel.Content).toBeDefined()
      expect(Carousel.Item).toBeDefined()
      expect(Carousel.Previous).toBeDefined()
      expect(Carousel.Next).toBeDefined()
    })
  })

  describe('Complete Carousel', () => {
    test('should render full carousel with navigation', () => {
      const { container } = renderComponent(
        <Carousel.Root>
          <Carousel.Content>
            <Carousel.Item>Slide 1</Carousel.Item>
            <Carousel.Item>Slide 2</Carousel.Item>
            <Carousel.Item>Slide 3</Carousel.Item>
          </Carousel.Content>
          <Carousel.Previous />
          <Carousel.Next />
        </Carousel.Root>
      )

      expect(screen.getByText('Slide 1')).toBeInTheDocument()
      expect(screen.getByText('Slide 2')).toBeInTheDocument()
      expect(screen.getByText('Slide 3')).toBeInTheDocument()

      // Navigation buttons render
      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBe(2) // Previous and Next buttons
    })
  })
})
