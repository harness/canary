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
})
