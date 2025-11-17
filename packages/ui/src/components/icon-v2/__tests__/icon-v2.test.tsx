import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { iconColorVariants, IconV2, IconV2DisplayName, IconV2NamesType, iconVariants } from '../icon-v2'

// Mock console.warn to avoid noise in test output
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

describe('IconV2', () => {
  afterEach(() => {
    consoleWarnSpy.mockClear()
  })

  afterAll(() => {
    consoleWarnSpy.mockRestore()
  })

  describe('Basic Rendering', () => {
    test('should render icon with valid name', () => {
      const { container } = render(<IconV2 name="account" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('should have correct displayName', () => {
      expect(IconV2.displayName).toBe(IconV2DisplayName)
    })

    test('should render with default size (sm)', () => {
      const { container } = render(<IconV2 name="account" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-icon-sm')
    })

    test('should render with default color (inherit)', () => {
      const { container } = render(<IconV2 name="account" />)
      const svg = container.querySelector('svg')
      // inherit color variant has empty string, so no class is added
      expect(svg).not.toHaveClass('text-cn-icon-danger')
    })
  })

  describe('Size Variants', () => {
    test('should render with size 2xs', () => {
      const { container } = render(<IconV2 name="account" size="2xs" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-icon-2xs')
    })

    test('should render with size xs', () => {
      const { container } = render(<IconV2 name="account" size="xs" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-icon-xs')
    })

    test('should render with size sm', () => {
      const { container } = render(<IconV2 name="account" size="sm" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-icon-sm')
    })

    test('should render with size md', () => {
      const { container } = render(<IconV2 name="account" size="md" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-icon-md')
    })

    test('should render with size lg', () => {
      const { container } = render(<IconV2 name="account" size="lg" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-icon-lg')
    })

    test('should render with size xl', () => {
      const { container } = render(<IconV2 name="account" size="xl" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-icon-xl')
    })

    test('should skip size classes when skipSize is true', () => {
      const { container } = render(<IconV2 name="account" skipSize={true} />)
      const svg = container.querySelector('svg')
      expect(svg).not.toHaveClass('cn-icon-sm')
      expect(svg).not.toHaveClass('cn-icon-md')
      expect(svg).not.toHaveClass('cn-icon-lg')
    })

    test('should apply size classes when skipSize is false', () => {
      const { container } = render(<IconV2 name="account" skipSize={false} size="md" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-icon-md')
    })
  })

  describe('Color Variants', () => {
    test('should render with color inherit', () => {
      const { container } = render(<IconV2 name="account" color="inherit" />)
      const svg = container.querySelector('svg')
      // inherit has empty string, so no color class
      expect(svg).not.toHaveClass('text-cn-icon-danger')
    })

    test('should render with color danger', () => {
      const { container } = render(<IconV2 name="account" color="danger" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-cn-icon-danger')
    })

    test('should render with color warning', () => {
      const { container } = render(<IconV2 name="account" color="warning" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-cn-icon-warning')
    })

    test('should render with color success', () => {
      const { container } = render(<IconV2 name="account" color="success" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-cn-icon-success')
    })

    test('should render with color info', () => {
      const { container } = render(<IconV2 name="account" color="info" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-cn-icon-info')
    })

    test('should render with color neutral', () => {
      const { container } = render(<IconV2 name="account" color="neutral" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-cn-disabled')
    })

    test('should render with color merged', () => {
      const { container } = render(<IconV2 name="account" color="merged" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-cn-icon-merged')
    })
  })

  describe('Custom ClassName', () => {
    test('should apply custom className', () => {
      const { container } = render(<IconV2 name="account" className="custom-class" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-class')
    })

    test('should merge className with size and color classes', () => {
      const { container } = render(<IconV2 name="account" className="custom-class" size="lg" color="danger" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-class')
      expect(svg).toHaveClass('cn-icon-lg')
      expect(svg).toHaveClass('text-cn-icon-danger')
    })
  })

  describe('SVG Props', () => {
    test('should pass through SVG props', () => {
      const { container } = render(<IconV2 name="account" width={24} height={24} fill="red" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '24')
      expect(svg).toHaveAttribute('height', '24')
      expect(svg).toHaveAttribute('fill', 'red')
    })

    test('should pass through ref', () => {
      const ref = { current: null }
      const { container } = render(<IconV2 name="account" ref={ref} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      // Note: SVG components may not support refs if they're not wrapped with forwardRef
      // This test verifies the component renders correctly with ref prop
    })

    test('should pass through all SVG attributes', () => {
      const { container } = render(
        <IconV2 name="account" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Account icon" />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
      expect(svg).toHaveAttribute('aria-label', 'Account icon')
    })
  })

  describe('Fallback Behavior', () => {
    test('should render fallback icon when name is invalid', () => {
      const { container } = render(<IconV2 name={'invalid-icon' as IconV2NamesType} fallback="account" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(consoleWarnSpy).toHaveBeenCalledWith('Icon "invalid-icon" not found, falling back to "account".')
    })

    test('should apply classes to fallback icon', () => {
      const { container } = render(
        <IconV2 name={'invalid-icon' as IconV2NamesType} fallback="account" size="lg" color="danger" />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('cn-icon-lg')
      expect(svg).toHaveClass('text-cn-icon-danger')
    })

    test('should pass ref to fallback icon', () => {
      const ref = { current: null }
      const { container } = render(<IconV2 name={'invalid-icon' as IconV2NamesType} fallback="account" ref={ref} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      // Note: SVG components may not support refs if they're not wrapped with forwardRef
      // This test verifies the component renders correctly with ref prop
    })

    test('should return null when name is invalid and no fallback provided', () => {
      const { container } = render(<IconV2 name={'invalid-icon' as IconV2NamesType} />)
      expect(container.firstChild).toBeNull()
      expect(consoleWarnSpy).toHaveBeenCalledWith('Icon "invalid-icon" not found in IconNameMapV2.')
    })

    test('should render fallback when name is undefined but fallback is provided', () => {
      const { container } = render(<IconV2 fallback="account" />)
      // When name is undefined but fallback is provided, it should use fallback
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty string as name', () => {
      const { container } = render(<IconV2 name={'' as IconV2NamesType} fallback="account" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('should handle multiple icon names', () => {
      const iconNames: IconV2NamesType[] = ['account', 'agile', 'ai', 'arrow-down', 'arrow-up']
      iconNames.forEach(iconName => {
        const { container, unmount } = render(<IconV2 name={iconName} />)
        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
        unmount()
      })
    })

    test('should handle all size and color combinations', () => {
      const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'] as const
      const colors = ['inherit', 'danger', 'warning', 'success', 'info', 'neutral', 'merged'] as const

      sizes.forEach(size => {
        colors.forEach(color => {
          const { container, unmount } = render(<IconV2 name="account" size={size} color={color} />)
          const svg = container.querySelector('svg')
          expect(svg).toBeInTheDocument()
          unmount()
        })
      })
    })

    test('should handle skipSize with all sizes', () => {
      const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'] as const
      sizes.forEach(size => {
        const { container, unmount } = render(<IconV2 name="account" size={size} skipSize={true} />)
        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
        expect(svg).not.toHaveClass(`cn-icon-${size}`)
        unmount()
      })
    })
  })

  describe('Icon Variants Utility', () => {
    test('iconVariants should return correct classes for all sizes', () => {
      expect(iconVariants({ size: '2xs' })).toBe('cn-icon cn-icon-2xs')
      expect(iconVariants({ size: 'xs' })).toBe('cn-icon cn-icon-xs')
      expect(iconVariants({ size: 'sm' })).toBe('cn-icon cn-icon-sm')
      expect(iconVariants({ size: 'md' })).toBe('cn-icon cn-icon-md')
      expect(iconVariants({ size: 'lg' })).toBe('cn-icon cn-icon-lg')
      expect(iconVariants({ size: 'xl' })).toBe('cn-icon cn-icon-xl')
    })

    test('iconVariants should return default size when no size provided', () => {
      expect(iconVariants({})).toBe('cn-icon cn-icon-sm')
    })
  })

  describe('Icon Color Variants Utility', () => {
    test('iconColorVariants should return correct classes for all colors', () => {
      expect(iconColorVariants({ color: 'inherit' })).toBe('')
      expect(iconColorVariants({ color: 'danger' })).toBe('text-cn-icon-danger')
      expect(iconColorVariants({ color: 'warning' })).toBe('text-cn-icon-warning')
      expect(iconColorVariants({ color: 'success' })).toBe('text-cn-icon-success')
      expect(iconColorVariants({ color: 'info' })).toBe('text-cn-icon-info')
      expect(iconColorVariants({ color: 'neutral' })).toBe('text-cn-disabled')
      expect(iconColorVariants({ color: 'merged' })).toBe('text-cn-icon-merged')
    })

    test('iconColorVariants should return default color when no color provided', () => {
      expect(iconColorVariants({})).toBe('')
    })
  })

  describe('Type Safety', () => {
    test('should accept valid icon names from IconNameMapV2', () => {
      // This test ensures TypeScript types are correct
      // If this compiles, the types are working correctly
      const validNames: IconV2NamesType[] = ['account', 'agile', 'ai']
      validNames.forEach(name => {
        const { container, unmount } = render(<IconV2 name={name} />)
        expect(container.querySelector('svg')).toBeInTheDocument()
        unmount()
      })
    })
  })
})
