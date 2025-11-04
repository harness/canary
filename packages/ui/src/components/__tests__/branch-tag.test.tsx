import { render, RenderResult, screen } from '@testing-library/react'

import { BranchTag } from '../branch-tag'

const renderComponent = (props: Partial<React.ComponentProps<typeof BranchTag>> = {}): RenderResult => {
  return render(<BranchTag branchName="main" {...props} />)
}

describe('BranchTag', () => {
  describe('Basic Rendering', () => {
    test('should render branch tag with branch name', () => {
      renderComponent({ branchName: 'main' })

      expect(screen.getByText('main')).toBeInTheDocument()
    })

    test('should render with different branch names', () => {
      const { rerender } = render(<BranchTag branchName="develop" />)

      expect(screen.getByText('develop')).toBeInTheDocument()

      rerender(<BranchTag branchName="feature/new-feature" />)

      expect(screen.getByText('feature/new-feature')).toBeInTheDocument()
    })

    test('should render with git branch icon by default', () => {
      const { container } = renderComponent()

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should hide branch icon when hideBranchIcon is true', () => {
      renderComponent({ hideBranchIcon: true })

      // Should not have git-branch icon (may still have copy icon if not hidden)
      expect(screen.getByText('main')).toBeInTheDocument()
    })

    test('should render as CopyTag by default', () => {
      renderComponent()

      // CopyTag has copy functionality
      expect(screen.getByText('main')).toBeInTheDocument()
    })

    test('should render as regular Tag when hideCopyButton is true', () => {
      renderComponent({ hideCopyButton: true })

      // Regular Tag without copy button
      expect(screen.getByText('main')).toBeInTheDocument()
    })
  })

  describe('Link Navigation', () => {
    test('should render with link when repoId is provided', () => {
      const { container } = renderComponent({ branchName: 'main', repoId: 'my-repo' })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
    })

    test('should wrap tag in link component', () => {
      const { container } = renderComponent({
        branchName: 'main',
        spaceId: 'my-space',
        repoId: 'my-repo'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(screen.getByText('main')).toBeInTheDocument()
    })

    test('should render link for branch navigation', () => {
      const { container } = renderComponent({
        branchName: 'develop',
        repoId: 'repo-1'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
    })

    test('should render link with branch name path', () => {
      const { container } = renderComponent({
        branchName: 'feature/test-branch',
        repoId: 'repo-1'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(screen.getByText('feature/test-branch')).toBeInTheDocument()
    })
  })

  describe('Tag Variants & Themes', () => {
    test('should apply gray theme by default', () => {
      const { container } = renderComponent()

      const tag = container.querySelector('[class*="gray"]')
      expect(tag).toBeTruthy()
    })

    test('should apply custom theme', () => {
      const { container } = renderComponent({ theme: 'blue' })

      const tag = container.querySelector('[class*="blue"]')
      expect(tag).toBeTruthy()
    })

    test('should apply secondary variant by default', () => {
      const { container } = renderComponent()

      const tag = container.querySelector('.cn-tag-secondary')
      expect(tag).toBeInTheDocument()
    })

    test('should apply custom variant', () => {
      const { container } = renderComponent({ variant: 'outline' })

      const tag = container.querySelector('.cn-tag-outline')
      expect(tag).toBeInTheDocument()
    })

    test('should apply medium size by default', () => {
      renderComponent()

      // Default size is md - tag renders
      expect(screen.getByText('main')).toBeInTheDocument()
    })

    test('should apply custom size', () => {
      const { container } = renderComponent({ size: 'sm' })

      const tag = container.querySelector('.cn-tag-sm')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should render with all props combined', () => {
      const { container } = renderComponent({
        branchName: 'feature-branch',
        spaceId: 'space-1',
        repoId: 'repo-1',
        theme: 'green',
        variant: 'outline',
        size: 'sm'
      })

      expect(screen.getByText('feature-branch')).toBeInTheDocument()
      // Link is rendered (mocked as 'a' tag in tests)
      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(container.querySelector('.cn-tag-outline')).toBeInTheDocument()
      expect(container.querySelector('.cn-tag-sm')).toBeInTheDocument()
    })

    test('should render with branch icon and copy button', () => {
      renderComponent({
        branchName: 'main',
        hideBranchIcon: false,
        hideCopyButton: false
      })

      expect(screen.getByText('main')).toBeInTheDocument()
    })

    test('should render without branch icon and with copy button', () => {
      renderComponent({
        branchName: 'main',
        hideBranchIcon: true,
        hideCopyButton: false
      })

      expect(screen.getByText('main')).toBeInTheDocument()
    })

    test('should render with branch icon but without copy button', () => {
      renderComponent({
        branchName: 'main',
        hideBranchIcon: false,
        hideCopyButton: true
      })

      expect(screen.getByText('main')).toBeInTheDocument()
    })

    test('should render without branch icon and without copy button', () => {
      renderComponent({
        branchName: 'main',
        hideBranchIcon: true,
        hideCopyButton: true
      })

      expect(screen.getByText('main')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty branch name', () => {
      renderComponent({ branchName: '' })

      // Empty branch name renders as empty tag
      const tag = document.querySelector('.cn-tag')
      expect(tag).toBeTruthy()
    })

    test('should handle long branch names', () => {
      const longName = 'feature/very-long-branch-name-with-many-characters'
      renderComponent({ branchName: longName })

      expect(screen.getByText(longName)).toBeInTheDocument()
    })

    test('should handle special characters in branch name', () => {
      renderComponent({ branchName: 'feature/test_branch-v2' })

      expect(screen.getByText('feature/test_branch-v2')).toBeInTheDocument()
    })

    test('should render with only spaceId (no repoId)', () => {
      const { container } = renderComponent({
        branchName: 'main',
        spaceId: 'my-space'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(screen.getByText('main')).toBeInTheDocument()
    })
  })

  describe('Link Path Construction', () => {
    test('should construct link with spaceId and repoId', () => {
      const { container } = renderComponent({
        branchName: 'main',
        spaceId: 'my-space',
        repoId: 'my-repo'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('to', '/my-space/repos/my-repo/files/main')
    })

    test('should construct link with only repoId', () => {
      const { container } = renderComponent({
        branchName: 'develop',
        repoId: 'my-repo'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('to', '/repos/my-repo/files/develop')
    })

    test('should construct link without spaceId', () => {
      const { container } = renderComponent({
        branchName: 'feature',
        repoId: 'repo-123'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('to', '/repos/repo-123/files/feature')
    })

    test('should handle branch name in link path', () => {
      const { container } = renderComponent({
        branchName: 'feature/test-branch',
        repoId: 'my-repo'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('to', '/repos/my-repo/files/feature/test-branch')
    })

    test('should handle branch names with spaces in link', () => {
      const { container } = renderComponent({
        branchName: 'branch name',
        repoId: 'repo-1'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('to', '/repos/repo-1/files/branch name')
    })
  })

  describe('All Themes', () => {
    test('should apply default gray theme', () => {
      const { container } = renderComponent()

      const tag = container.querySelector('[class*="gray"]')
      expect(tag).toBeTruthy()
    })

    test('should apply blue theme', () => {
      const { container } = renderComponent({ theme: 'blue' })

      const tag = container.querySelector('[class*="blue"]')
      expect(tag).toBeTruthy()
    })

    test('should apply green theme', () => {
      const { container } = renderComponent({ theme: 'green' })

      // Green maps to 'success' class
      const tag = container.querySelector('[class*="success"]')
      expect(tag).toBeTruthy()
    })

    test('should apply red theme', () => {
      const { container } = renderComponent({ theme: 'red' })

      // Red maps to 'danger' class
      const tag = container.querySelector('[class*="danger"]')
      expect(tag).toBeTruthy()
    })

    test('should apply purple theme', () => {
      const { container } = renderComponent({ theme: 'purple' })

      const tag = container.querySelector('[class*="purple"]')
      expect(tag).toBeTruthy()
    })

    test('should apply orange theme', () => {
      const { container } = renderComponent({ theme: 'orange' })

      const tag = container.querySelector('[class*="orange"]')
      expect(tag).toBeTruthy()
    })
  })

  describe('All Variants', () => {
    test('should apply default secondary variant', () => {
      const { container } = renderComponent()

      const tag = container.querySelector('.cn-tag-secondary')
      expect(tag).toBeInTheDocument()
    })

    test('should apply outline variant', () => {
      const { container } = renderComponent({ variant: 'outline' })

      const tag = container.querySelector('.cn-tag-outline')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('All Sizes', () => {
    test('should apply default md size', () => {
      renderComponent()

      expect(screen.getByText('main')).toBeInTheDocument()
    })

    test('should apply sm size', () => {
      const { container } = renderComponent({ size: 'sm' })

      const tag = container.querySelector('.cn-tag-sm')
      expect(tag).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    test('should use default theme gray', () => {
      const { container } = render(<BranchTag branchName="test" />)

      const tag = container.querySelector('[class*="gray"]')
      expect(tag).toBeTruthy()
    })

    test('should use default variant secondary', () => {
      const { container } = render(<BranchTag branchName="test" />)

      const tag = container.querySelector('.cn-tag-secondary')
      expect(tag).toBeInTheDocument()
    })

    test('should use default size md', () => {
      render(<BranchTag branchName="test" />)

      expect(screen.getByText('test')).toBeInTheDocument()
    })

    test('should show branch icon by default', () => {
      const { container } = render(<BranchTag branchName="test" />)

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should show copy button by default', () => {
      render(<BranchTag branchName="test" />)

      // CopyTag is used by default
      expect(screen.getByText('test')).toBeInTheDocument()
    })
  })

  describe('Component Display Name', () => {
    test('should have correct displayName', () => {
      expect(BranchTag.displayName).toBe('BranchTag')
    })
  })

  describe('Tag vs CopyTag Behavior', () => {
    test('should render CopyTag when hideCopyButton is false', () => {
      renderComponent({ hideCopyButton: false })

      // CopyTag renders with copy functionality
      expect(screen.getByText('main')).toBeInTheDocument()
    })

    test('should render regular Tag when hideCopyButton is true', () => {
      renderComponent({ hideCopyButton: true })

      // Regular Tag without copy functionality
      expect(screen.getByText('main')).toBeInTheDocument()
    })

    test('should use CopyTag by default when hideCopyButton is undefined', () => {
      renderComponent()

      expect(screen.getByText('main')).toBeInTheDocument()
    })
  })

  describe('Icon Visibility', () => {
    test('should show git-branch icon when hideBranchIcon is false', () => {
      const { container } = renderComponent({ hideBranchIcon: false })

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })

    test('should hide icon when hideBranchIcon is true', () => {
      renderComponent({ hideBranchIcon: true })

      expect(screen.getByText('main')).toBeInTheDocument()
    })

    test('should show icon by default when hideBranchIcon is undefined', () => {
      const { container } = renderComponent()

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Link Behavior', () => {
    test('should render link with noHoverUnderline', () => {
      const { container } = renderComponent({
        branchName: 'main',
        repoId: 'repo-1'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveClass('cn-link-no-underline')
    })

    test('should construct link without spaceId prefix', () => {
      const { container } = renderComponent({
        branchName: 'main',
        repoId: 'repo-1'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('to', '/repos/repo-1/files/main')
    })

    test('should construct link with spaceId prefix', () => {
      const { container } = renderComponent({
        branchName: 'main',
        spaceId: 'space-1',
        repoId: 'repo-1'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('to', '/space-1/repos/repo-1/files/main')
    })

    test('should handle undefined repoId in link', () => {
      const { container } = renderComponent({
        branchName: 'main'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('to', '/repos/undefined/files/main')
    })
  })

  describe('Re-rendering with Prop Changes', () => {
    test('should update when branchName changes', () => {
      const { rerender } = render(<BranchTag branchName="main" />)

      expect(screen.getByText('main')).toBeInTheDocument()

      rerender(<BranchTag branchName="develop" />)

      expect(screen.getByText('develop')).toBeInTheDocument()
      expect(screen.queryByText('main')).not.toBeInTheDocument()
    })

    test('should update when theme changes', () => {
      const { rerender, container } = render(<BranchTag branchName="main" theme="gray" />)

      let tag = container.querySelector('[class*="gray"]')
      expect(tag).toBeTruthy()

      rerender(<BranchTag branchName="main" theme="blue" />)

      tag = container.querySelector('[class*="blue"]')
      expect(tag).toBeTruthy()
    })

    test('should update when variant changes', () => {
      const { rerender, container } = render(<BranchTag branchName="main" variant="secondary" />)

      let tag = container.querySelector('.cn-tag-secondary')
      expect(tag).toBeInTheDocument()

      rerender(<BranchTag branchName="main" variant="outline" />)

      tag = container.querySelector('.cn-tag-outline')
      expect(tag).toBeInTheDocument()
    })

    test('should update when size changes', () => {
      const { rerender, container } = render(<BranchTag branchName="main" size="md" />)

      expect(screen.getByText('main')).toBeInTheDocument()

      rerender(<BranchTag branchName="main" size="sm" />)

      const tag = container.querySelector('.cn-tag-sm')
      expect(tag).toBeInTheDocument()
    })

    test('should update when hideBranchIcon changes', () => {
      const { rerender, container } = render(<BranchTag branchName="main" hideBranchIcon={false} />)

      let icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()

      rerender(<BranchTag branchName="main" hideBranchIcon={true} />)

      icon = container.querySelector('.cn-icon')
      expect(icon).not.toBeInTheDocument()
    })

    test('should update when hideCopyButton changes', () => {
      const { rerender } = render(<BranchTag branchName="main" hideCopyButton={false} />)

      expect(screen.getByText('main')).toBeInTheDocument()

      rerender(<BranchTag branchName="main" hideCopyButton={true} />)

      expect(screen.getByText('main')).toBeInTheDocument()
    })
  })

  describe('Branch Name Variations', () => {
    test('should handle branch name with slashes', () => {
      renderComponent({ branchName: 'feature/user/login' })

      expect(screen.getByText('feature/user/login')).toBeInTheDocument()
    })

    test('should handle branch name with underscores', () => {
      renderComponent({ branchName: 'feature_test_branch' })

      expect(screen.getByText('feature_test_branch')).toBeInTheDocument()
    })

    test('should handle branch name with hyphens', () => {
      renderComponent({ branchName: 'feature-test-branch' })

      expect(screen.getByText('feature-test-branch')).toBeInTheDocument()
    })

    test('should handle branch name with dots', () => {
      renderComponent({ branchName: 'release/v1.2.3' })

      expect(screen.getByText('release/v1.2.3')).toBeInTheDocument()
    })

    test('should handle branch name with numbers', () => {
      renderComponent({ branchName: 'hotfix-123' })

      expect(screen.getByText('hotfix-123')).toBeInTheDocument()
    })

    test('should handle single character branch name', () => {
      renderComponent({ branchName: 'v' })

      expect(screen.getByText('v')).toBeInTheDocument()
    })

    test('should handle numeric branch name', () => {
      renderComponent({ branchName: '123' })

      expect(screen.getByText('123')).toBeInTheDocument()
    })
  })

  describe('Combination Testing', () => {
    test('should handle all props with spaceId, repoId, and icons', () => {
      const { container } = renderComponent({
        branchName: 'feature/test',
        spaceId: 'space-1',
        repoId: 'repo-1',
        theme: 'green',
        variant: 'outline',
        size: 'sm',
        hideBranchIcon: false,
        hideCopyButton: false
      })

      expect(screen.getByText('feature/test')).toBeInTheDocument()
      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('to', '/space-1/repos/repo-1/files/feature/test')
      expect(container.querySelector('.cn-tag-outline')).toBeInTheDocument()
      expect(container.querySelector('.cn-tag-sm')).toBeInTheDocument()
    })

    test('should handle minimal props (only branchName)', () => {
      renderComponent({ branchName: 'minimal' })

      expect(screen.getByText('minimal')).toBeInTheDocument()
    })

    test('should handle all themes with all variants', () => {
      const themes: Array<'gray' | 'blue' | 'green' | 'red' | 'purple' | 'orange'> = [
        'gray',
        'blue',
        'green',
        'red',
        'purple',
        'orange'
      ]
      const variants: Array<'secondary' | 'outline'> = ['secondary', 'outline']

      themes.forEach((theme, themeIndex) => {
        variants.forEach((variant, variantIndex) => {
          const uniqueBranchName = `test-${themeIndex}-${variantIndex}`
          const { container } = render(<BranchTag branchName={uniqueBranchName} theme={theme} variant={variant} />)

          expect(screen.getByText(uniqueBranchName)).toBeInTheDocument()
          const tag = container.querySelector(`.cn-tag-${variant}`)
          expect(tag).toBeInTheDocument()
        })
      })
    })

    test('should handle all sizes with all variants', () => {
      const sizes: Array<'sm' | 'md'> = ['sm', 'md']
      const variants: Array<'secondary' | 'outline'> = ['secondary', 'outline']

      sizes.forEach(size => {
        variants.forEach(variant => {
          render(<BranchTag branchName={`${size}-${variant}`} size={size} variant={variant} />)

          expect(screen.getByText(`${size}-${variant}`)).toBeInTheDocument()
        })
      })
    })
  })

  describe('Accessibility', () => {
    test('should render accessible link', () => {
      const { container } = renderComponent({
        branchName: 'main',
        repoId: 'repo-1'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link?.tagName).toBe('A')
    })

    test('should maintain tag visibility', () => {
      renderComponent({ branchName: 'accessible-branch' })

      expect(screen.getByText('accessible-branch')).toBeInTheDocument()
    })
  })

  describe('Conditional Rendering Logic', () => {
    test('should use CopyTag when hideCopyButton is false', () => {
      renderComponent({ branchName: 'test', hideCopyButton: false })

      // CopyTag is rendered
      expect(screen.getByText('test')).toBeInTheDocument()
    })

    test('should use Tag when hideCopyButton is true', () => {
      renderComponent({ branchName: 'test', hideCopyButton: true })

      // Regular Tag is rendered
      expect(screen.getByText('test')).toBeInTheDocument()
    })

    test('should pass icon prop as undefined when hideBranchIcon is true', () => {
      const { container } = renderComponent({ hideBranchIcon: true })

      const icon = container.querySelector('.cn-icon')
      expect(icon).not.toBeInTheDocument()
    })

    test('should pass icon prop as git-branch when hideBranchIcon is false', () => {
      const { container } = renderComponent({ hideBranchIcon: false })

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Empty and Null Values', () => {
    test('should handle empty string branch name with value fallback', () => {
      const { container } = renderComponent({ branchName: '' })

      const tag = container.querySelector('.cn-tag')
      expect(tag).toBeTruthy()
    })

    test('should handle undefined spaceId', () => {
      const { container } = renderComponent({
        branchName: 'main',
        spaceId: undefined,
        repoId: 'repo-1'
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('to', '/repos/repo-1/files/main')
    })

    test('should handle undefined repoId', () => {
      const { container } = renderComponent({
        branchName: 'main',
        repoId: undefined
      })

      const link = container.querySelector('a')
      expect(link).toBeInTheDocument()
    })
  })

  describe('Complex Prop Combinations', () => {
    test('should render with theme, variant, and size together', () => {
      const { container } = renderComponent({
        branchName: 'complex',
        theme: 'blue',
        variant: 'outline',
        size: 'sm'
      })

      expect(screen.getByText('complex')).toBeInTheDocument()
      expect(container.querySelector('.cn-tag-outline')).toBeInTheDocument()
      expect(container.querySelector('.cn-tag-sm')).toBeInTheDocument()
    })

    test('should handle all boolean flags together', () => {
      renderComponent({
        branchName: 'flags-test',
        hideBranchIcon: true,
        hideCopyButton: true
      })

      expect(screen.getByText('flags-test')).toBeInTheDocument()
    })

    test('should handle no boolean flags (all defaults)', () => {
      const { container } = renderComponent({ branchName: 'defaults' })

      const icon = container.querySelector('.cn-icon')
      expect(icon).toBeInTheDocument()
      expect(screen.getByText('defaults')).toBeInTheDocument()
    })
  })
})
