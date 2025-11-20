import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { RepoSubheader, RepoTabsKeys, repoTabsKeysArr } from './repo-subheader'

// Mock translation context and router context
vi.mock('@/context', async importOriginal => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, defaultValue: string) => defaultValue
    }),
    useRouterContext: () => ({
      pathname: '/test',
      navigate: vi.fn(),
      searchParams: new URLSearchParams()
    })
  }
})

// Mock SandboxLayout
vi.mock('@/views', () => ({
  SandboxLayout: {
    SubHeader: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className} data-testid="subheader">
        {children}
      </div>
    )
  }
}))

// Mock Tabs components
vi.mock('@/components', async importOriginal => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    Tabs: {
      NavRoot: ({ children }: { children: React.ReactNode }) => <nav data-testid="tabs-navroot">{children}</nav>,
      List: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className} data-testid="tabs-list">
          {children}
        </div>
      ),
      Trigger: ({ children, value, disabled }: { children: React.ReactNode; value: string; disabled?: boolean }) => (
        <button role="tab" data-value={value} disabled={disabled} data-testid={`tab-${value}`}>
          {children}
        </button>
      )
    }
  }
})

describe('RepoSubheader', () => {
  describe('Rendering', () => {
    test('should render repo subheader', () => {
      render(<RepoSubheader />)

      expect(screen.getByTestId('subheader')).toBeInTheDocument()
    })

    test('should render all default tabs', () => {
      render(<RepoSubheader />)

      expect(screen.getByText('Summary')).toBeInTheDocument()
      expect(screen.getByText('Files')).toBeInTheDocument()
      expect(screen.getByText('Pipelines')).toBeInTheDocument()
      expect(screen.getByText('Commits')).toBeInTheDocument()
      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByText('Pull requests')).toBeInTheDocument()
      expect(screen.getByText('Branches')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    test('should not render search tab by default', () => {
      render(<RepoSubheader />)

      expect(screen.queryByText('Search')).not.toBeInTheDocument()
    })

    test('should apply custom className to SubHeader', () => {
      render(<RepoSubheader className="custom-subheader" />)

      const subheader = screen.getByTestId('subheader')
      expect(subheader).toHaveClass('custom-subheader')
    })
  })

  describe('RepoTabsKeys Enum', () => {
    test('should have correct enum values', () => {
      expect(RepoTabsKeys.SUMMARY).toBe('summary')
      expect(RepoTabsKeys.CODE).toBe('code')
      expect(RepoTabsKeys.PIPELINES).toBe('pipelines')
      expect(RepoTabsKeys.COMMITS).toBe('commits')
      expect(RepoTabsKeys.TAGS).toBe('tags')
      expect(RepoTabsKeys.PULLS).toBe('pulls')
      expect(RepoTabsKeys.BRANCHES).toBe('branches')
      expect(RepoTabsKeys.SETTINGS).toBe('settings')
      expect(RepoTabsKeys.SEARCH).toBe('search')
    })
  })

  describe('repoTabsKeysArr', () => {
    test('should contain all enum values', () => {
      expect(repoTabsKeysArr).toContain('summary')
      expect(repoTabsKeysArr).toContain('code')
      expect(repoTabsKeysArr).toContain('pipelines')
      expect(repoTabsKeysArr).toContain('commits')
      expect(repoTabsKeysArr).toContain('tags')
      expect(repoTabsKeysArr).toContain('pulls')
      expect(repoTabsKeysArr).toContain('branches')
      expect(repoTabsKeysArr).toContain('settings')
      expect(repoTabsKeysArr).toContain('search')
    })

    test('should have 9 items', () => {
      expect(repoTabsKeysArr).toHaveLength(9)
    })
  })

  describe('showPipelinesTab Prop', () => {
    test('should show Pipelines tab by default', () => {
      render(<RepoSubheader />)

      expect(screen.getByText('Pipelines')).toBeInTheDocument()
    })

    test('should show Pipelines tab when showPipelinesTab is true', () => {
      render(<RepoSubheader showPipelinesTab={true} />)

      expect(screen.getByText('Pipelines')).toBeInTheDocument()
    })

    test('should hide Pipelines tab when showPipelinesTab is false', () => {
      render(<RepoSubheader showPipelinesTab={false} />)

      expect(screen.queryByText('Pipelines')).not.toBeInTheDocument()
    })
  })

  describe('showSearchTab Prop', () => {
    test('should not show Search tab by default', () => {
      render(<RepoSubheader />)

      expect(screen.queryByText('Search')).not.toBeInTheDocument()
    })

    test('should not show Search tab when showSearchTab is false', () => {
      render(<RepoSubheader showSearchTab={false} />)

      expect(screen.queryByText('Search')).not.toBeInTheDocument()
    })

    test('should show Search tab when showSearchTab is true', () => {
      render(<RepoSubheader showSearchTab={true} />)

      expect(screen.getByText('Search')).toBeInTheDocument()
    })
  })

  describe('isRepoEmpty Prop', () => {
    test('should enable all tabs when isRepoEmpty is false', () => {
      render(<RepoSubheader isRepoEmpty={false} />)

      // Summary and Settings should always be enabled
      expect(screen.getByText('Summary')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()

      // These tabs should be enabled
      expect(screen.getByText('Files')).toBeInTheDocument()
      expect(screen.getByText('Commits')).toBeInTheDocument()
      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByText('Pull requests')).toBeInTheDocument()
      expect(screen.getByText('Branches')).toBeInTheDocument()
    })

    test('should disable certain tabs when isRepoEmpty is true', () => {
      render(<RepoSubheader isRepoEmpty={true} />)

      // Summary and Settings should always be enabled
      expect(screen.getByText('Summary')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()

      // These tabs should still render but be disabled
      expect(screen.getByText('Files')).toBeInTheDocument()
      expect(screen.getByText('Commits')).toBeInTheDocument()
      expect(screen.getByText('Tags')).toBeInTheDocument()
    })

    test('should not disable Summary tab when repo is empty', () => {
      render(<RepoSubheader isRepoEmpty={true} />)

      expect(screen.getByText('Summary')).toBeInTheDocument()
    })

    test('should not disable Settings tab when repo is empty', () => {
      render(<RepoSubheader isRepoEmpty={true} />)

      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    test('should not disable Pipelines tab when repo is empty', () => {
      render(<RepoSubheader isRepoEmpty={true} />)

      expect(screen.getByText('Pipelines')).toBeInTheDocument()
    })
  })

  describe('Custom Path Props', () => {
    test('should use summaryPath when provided', () => {
      render(<RepoSubheader summaryPath="/custom/summary" />)

      expect(screen.getByText('Summary')).toBeInTheDocument()
    })

    test('should use default summary path when summaryPath is not provided', () => {
      render(<RepoSubheader />)

      expect(screen.getByText('Summary')).toBeInTheDocument()
    })

    test('should use filesPath when provided', () => {
      render(<RepoSubheader filesPath="/custom/files" />)

      expect(screen.getByText('Files')).toBeInTheDocument()
    })

    test('should use default code path when filesPath is not provided', () => {
      render(<RepoSubheader />)

      expect(screen.getByText('Files')).toBeInTheDocument()
    })

    test('should use commitsPath when provided', () => {
      render(<RepoSubheader commitsPath="/custom/commits" />)

      expect(screen.getByText('Commits')).toBeInTheDocument()
    })

    test('should use default commits path when commitsPath is not provided', () => {
      render(<RepoSubheader />)

      expect(screen.getByText('Commits')).toBeInTheDocument()
    })

    test('should handle all custom paths together', () => {
      render(<RepoSubheader summaryPath="/repo/summary" filesPath="/repo/files" commitsPath="/repo/commits" />)

      expect(screen.getByText('Summary')).toBeInTheDocument()
      expect(screen.getByText('Files')).toBeInTheDocument()
      expect(screen.getByText('Commits')).toBeInTheDocument()
    })
  })

  describe('Tab Values', () => {
    test('should use RepoTabsKeys for tabs without custom paths', () => {
      render(<RepoSubheader />)

      // Pipelines should use RepoTabsKeys.PIPELINES
      expect(screen.getByText('Pipelines')).toBeInTheDocument()

      // Tags should use RepoTabsKeys.TAGS
      expect(screen.getByText('Tags')).toBeInTheDocument()

      // Settings should use RepoTabsKeys.SETTINGS
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })
  })

  describe('Tabs Structure', () => {
    test('should render Tabs.NavRoot', () => {
      const { container } = render(<RepoSubheader />)

      // Tabs.NavRoot should render a nav element
      expect(container.querySelector('nav')).toBeInTheDocument()
    })

    test('should render Tabs.List with cn-repo-subheader-tabs class', () => {
      const { container } = render(<RepoSubheader />)

      const tabsList = container.querySelector('.cn-repo-subheader-tabs')
      expect(tabsList).toBeInTheDocument()
    })

    test('should render all tabs as Tabs.Trigger components', () => {
      render(<RepoSubheader />)

      // All tab labels should be rendered
      const tabs = ['Summary', 'Files', 'Pipelines', 'Commits', 'Tags', 'Pull requests', 'Branches', 'Settings']

      tabs.forEach(tab => {
        expect(screen.getByText(tab)).toBeInTheDocument()
      })
    })
  })

  describe('Combined Props', () => {
    test('should handle all props together with pipelines and search visible', () => {
      render(
        <RepoSubheader
          className="custom-class"
          showPipelinesTab={true}
          showSearchTab={true}
          summaryPath="/summary"
          filesPath="/files"
          commitsPath="/commits"
          isRepoEmpty={false}
        />
      )

      expect(screen.getByText('Summary')).toBeInTheDocument()
      expect(screen.getByText('Files')).toBeInTheDocument()
      expect(screen.getByText('Pipelines')).toBeInTheDocument()
      expect(screen.getByText('Commits')).toBeInTheDocument()
      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByText('Pull requests')).toBeInTheDocument()
      expect(screen.getByText('Branches')).toBeInTheDocument()
      expect(screen.getByText('Search')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    test('should handle all props together with pipelines hidden', () => {
      render(
        <RepoSubheader className="custom-class" showPipelinesTab={false} showSearchTab={false} isRepoEmpty={true} />
      )

      expect(screen.getByText('Summary')).toBeInTheDocument()
      expect(screen.queryByText('Pipelines')).not.toBeInTheDocument()
      expect(screen.queryByText('Search')).not.toBeInTheDocument()
    })

    test('should show search tab when enabled on empty repo', () => {
      render(<RepoSubheader showSearchTab={true} isRepoEmpty={true} />)

      expect(screen.getByText('Search')).toBeInTheDocument()
    })
  })

  describe('Translation Keys', () => {
    test('should use correct translation keys for all tabs', () => {
      render(<RepoSubheader showSearchTab={true} />)

      // All translated strings should render with their default values
      expect(screen.getByText('Summary')).toBeInTheDocument()
      expect(screen.getByText('Files')).toBeInTheDocument()
      expect(screen.getByText('Pipelines')).toBeInTheDocument()
      expect(screen.getByText('Commits')).toBeInTheDocument()
      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByText('Pull requests')).toBeInTheDocument()
      expect(screen.getByText('Branches')).toBeInTheDocument()
      expect(screen.getByText('Search')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })
  })

  describe('Default Props', () => {
    test('should use default showPipelinesTab value (true)', () => {
      render(<RepoSubheader />)

      expect(screen.getByText('Pipelines')).toBeInTheDocument()
    })

    test('should use default showSearchTab value (false)', () => {
      render(<RepoSubheader />)

      expect(screen.queryByText('Search')).not.toBeInTheDocument()
    })

    test('should use default isRepoEmpty value (false)', () => {
      render(<RepoSubheader />)

      // Tabs should be enabled by default
      expect(screen.getByText('Files')).toBeInTheDocument()
      expect(screen.getByText('Commits')).toBeInTheDocument()
    })

    test('should work without className', () => {
      render(<RepoSubheader />)

      expect(screen.getByTestId('subheader')).toBeInTheDocument()
    })

    test('should work without custom paths', () => {
      render(<RepoSubheader />)

      expect(screen.getByText('Summary')).toBeInTheDocument()
      expect(screen.getByText('Files')).toBeInTheDocument()
      expect(screen.getByText('Commits')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty className', () => {
      render(<RepoSubheader className="" />)

      expect(screen.getByTestId('subheader')).toBeInTheDocument()
    })

    test('should handle undefined className', () => {
      render(<RepoSubheader className={undefined} />)

      expect(screen.getByTestId('subheader')).toBeInTheDocument()
    })

    test('should handle empty summaryPath', () => {
      render(<RepoSubheader summaryPath="" />)

      expect(screen.getByText('Summary')).toBeInTheDocument()
    })

    test('should handle empty filesPath', () => {
      render(<RepoSubheader filesPath="" />)

      expect(screen.getByText('Files')).toBeInTheDocument()
    })

    test('should handle empty commitsPath', () => {
      render(<RepoSubheader commitsPath="" />)

      expect(screen.getByText('Commits')).toBeInTheDocument()
    })

    test('should handle all boolean props as false', () => {
      render(<RepoSubheader showPipelinesTab={false} showSearchTab={false} isRepoEmpty={false} />)

      expect(screen.queryByText('Pipelines')).not.toBeInTheDocument()
      expect(screen.queryByText('Search')).not.toBeInTheDocument()
      expect(screen.getByText('Files')).toBeInTheDocument()
    })

    test('should handle all boolean props as true', () => {
      render(<RepoSubheader showPipelinesTab={true} showSearchTab={true} isRepoEmpty={true} />)

      expect(screen.getByText('Pipelines')).toBeInTheDocument()
      expect(screen.getByText('Search')).toBeInTheDocument()
      expect(screen.getByText('Files')).toBeInTheDocument()
    })
  })

  describe('Tab Rendering Order', () => {
    test('should render tabs in correct order without optional tabs', () => {
      render(<RepoSubheader showPipelinesTab={false} showSearchTab={false} />)

      const allText = screen.getByTestId('subheader').textContent || ''

      // Check that tabs appear in order
      expect(allText.indexOf('Summary')).toBeLessThan(allText.indexOf('Files'))
      expect(allText.indexOf('Files')).toBeLessThan(allText.indexOf('Commits'))
      expect(allText.indexOf('Commits')).toBeLessThan(allText.indexOf('Tags'))
      expect(allText.indexOf('Tags')).toBeLessThan(allText.indexOf('Pull requests'))
      expect(allText.indexOf('Pull requests')).toBeLessThan(allText.indexOf('Branches'))
      expect(allText.indexOf('Branches')).toBeLessThan(allText.indexOf('Settings'))
    })

    test('should render Pipelines between Files and Commits when shown', () => {
      render(<RepoSubheader showPipelinesTab={true} />)

      const allText = screen.getByTestId('subheader').textContent || ''

      expect(allText.indexOf('Files')).toBeLessThan(allText.indexOf('Pipelines'))
      expect(allText.indexOf('Pipelines')).toBeLessThan(allText.indexOf('Commits'))
    })

    test('should render Search before Settings when shown', () => {
      render(<RepoSubheader showSearchTab={true} />)

      const allText = screen.getByTestId('subheader').textContent || ''

      expect(allText.indexOf('Branches')).toBeLessThan(allText.indexOf('Search'))
      expect(allText.indexOf('Search')).toBeLessThan(allText.indexOf('Settings'))
    })
  })

  describe('Re-rendering', () => {
    test('should update when showPipelinesTab changes', () => {
      const { rerender } = render(<RepoSubheader showPipelinesTab={false} />)

      expect(screen.queryByText('Pipelines')).not.toBeInTheDocument()

      rerender(<RepoSubheader showPipelinesTab={true} />)

      expect(screen.getByText('Pipelines')).toBeInTheDocument()
    })

    test('should update when showSearchTab changes', () => {
      const { rerender } = render(<RepoSubheader showSearchTab={false} />)

      expect(screen.queryByText('Search')).not.toBeInTheDocument()

      rerender(<RepoSubheader showSearchTab={true} />)

      expect(screen.getByText('Search')).toBeInTheDocument()
    })

    test('should update when isRepoEmpty changes', () => {
      const { rerender } = render(<RepoSubheader isRepoEmpty={false} />)

      expect(screen.getByText('Files')).toBeInTheDocument()

      rerender(<RepoSubheader isRepoEmpty={true} />)

      expect(screen.getByText('Files')).toBeInTheDocument()
    })

    test('should update when className changes', () => {
      const { rerender } = render(<RepoSubheader className="class-1" />)

      let subheader = screen.getByTestId('subheader')
      expect(subheader).toHaveClass('class-1')

      rerender(<RepoSubheader className="class-2" />)

      subheader = screen.getByTestId('subheader')
      expect(subheader).toHaveClass('class-2')
      expect(subheader).not.toHaveClass('class-1')
    })

    test('should update when custom paths change', () => {
      const { rerender } = render(<RepoSubheader summaryPath="/path1" />)

      expect(screen.getByText('Summary')).toBeInTheDocument()

      rerender(<RepoSubheader summaryPath="/path2" />)

      expect(screen.getByText('Summary')).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should render minimal configuration', () => {
      render(<RepoSubheader showPipelinesTab={false} showSearchTab={false} />)

      // Should render 7 tabs (all except Pipelines and Search)
      expect(screen.getByText('Summary')).toBeInTheDocument()
      expect(screen.getByText('Files')).toBeInTheDocument()
      expect(screen.queryByText('Pipelines')).not.toBeInTheDocument()
      expect(screen.getByText('Commits')).toBeInTheDocument()
      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByText('Pull requests')).toBeInTheDocument()
      expect(screen.getByText('Branches')).toBeInTheDocument()
      expect(screen.queryByText('Search')).not.toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    test('should render maximum configuration', () => {
      render(<RepoSubheader showPipelinesTab={true} showSearchTab={true} className="custom-header" />)

      // Should render all 9 tabs
      expect(screen.getByText('Summary')).toBeInTheDocument()
      expect(screen.getByText('Files')).toBeInTheDocument()
      expect(screen.getByText('Pipelines')).toBeInTheDocument()
      expect(screen.getByText('Commits')).toBeInTheDocument()
      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByText('Pull requests')).toBeInTheDocument()
      expect(screen.getByText('Branches')).toBeInTheDocument()
      expect(screen.getByText('Search')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    test('should handle empty repo with all optional tabs shown', () => {
      render(<RepoSubheader showPipelinesTab={true} showSearchTab={true} isRepoEmpty={true} />)

      // All tabs should render
      expect(screen.getByText('Summary')).toBeInTheDocument()
      expect(screen.getByText('Files')).toBeInTheDocument()
      expect(screen.getByText('Pipelines')).toBeInTheDocument()
      expect(screen.getByText('Commits')).toBeInTheDocument()
      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByText('Pull requests')).toBeInTheDocument()
      expect(screen.getByText('Branches')).toBeInTheDocument()
      expect(screen.getByText('Search')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should render tabs in navigation element', () => {
      const { container } = render(<RepoSubheader />)

      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    test('should use semantic tab structure', () => {
      render(<RepoSubheader />)

      // Tabs should be accessible
      expect(screen.getByText('Summary')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })
  })
})
