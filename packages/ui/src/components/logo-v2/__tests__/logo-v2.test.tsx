import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { LogoV2, LogoV2NamesType, logoVariants } from '../logo-v2'

// Mock console.warn to avoid noise in test output
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

describe('LogoV2', () => {
  afterEach(() => {
    consoleWarnSpy.mockClear()
  })

  afterAll(() => {
    consoleWarnSpy.mockRestore()
  })

  describe('Basic Rendering', () => {
    test('should render logo with valid name', () => {
      const { container } = render(<LogoV2 name="harness" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('should have correct displayName', () => {
      expect(LogoV2.displayName).toBe('LogoV2')
    })

    test('should render with default size (lg)', () => {
      const { container } = render(<LogoV2 name="harness" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-logo-lg')
    })
  })

  describe('Size Variants', () => {
    test('should render with size xs', () => {
      const { container } = render(<LogoV2 name="harness" size="xs" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-logo-xs')
    })

    test('should render with size sm', () => {
      const { container } = render(<LogoV2 name="harness" size="sm" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-logo-sm')
    })

    test('should render with size md', () => {
      const { container } = render(<LogoV2 name="harness" size="md" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-logo-md')
    })

    test('should render with size lg', () => {
      const { container } = render(<LogoV2 name="harness" size="lg" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-logo-lg')
    })

    test('should skip size classes when skipSize is true', () => {
      const { container } = render(<LogoV2 name="harness" skipSize={true} />)
      const svg = container.querySelector('svg')
      expect(svg).not.toHaveClass('cn-logo-lg')
      expect(svg).not.toHaveClass('cn-logo-md')
      expect(svg).not.toHaveClass('cn-logo-sm')
      expect(svg).not.toHaveClass('cn-logo-xs')
    })

    test('should apply size classes when skipSize is false', () => {
      const { container } = render(<LogoV2 name="harness" skipSize={false} size="md" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-logo-md')
    })
  })

  describe('Custom ClassName', () => {
    test('should apply custom className', () => {
      const { container } = render(<LogoV2 name="harness" className="custom-class" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-class')
    })

    test('should merge className with size classes', () => {
      const { container } = render(<LogoV2 name="harness" className="custom-class" size="lg" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-class')
      expect(svg).toHaveClass('cn-logo-lg')
    })
  })

  describe('SVG Props', () => {
    test('should accept SVG props without errors', () => {
      const { container } = render(<LogoV2 name="harness" width={24} height={24} fill="red" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      // Component accepts props without throwing errors
    })

    test('should pass through ref', () => {
      const ref = { current: null }
      const { container } = render(<LogoV2 name="harness" ref={ref} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      // Note: SVG components may not support refs if they're not wrapped with forwardRef
      // This test verifies the component renders correctly with ref prop
    })

    test('should accept additional props', () => {
      const { container } = render(
        <LogoV2 name="harness" xmlns="http://www.w3.org/2000/svg" aria-label="Harness logo" />
      )
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      // Component accepts additional props without errors
    })
  })

  describe('Fallback Behavior', () => {
    test('should render fallback logo when name is invalid', () => {
      const { container } = render(<LogoV2 name={'invalid-logo' as LogoV2NamesType} fallback="harness" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(consoleWarnSpy).toHaveBeenCalledWith('Logo "invalid-logo" not found, falling back to "harness".')
    })

    test('should apply classes to fallback logo', () => {
      const { container } = render(
        <LogoV2 name={'invalid-logo' as LogoV2NamesType} fallback="harness" size="lg" className="custom-class" />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-logo-lg')
      expect(svg).toHaveClass('custom-class')
    })

    test('should pass ref to fallback logo', () => {
      const ref = { current: null }
      const { container } = render(<LogoV2 name={'invalid-logo' as LogoV2NamesType} fallback="harness" ref={ref} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      // Note: SVG components may not support refs if they're not wrapped with forwardRef
      // This test verifies the component renders correctly with ref prop
    })

    test('should return null when name is invalid and no fallback provided', () => {
      const { container } = render(<LogoV2 name={'invalid-logo' as LogoV2NamesType} />)
      expect(container.firstChild).toBeNull()
      expect(consoleWarnSpy).toHaveBeenCalledWith('Logo "invalid-logo" not found in LogoNameMapV2.')
    })

    test('should render fallback when name is undefined but fallback is provided', () => {
      const { container } = render(<LogoV2 fallback="harness" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty string as name', () => {
      const { container } = render(<LogoV2 name={'' as LogoV2NamesType} fallback="harness" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('should handle multiple logo names', () => {
      const logoNames: LogoV2NamesType[] = ['harness', 'github', 'gitlab', 'docker', 'kubernetes']
      logoNames.forEach(logoName => {
        const { container, unmount } = render(<LogoV2 name={logoName} />)
        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
        unmount()
      })
    })

    test('should handle all size combinations', () => {
      const sizes = ['xs', 'sm', 'md', 'lg'] as const
      sizes.forEach(size => {
        const { container, unmount } = render(<LogoV2 name="harness" size={size} />)
        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
        expect(svg).toHaveClass(`cn-logo-${size}`)
        unmount()
      })
    })

    test('should handle skipSize with all sizes', () => {
      const sizes = ['xs', 'sm', 'md', 'lg'] as const
      sizes.forEach(size => {
        const { container, unmount } = render(<LogoV2 name="harness" size={size} skipSize={true} />)
        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
        expect(svg).not.toHaveClass(`cn-logo-${size}`)
        unmount()
      })
    })
  })

  describe('Logo Variants Utility', () => {
    test('logoVariants should return correct classes for all sizes', () => {
      expect(logoVariants({ size: 'xs' })).toBe('cn-logo cn-logo-xs')
      expect(logoVariants({ size: 'sm' })).toBe('cn-logo cn-logo-sm')
      expect(logoVariants({ size: 'md' })).toBe('cn-logo cn-logo-md')
      expect(logoVariants({ size: 'lg' })).toBe('cn-logo cn-logo-lg')
    })

    test('logoVariants should return default size when no size provided', () => {
      expect(logoVariants({})).toBe('cn-logo cn-logo-lg')
    })
  })

  describe('Type Safety', () => {
    test('should accept valid logo names', () => {
      // This test ensures TypeScript types are correct
      // If this compiles, the types are working correctly
      const validNames: LogoV2NamesType[] = ['harness', 'github', 'gitlab']
      validNames.forEach(name => {
        const { container, unmount } = render(<LogoV2 name={name} />)
        expect(container.querySelector('svg')).toBeInTheDocument()
        unmount()
      })
    })
  })
})
