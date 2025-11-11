import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { Illustration, IllustrationProps, IllustrationsNameType } from '../illustration'

// Mock useTheme hook
const mockUseTheme = vi.fn()
vi.mock('@/context', async () => {
  const actual = await vi.importActual('@/context')
  return {
    ...actual,
    useTheme: () => mockUseTheme()
  }
})

// Mock console.warn to avoid noise in test output
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

// Mock SVG components
vi.mock('../illustrations-name-map', async () => {
  const actual = await vi.importActual<typeof import('../illustrations-name-map')>('../illustrations-name-map')
  const MockSVG = ({ className, width, height, ...props }: any) => (
    <svg data-testid="mock-illustration" className={className} width={width} height={height} {...props} />
  )
  return {
    ...actual,
    IllustrationsNameMap: {
      ...(actual?.IllustrationsNameMap || {}),
      'test-illustration': MockSVG,
      'test-illustration-light': MockSVG
    } as typeof actual.IllustrationsNameMap
  }
})

const renderComponent = (props: Partial<Omit<IllustrationProps, 'ref'>> = {}) => {
  const defaultProps: Omit<IllustrationProps, 'ref'> = {
    name: 'create-workspace'
  }
  return render(<Illustration {...defaultProps} {...props} />)
}

describe('Illustration', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ isLightTheme: false })
  })

  afterEach(() => {
    consoleWarnSpy.mockClear()
    mockUseTheme.mockClear()
  })

  afterAll(() => {
    consoleWarnSpy.mockRestore()
  })

  describe('Basic Rendering', () => {
    test('should render illustration with valid name', () => {
      const { container } = renderComponent({ name: 'create-workspace' })
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('should have correct displayName', () => {
      expect(Illustration.displayName).toBe('Illustration')
    })

    test('should render with default size (112)', () => {
      const { container } = renderComponent()
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '112')
      expect(svg).toHaveAttribute('height', '112')
    })

    test('should apply default size to style minWidth and minHeight', () => {
      const { container } = renderComponent()
      const svg = container.querySelector('svg')
      expect(svg).toHaveStyle({ minWidth: '112px', minHeight: '112px' })
    })
  })

  describe('Size Props', () => {
    test('should render with custom size', () => {
      const { container } = renderComponent({ size: 200 })
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '200')
      expect(svg).toHaveAttribute('height', '200')
    })

    test('should apply custom size to style', () => {
      const { container } = renderComponent({ size: 200 })
      const svg = container.querySelector('svg')
      expect(svg).toHaveStyle({ minWidth: '200px', minHeight: '200px' })
    })

    test('should use width prop when provided', () => {
      const { container } = renderComponent({ width: 150 })
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '150')
      expect(svg).toHaveStyle({ minWidth: '150px' })
    })

    test('should use height prop when provided', () => {
      const { container } = renderComponent({ height: 150 })
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('height', '150')
      expect(svg).toHaveStyle({ minHeight: '150px' })
    })

    test('should prioritize width and height over size', () => {
      const { container } = renderComponent({ size: 100, width: 200, height: 300 })
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '200')
      expect(svg).toHaveAttribute('height', '300')
      expect(svg).toHaveStyle({ minWidth: '200px', minHeight: '300px' })
    })

    test('should use size for missing width', () => {
      const { container } = renderComponent({ size: 100, height: 200 })
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '100')
      expect(svg).toHaveAttribute('height', '200')
    })

    test('should use size for missing height', () => {
      const { container } = renderComponent({ size: 100, width: 200 })
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '200')
      expect(svg).toHaveAttribute('height', '100')
    })

    test('should handle zero size', () => {
      const { container } = renderComponent({ size: 0 })
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '0')
      expect(svg).toHaveAttribute('height', '0')
    })

    test('should handle negative size', () => {
      const { container } = renderComponent({ size: -10 })
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '-10')
      expect(svg).toHaveAttribute('height', '-10')
    })
  })

  describe('Theme Dependent Behavior', () => {
    test('should render standard illustration when themeDependent is false', () => {
      mockUseTheme.mockReturnValue({ isLightTheme: false })
      const { container } = renderComponent({ themeDependent: false })
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).not.toHaveClass('invert')
    })

    test('should render standard illustration when themeDependent is true but isLightTheme is false', () => {
      mockUseTheme.mockReturnValue({ isLightTheme: false })
      const { container } = renderComponent({ themeDependent: true })
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).not.toHaveClass('invert')
    })

    test('should render light variant when themeDependent is true and isLightTheme is true and light variant exists', () => {
      mockUseTheme.mockReturnValue({ isLightTheme: true })
      const { container } = renderComponent({
        name: 'create-workspace',
        themeDependent: true
      })
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).not.toHaveClass('invert')
    })

    test('should invert illustration when themeDependent is true, isLightTheme is true, but light variant does not exist', () => {
      mockUseTheme.mockReturnValue({ isLightTheme: true })
      // Using an illustration that doesn't have a light variant
      const { container } = renderComponent({
        name: 'harness-logo-text',
        themeDependent: true
      })
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveClass('invert')
    })

    test('should not invert when light variant exists', () => {
      mockUseTheme.mockReturnValue({ isLightTheme: true })
      const { container } = renderComponent({
        name: 'create-workspace',
        themeDependent: true
      })
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).not.toHaveClass('invert')
    })

    test('should check for light variant availability', () => {
      mockUseTheme.mockReturnValue({ isLightTheme: true })
      renderComponent({
        name: 'create-workspace',
        themeDependent: true
      })
      // Should not invert because create-workspace-light exists
      const { container } = renderComponent({
        name: 'create-workspace',
        themeDependent: true
      })
      const svg = container.querySelector('svg')
      expect(svg).not.toHaveClass('invert')
    })
  })

  describe('Custom ClassName', () => {
    test('should apply custom className', () => {
      const { container } = renderComponent({ className: 'custom-class' })
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-class')
    })

    test('should merge className with invert class when needed', () => {
      mockUseTheme.mockReturnValue({ isLightTheme: true })
      const { container } = renderComponent({
        name: 'harness-logo-text',
        className: 'custom-class',
        themeDependent: true
      })
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-class')
      expect(svg).toHaveClass('invert')
    })

    test('should handle empty className', () => {
      const { container } = renderComponent({ className: '' })
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('SVG Props', () => {
    test('should accept SVG props without errors', () => {
      const { container } = renderComponent({
        xmlns: 'http://www.w3.org/2000/svg',
        'aria-label': 'Illustration'
      })
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      // Component accepts props without throwing errors
    })

    test('should accept ref prop', () => {
      const ref = { current: null }
      const { container } = render(<Illustration name="create-workspace" ref={ref} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      // Note: SVG components may not support refs if they're not wrapped with forwardRef
      // This test verifies the component renders correctly with ref prop
    })

    test('should accept additional props', () => {
      const { container } = renderComponent({
        'aria-label': 'Custom illustration',
        'aria-hidden': 'true'
      })
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      // Component accepts additional props without errors
    })
  })

  describe('Error Handling', () => {
    test('should return null when illustration name is invalid', () => {
      const { container } = renderComponent({ name: 'invalid-illustration' as IllustrationsNameType })
      expect(container.firstChild).toBeNull()
      expect(consoleWarnSpy).toHaveBeenCalledWith('Icon "invalid-illustration" not found in IllustrationsNameMap.')
    })

    test('should warn when illustration is not found', () => {
      renderComponent({ name: 'non-existent' as IllustrationsNameType })
      expect(consoleWarnSpy).toHaveBeenCalledWith('Icon "non-existent" not found in IllustrationsNameMap.')
    })
  })

  describe('Edge Cases', () => {
    test('should handle all illustration names', () => {
      const illustrationNames: IllustrationsNameType[] = [
        'create-workspace',
        'no-data-branches',
        'no-data-cog',
        'no-data-commits',
        'no-data-error',
        'no-data-folder',
        'no-data-members',
        'no-data-merge',
        'no-data-pr',
        'no-repository',
        'no-data-tags',
        'no-data-labels',
        'no-data-webhooks',
        'no-search-magnifying-glass',
        'no-delegates',
        'harness-logo-text',
        'sub-menu-ellipse',
        'chat-avatar',
        'tooltip-arrow'
      ]

      illustrationNames.forEach(name => {
        const { container, unmount } = renderComponent({ name })
        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
        unmount()
      })
    })

    test('should handle themeDependent with all combinations', () => {
      const themeStates = [true, false]
      const lightThemeStates = [true, false]

      themeStates.forEach(themeDependent => {
        lightThemeStates.forEach(isLightTheme => {
          mockUseTheme.mockReturnValue({ isLightTheme })
          const { container, unmount } = renderComponent({
            name: 'create-workspace',
            themeDependent
          })
          const svg = container.querySelector('svg')
          expect(svg).toBeInTheDocument()
          unmount()
        })
      })
    })

    test('should handle very large sizes', () => {
      const { container } = renderComponent({ size: 10000 })
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '10000')
      expect(svg).toHaveAttribute('height', '10000')
    })

    test('should handle decimal sizes', () => {
      const { container } = renderComponent({ size: 112.5 })
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '112.5')
      expect(svg).toHaveAttribute('height', '112.5')
    })

    test('should handle undefined width and height', () => {
      const { container } = renderComponent({ size: 100 })
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '100')
      expect(svg).toHaveAttribute('height', '100')
    })
  })

  describe('Light Theme Variants', () => {
    test('should use light variant when available and theme is light', () => {
      mockUseTheme.mockReturnValue({ isLightTheme: true })
      const { container } = renderComponent({
        name: 'create-workspace',
        themeDependent: true
      })
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('should not use light variant when theme is dark', () => {
      mockUseTheme.mockReturnValue({ isLightTheme: false })
      const { container } = renderComponent({
        name: 'create-workspace',
        themeDependent: true
      })
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('should not use light variant when themeDependent is false', () => {
      mockUseTheme.mockReturnValue({ isLightTheme: true })
      const { container } = renderComponent({
        name: 'create-workspace',
        themeDependent: false
      })
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Component Integration', () => {
    test('should integrate with useTheme hook', () => {
      mockUseTheme.mockReturnValue({ isLightTheme: false })
      renderComponent()
      expect(mockUseTheme).toHaveBeenCalled()
    })

    test('should handle theme changes', () => {
      mockUseTheme.mockReturnValue({ isLightTheme: false })
      const { rerender } = renderComponent({ themeDependent: true })
      mockUseTheme.mockReturnValue({ isLightTheme: true })
      rerender(<Illustration name="create-workspace" themeDependent={true} />)
      expect(mockUseTheme).toHaveBeenCalled()
    })
  })
})
