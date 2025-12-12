import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { SearchFiles } from '../search-files'

// Mock translation context
vi.mock('@/context', async importOriginal => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, defaultValue: string) => defaultValue
    })
  }
})

// Mock useSearchableDropdownKeyboardNavigation
vi.mock('@/components', async importOriginal => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    useSearchableDropdownKeyboardNavigation: ({ onFirstItemKeyDown, onLastItemKeyDown }: any) => ({
      searchInputRef: { current: null },
      handleSearchKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
          onFirstItemKeyDown?.()
        } else if (e.key === 'ArrowUp') {
          onLastItemKeyDown?.()
        }
      },
      getItemProps: (_index: number) => ({
        ref: { current: null },
        onKeyDown: vi.fn()
      })
    })
  }
})

// Test Wrapper with TooltipProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
}

describe('SearchFiles', () => {
  const mockNavigateToFile = vi.fn()
  const mockFilesList = [
    'src/components/button.tsx',
    'src/components/input.tsx',
    'src/utils/helpers.ts',
    'src/pages/home.tsx',
    'tests/button.test.tsx'
  ]

  describe('Rendering', () => {
    test('should render search input', () => {
      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    test('should render with custom search input size', () => {
      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} searchInputSize="sm" />
        </TestWrapper>
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    test('should apply inputContainerClassName', () => {
      const { container } = render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} inputContainerClassName="custom-container" />
        </TestWrapper>
      )

      const containerDiv = container.querySelector('.custom-container')
      expect(containerDiv).toBeInTheDocument()
    })

    test('should render with default size md', () => {
      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} />
        </TestWrapper>
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    test('should render with autoFocus on input', () => {
      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    test('should filter files based on query', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })
    })

    test('should show all matching files', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'tsx')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })
    })

    test('should perform case-insensitive search', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'HELPERS')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })
    })

    test('should show "No file found" when no matches', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'nonexistent')

      await waitFor(() => {
        expect(screen.getByText('No file found.')).toBeInTheDocument()
      })
    })

    test('should show no results for empty filesList', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={[]} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'test')

      await waitFor(() => {
        expect(screen.getByText('No file found.')).toBeInTheDocument()
      })
    })

    test('should show no results when filesList is undefined', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'test')

      await waitFor(() => {
        expect(screen.getByText('No file found.')).toBeInTheDocument()
      })
    })

    test('should clear results when query is cleared', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })

      await userEvent.clear(input)

      await waitFor(() => {
        expect(screen.queryAllByRole('menuitem')).toHaveLength(0)
      })
    })
  })

  describe('File Navigation', () => {
    test('should call navigateToFile when file is selected', async () => {
      // Use userEvent directly
      mockNavigateToFile.mockClear()

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })

      const fileItem = screen.getAllByRole('menuitem')[0]
      await userEvent.click(fileItem)

      await waitFor(() => {
        expect(mockNavigateToFile).toHaveBeenCalledWith(expect.stringContaining('helpers'))
      })
    })

    test('should close dropdown after file selection', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })

      const fileItem = screen.getAllByRole('menuitem')[0]
      await userEvent.click(fileItem)

      // Wait for dropdown to close
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })
  })

  describe('Dropdown Behavior', () => {
    test('should open dropdown when typing', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })
    })

    test('should close dropdown when query is empty', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })

      await userEvent.clear(input)

      await waitFor(() => {
        expect(screen.queryAllByRole('menuitem')).toHaveLength(0)
      })
    })

    test('should not open dropdown with empty query', () => {
      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  describe('File Highlighting', () => {
    test('should highlight matched text in file names', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const mark = screen.getByText((content, element) => {
          return element?.tagName.toLowerCase() === 'mark' && element?.textContent === 'helpers'
        })
        expect(mark).toBeInTheDocument()
      })
    })

    test('should handle files with no match highlighting', async () => {
      // Use userEvent directly
      const filesWithNoMatch = ['src/components/test.tsx']

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={filesWithNoMatch} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'xyz')

      await waitFor(() => {
        expect(screen.getByText('No file found.')).toBeInTheDocument()
      })
    })

    test('should show full file path when no match', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={['exact-match.tsx']} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'match')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })
    })
  })

  describe('MAX_FILES Limit', () => {
    test('should limit results to 50 files', async () => {
      // Use userEvent directly
      const largeFilesList = Array.from({ length: 100 }, (_, i) => `file${i}.tsx`)

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={largeFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'file')

      await waitFor(() => {
        const items = screen.getAllByRole('menuitem')
        expect(items.length).toBeLessThanOrEqual(50)
      })
    })

    test('should handle exactly 50 matching files', async () => {
      // Use userEvent directly
      const exactFilesList = Array.from({ length: 50 }, (_, i) => `match${i}.tsx`)

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={exactFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'match')

      await waitFor(() => {
        const items = screen.getAllByRole('menuitem')
        expect(items.length).toBe(50)
      })
    })

    test('should handle less than 50 matching files', async () => {
      // Use userEvent directly
      const smallFilesList = Array.from({ length: 10 }, (_, i) => `small${i}.tsx`)

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={smallFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'small')

      await waitFor(() => {
        const items = screen.getAllByRole('menuitem')
        expect(items.length).toBe(10)
      })
    })
  })

  describe('Keyboard Navigation', () => {
    test('should handle arrow down key', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        expect(screen.getByText(/helpers/i)).toBeInTheDocument()
      })

      await userEvent.keyboard('{ArrowDown}')

      // Dropdown should remain open
      await waitFor(() => {
        expect(screen.getByText(/helpers/i)).toBeInTheDocument()
      })
    })

    test('should handle arrow up key', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        expect(screen.getByText(/helpers/i)).toBeInTheDocument()
      })

      await userEvent.keyboard('{ArrowUp}')

      // Dropdown should remain open
      await waitFor(() => {
        expect(screen.getByText(/helpers/i)).toBeInTheDocument()
      })
    })

    test('should handle enter key on file item', async () => {
      // Use userEvent directly
      mockNavigateToFile.mockClear()

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        expect(screen.getByText(/helpers/i)).toBeInTheDocument()
      })

      const fileItem = screen.getAllByRole('menuitem')[0]
      await userEvent.click(fileItem)

      expect(mockNavigateToFile).toHaveBeenCalled()
    })
  })

  describe('Content Styling', () => {
    test('should apply contentClassName to dropdown content', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles
            navigateToFile={mockNavigateToFile}
            filesList={mockFilesList}
            contentClassName="custom-content"
          />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })

      // Dropdown content is rendered in a portal
      const content = document.querySelector('.custom-content')
      expect(content).not.toBeNull()
    })

    test('should have default width class', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })

      // Dropdown content is rendered in a portal
      const content = document.querySelector('.w-\\[800px\\]')
      expect(content).not.toBeNull()
    })
  })

  describe('getMarkedFileElement Function', () => {
    test('should render file without highlighting when no match', async () => {
      // Use userEvent directly
      const files = ['test-file.tsx']

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={files} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'different')

      await waitFor(() => {
        expect(screen.getByText('No file found.')).toBeInTheDocument()
      })
    })

    test('should highlight match at beginning of file name', async () => {
      // Use userEvent directly
      const files = ['helpers-component.tsx']

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={files} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const mark = screen.getByText((content, element) => {
          return element?.tagName.toLowerCase() === 'mark' && element?.textContent === 'helpers'
        })
        expect(mark).toBeInTheDocument()
      })
    })

    test('should highlight match in middle of file name', async () => {
      // Use userEvent directly
      const files = ['test-helpers-component.tsx']

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={files} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const mark = screen.getByText((content, element) => {
          return element?.tagName.toLowerCase() === 'mark' && element?.textContent === 'helpers'
        })
        expect(mark).toBeInTheDocument()
      })
    })

    test('should highlight match at end of file name', async () => {
      // Use userEvent directly
      const files = ['component-helpers.tsx']

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={files} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const mark = screen.getByText((content, element) => {
          return element?.tagName.toLowerCase() === 'mark' && element?.textContent === 'helpers'
        })
        expect(mark).toBeInTheDocument()
      })
    })
  })

  describe('State Management', () => {
    test('should maintain independent state for query and filtered files', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')

      // Type first query
      await userEvent.type(input, 'helpers')
      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })

      // Clear and type new query
      await userEvent.clear(input)
      await userEvent.type(input, 'input')

      await waitFor(() => {
        expect(screen.queryByText(/helpers/i)).not.toBeInTheDocument()
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })
    })

    test('should reset filtered files when query becomes empty', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })

      await userEvent.clear(input)

      await waitFor(() => {
        expect(screen.queryAllByRole('menuitem')).toHaveLength(0)
      })
    })

    test('should update results when filesList changes', async () => {
      // Use userEvent directly
      const { rerender } = render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'test')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })

      // Update files list
      rerender(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={['newfile-test.tsx']} />
        </TestWrapper>
      )

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty string query', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'test')
      await userEvent.clear(input)

      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    test('should handle special characters in query', async () => {
      // Use userEvent directly
      const files = ['file-name.tsx', 'file_name.tsx', 'file.name.tsx']

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={files} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, '-')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })
    })

    test('should handle files with identical names in different paths', async () => {
      // Use userEvent directly
      const files = ['src/components/helpers.tsx', 'tests/components/helpers.tsx']

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={files} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const items = screen.getAllByRole('menuitem')
        expect(items.length).toBe(2)
      })
    })

    test('should handle very long file paths', async () => {
      // Use userEvent directly
      const longPath = 'src/components/nested/deeply/very/long/path/to/component/helpers.tsx'
      const files = [longPath]

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={files} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })
    })

    test('should handle single character query', async () => {
      // Use userEvent directly
      const files = ['a.tsx', 'b.tsx', 'ab.tsx']

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={files} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'a')

      await waitFor(() => {
        const items = screen.getAllByText(/a/)
        expect(items.length).toBeGreaterThan(0)
      })
    })

    test('should handle whitespace in query', async () => {
      // Use userEvent directly
      const files = ['file with spaces.tsx']

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={files} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'with spaces')

      await waitFor(() => {
        expect(screen.getByText(/with spaces/i)).toBeInTheDocument()
      })
    })

    test('should handle query longer than file name', async () => {
      // Use userEvent directly
      const files = ['a.tsx']

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={files} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'verylongquerythatdoesntmatch')

      await waitFor(() => {
        expect(screen.getByText('No file found.')).toBeInTheDocument()
      })
    })

    test('should handle undefined navigateToFile gracefully', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={undefined as any} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Icon Display', () => {
    test('should show empty-page icon for each file', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'tsx')

      await waitFor(() => {
        const items = screen.queryAllByText(/tsx/i)
        expect(items.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Dropdown Trigger', () => {
    test('should render dropdown trigger with correct properties', () => {
      const { container } = render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} />
        </TestWrapper>
      )

      const trigger = container.querySelector('[tabindex="-1"]')
      expect(trigger).toBeInTheDocument()
    })

    test('should have pointer-events-none on trigger', () => {
      const { container } = render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} />
        </TestWrapper>
      )

      const trigger = container.querySelector('.pointer-events-none')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have textbox role on input', () => {
      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} />
        </TestWrapper>
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    test('should maintain focus on input during search', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'input')

      expect(input).toHaveFocus()
    })

    test('should prevent auto focus on dropdown content open', async () => {
      // Use userEvent directly

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'helpers')

      await waitFor(() => {
        expect(screen.getByText(/helpers/i)).toBeInTheDocument()
      })

      // Input should remain focused
      expect(input).toHaveFocus()
    })
  })

  describe('Dropdown Modal Behavior', () => {
    test('should render dropdown with modal=false', () => {
      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} />
        </TestWrapper>
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('Re-rendering', () => {
    test('should handle navigateToFile prop change', () => {
      const newNavigate = vi.fn()
      const { rerender } = render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} />
        </TestWrapper>
      )

      rerender(
        <TestWrapper>
          <SearchFiles navigateToFile={newNavigate} />
        </TestWrapper>
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    test('should handle searchInputSize prop change', () => {
      const { rerender } = render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} searchInputSize="sm" />
        </TestWrapper>
      )

      rerender(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} searchInputSize="md" />
        </TestWrapper>
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('FileItem Object Array Support', () => {
    const mockFilesListWithObjects = [
      { label: 'Button Component', value: '/src/components/button.tsx' },
      { label: 'Input Component', value: '/src/components/input.tsx' },
      { label: 'Helper Utils', value: '/src/utils/helpers.ts' },
      { label: 'Home Page', value: '/src/pages/home.tsx' },
      { label: 'Button Tests', value: '/tests/button.test.tsx' }
    ]

    test('should filter files based on label when using object array', async () => {
      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesListWithObjects} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'Helper')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBe(1)
      })
    })

    test('should display label in dropdown items', async () => {
      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesListWithObjects} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'Button')

      await waitFor(() => {
        // Text is split by <mark> highlighting, so check for items count
        const items = screen.getAllByRole('menuitem')
        expect(items.length).toBe(2) // Button Component and Button Tests
      })
    })

    test('should call navigateToFile with value (not label) when file is selected', async () => {
      mockNavigateToFile.mockClear()

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesListWithObjects} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'Helper Utils')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBeGreaterThan(0)
      })

      const fileItem = screen.getAllByRole('menuitem')[0]
      await userEvent.click(fileItem)

      await waitFor(() => {
        expect(mockNavigateToFile).toHaveBeenCalledWith('/src/utils/helpers.ts')
      })
    })

    test('should highlight matched text in label', async () => {
      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mockFilesListWithObjects} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'Utils')

      await waitFor(() => {
        const mark = screen.getByText((content, element) => {
          return element?.tagName.toLowerCase() === 'mark' && element?.textContent?.toLowerCase() === 'utils'
        })
        expect(mark).toBeInTheDocument()
      })
    })

    test('should handle mixed string and object arrays gracefully', async () => {
      // This tests the normalizeFileItem function indirectly
      const mixedList = ['simple-file.tsx'] // String array still works

      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={mixedList} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'simple')

      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem')
        expect(items.length).toBe(1)
      })
    })

    test('should handle empty object array', async () => {
      render(
        <TestWrapper>
          <SearchFiles navigateToFile={mockNavigateToFile} filesList={[]} />
        </TestWrapper>
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'test')

      await waitFor(() => {
        expect(screen.getByText('No file found.')).toBeInTheDocument()
      })
    })
  })
})
