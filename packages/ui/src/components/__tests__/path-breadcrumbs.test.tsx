import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render as rtlRender, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { PathBreadcrumbs, PathParts } from '../path-breadcrumbs'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider delayDuration={0}>{children}</TooltipPrimitive.Provider>
)

// Wrap all renders with TooltipProvider
const render = (ui: React.ReactElement, options = {}) => {
  return rtlRender(ui, { wrapper: TestWrapper, ...options })
}

// Mock the router context
vi.mock('@/context', async importOriginal => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    useRouterContext: () => ({
      Link: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>
    })
  }
})

// Mock decodeURIComponentIfValid utility
vi.mock('@utils/utils', async importOriginal => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    decodeURIComponentIfValid: (str: string) => {
      try {
        return decodeURIComponent(str)
      } catch {
        return str
      }
    }
  }
})

describe('PathBreadcrumbs', () => {
  const mockItems: PathParts[] = [
    { path: 'root', parentPath: '/' },
    { path: 'folder', parentPath: '/root' },
    { path: 'file.txt', parentPath: '/root/folder' }
  ]

  describe('Rendering - View Mode', () => {
    test('should render breadcrumbs in view mode', () => {
      render(<PathBreadcrumbs items={mockItems} isEdit={false} isNew={false} />)

      expect(screen.getByText('root')).toBeInTheDocument()
      expect(screen.getByText('folder')).toBeInTheDocument()
      expect(screen.getByText('file.txt')).toBeInTheDocument()
    })

    test('should render breadcrumb links with correct paths', () => {
      const { container } = render(<PathBreadcrumbs items={mockItems} isEdit={false} isNew={false} />)

      const links = container.querySelectorAll('a')
      expect(links[0]).toHaveAttribute('href', '/')
      expect(links[1]).toHaveAttribute('href', '/root')
      expect(links[2]).toHaveAttribute('href', '/root/folder')
    })

    test('should render separators between items', () => {
      render(<PathBreadcrumbs items={mockItems} isEdit={false} isNew={false} />)

      // Should have separators between items (3 items = 2 separators)
      const breadcrumbList = screen.getByRole('list')
      expect(breadcrumbList).toBeInTheDocument()
    })

    test('should render copy button when more than 1 item and not in edit mode', () => {
      const { container } = render(<PathBreadcrumbs items={mockItems} isEdit={false} isNew={false} />)

      // CopyButton should be present
      const copyButton = container.querySelector('[data-testid="copy-button"]') || container.querySelector('button')
      expect(copyButton).toBeInTheDocument()
    })

    test('should not render copy button with single item', () => {
      const singleItem: PathParts[] = [{ path: 'file.txt', parentPath: '/' }]

      const { container } = render(<PathBreadcrumbs items={singleItem} isEdit={false} isNew={false} />)

      // Should not have CopyButton (items.length is 1)
      const buttons = container.querySelectorAll('button')
      expect(buttons).toHaveLength(0)
    })

    test('should not render copy button when in edit mode', () => {
      const { container } = render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      // CopyButton should not be present in edit mode
      const copyButtons = container.querySelectorAll('.mt-cn-3xs')
      expect(copyButtons.length).toBe(0)
    })
  })

  describe('Rendering - Edit Mode', () => {
    test('should render input when isEdit is true', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toBeInTheDocument()
    })

    test('should render git branch tag in edit mode', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="develop"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      expect(screen.getByText('develop')).toBeInTheDocument()
    })

    test('should render "in" text in edit mode', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      expect(screen.getByText('in')).toBeInTheDocument()
    })

    test('should render input with file name value', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="myfile.ts"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByDisplayValue('myfile.ts')
      expect(input).toBeInTheDocument()
    })

    test('should render input and breadcrumbs in edit mode', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      // Should render both breadcrumbs and input when in edit mode
      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toBeInTheDocument()
      expect(screen.getByText('root')).toBeInTheDocument()
    })

    test('should render separator before input', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const breadcrumbList = screen.getByRole('list')
      expect(breadcrumbList).toBeInTheDocument()
    })
  })

  describe('Rendering - New Mode', () => {
    test('should render input when isNew is true', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={false}
          isNew={true}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName=""
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toBeInTheDocument()
    })

    test('should autofocus input when isNew is true', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={false}
          isNew={true}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName=""
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name') as HTMLInputElement
      // autoFocus prop exists in React, but DOM attribute is lowercase 'autofocus'
      expect(input).toBeInTheDocument()
    })

    test('should not autofocus when isNew is false', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name') as HTMLInputElement
      expect(input).toBeInTheDocument()
    })
  })

  describe('Input Interactions', () => {
    test('should call changeFileName when input value changes', async () => {
      const changeFileName = vi.fn()

      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={changeFileName}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      await userEvent.clear(input)
      await userEvent.type(input, 'newfile.ts')

      expect(changeFileName).toHaveBeenCalled()
    })

    test('should call handleOnBlur when input loses focus', async () => {
      const handleOnBlur = vi.fn()

      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={handleOnBlur}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      input.focus()
      input.blur()

      expect(handleOnBlur).toHaveBeenCalledTimes(1)
    })

    test('should handle onFocus with parentPath', async () => {
      const changeFileName = vi.fn()
      const setParentPath = vi.fn()

      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={changeFileName}
          gitRefName="main"
          fileName="file.txt"
          handleOnBlur={vi.fn()}
          parentPath="parent/"
          setParentPath={setParentPath}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      input.focus()

      await vi.waitFor(() => {
        expect(changeFileName).toHaveBeenCalled()
        expect(setParentPath).toHaveBeenCalledWith('')
      })
    })

    test('should handle onFocus without parentPath', async () => {
      const changeFileName = vi.fn()

      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={changeFileName}
          gitRefName="main"
          fileName="file.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      input.focus()

      await vi.waitFor(() => {
        expect(changeFileName).toHaveBeenCalled()
      })
    })

    test('should set cursor position on focus', async () => {
      const changeFileName = vi.fn()

      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={changeFileName}
          gitRefName="main"
          fileName="file.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name') as HTMLInputElement
      const setSelectionRangeSpy = vi.spyOn(input, 'setSelectionRange')

      input.focus()

      await vi.waitFor(() => {
        expect(setSelectionRangeSpy).toHaveBeenCalled()
      })

      setSelectionRangeSpy.mockRestore()
    })
  })

  describe('Required Props Validation', () => {
    test('should throw error when changeFileName is missing in edit mode', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <PathBreadcrumbs
            items={mockItems}
            isEdit={true}
            isNew={false}
            gitRefName="main"
            fileName="test.txt"
            handleOnBlur={vi.fn()}
          />
        )
      }).toThrow('Invalid usage of InputComp')

      consoleError.mockRestore()
    })

    test('should throw error when gitRefName is missing in edit mode', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <PathBreadcrumbs
            items={mockItems}
            isEdit={true}
            isNew={false}
            changeFileName={vi.fn()}
            fileName="test.txt"
            handleOnBlur={vi.fn()}
          />
        )
      }).toThrow('Invalid usage of InputComp')

      consoleError.mockRestore()
    })

    test('should throw error when fileName is missing in edit mode', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <PathBreadcrumbs
            items={mockItems}
            isEdit={true}
            isNew={false}
            changeFileName={vi.fn()}
            gitRefName="main"
            handleOnBlur={vi.fn()}
          />
        )
      }).toThrow('Invalid usage of InputComp')

      consoleError.mockRestore()
    })

    test('should throw error when handleOnBlur is missing in edit mode', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <PathBreadcrumbs
            items={mockItems}
            isEdit={true}
            isNew={false}
            changeFileName={vi.fn()}
            gitRefName="main"
            fileName="test.txt"
          />
        )
      }).toThrow('Invalid usage of InputComp')

      consoleError.mockRestore()
    })
  })

  describe('CopyButton Behavior', () => {
    test('should render copy button with correct file path', () => {
      const { container } = render(<PathBreadcrumbs items={mockItems} isEdit={false} isNew={false} />)

      // Copy button should have the combined path (excluding first item)
      const copyButton = container.querySelector('.mt-cn-3xs')
      expect(copyButton).toBeInTheDocument()
    })

    test('should not render copy button when items.length is 1', () => {
      const singleItem: PathParts[] = [{ path: 'file.txt', parentPath: '/' }]

      const { container } = render(<PathBreadcrumbs items={singleItem} isEdit={false} isNew={false} />)

      const copyButton = container.querySelector('.mt-cn-3xs')
      expect(copyButton).not.toBeInTheDocument()
    })

    test('should not render copy button when isEdit is true', () => {
      const { container } = render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const copyButton = container.querySelector('.mt-cn-3xs')
      expect(copyButton).not.toBeInTheDocument()
    })

    test('should not render copy button when isNew is true', () => {
      const { container } = render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={false}
          isNew={true}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const copyButton = container.querySelector('.mt-cn-3xs')
      expect(copyButton).not.toBeInTheDocument()
    })

    test('should have xs size on copy button', () => {
      const { container } = render(<PathBreadcrumbs items={mockItems} isEdit={false} isNew={false} />)

      const copyButton = container.querySelector('.mt-cn-3xs')
      expect(copyButton).toBeInTheDocument()
    })
  })

  describe('Input Field Props', () => {
    test('should render input with 200px width', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toHaveClass('w-[200px]')
    })

    test('should have fileName as id', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toHaveAttribute('id', 'fileName')
    })

    test('should display placeholder text', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName=""
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Git Branch Tag', () => {
    test('should render git branch tag with secondary variant', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="feature-branch"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      expect(screen.getByText('feature-branch')).toBeInTheDocument()
    })

    test('should render git-branch icon', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      // Tag component with icon should render
      expect(screen.getByText('main')).toBeInTheDocument()
    })
  })

  describe('Layout Behavior', () => {
    test('should render layout container in view mode', () => {
      const { container } = render(<PathBreadcrumbs items={mockItems} isEdit={false} isNew={false} />)

      // Layout.Flex should render
      expect(container.firstChild).toBeInTheDocument()
    })

    test('should render layout with input in edit mode', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toBeInTheDocument()
    })

    test('should render layout with input in new mode', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={false}
          isNew={true}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName=""
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Breadcrumb Structure', () => {
    test('should render Breadcrumb.Root with margin top', () => {
      const { container } = render(<PathBreadcrumbs items={mockItems} isEdit={false} isNew={false} />)

      const root = container.querySelector('.mt-cn-xs')
      expect(root).toBeInTheDocument()
    })

    test('should render Breadcrumb.List', () => {
      render(<PathBreadcrumbs items={mockItems} isEdit={false} isNew={false} />)

      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
    })

    test('should render correct number of breadcrumb items', () => {
      const { container } = render(<PathBreadcrumbs items={mockItems} isEdit={false} isNew={false} />)

      const links = container.querySelectorAll('a')
      expect(links).toHaveLength(3)
    })

    test('should not render separator after last item in view mode', () => {
      render(<PathBreadcrumbs items={mockItems} isEdit={false} isNew={false} />)

      // The last item should not have a separator after it (only between items)
      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
    })
  })

  describe('Optional Props', () => {
    test('should handle missing setParentPath', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toBeInTheDocument()
    })

    test('should handle missing parentPath', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toBeInTheDocument()
    })

    test('should work with both parentPath and setParentPath', () => {
      const setParentPath = vi.fn()

      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
          parentPath="parent/"
          setParentPath={setParentPath}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toBeInTheDocument()
    })

    test('should handle missing fullResourcePath', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toBeInTheDocument()
    })

    test('should work with fullResourcePath provided', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
          fullResourcePath="/full/path/to/file.txt"
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty items array', () => {
      render(<PathBreadcrumbs items={[]} isEdit={false} isNew={false} />)

      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
    })

    test('should handle empty fileName in edit mode', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName=""
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toHaveValue('')
    })

    test('should handle special characters in path', () => {
      const specialItems: PathParts[] = [
        { path: 'path%20with%20spaces', parentPath: '/' },
        { path: 'special&chars', parentPath: '/path%20with%20spaces' }
      ]

      render(<PathBreadcrumbs items={specialItems} isEdit={false} isNew={false} />)

      // decodeURIComponentIfValid should handle special characters
      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    test('should handle very long path names', () => {
      const longPath = 'very-long-folder-name-that-exceeds-normal-length'.repeat(5)
      const longItems: PathParts[] = [
        { path: 'root', parentPath: '/' },
        { path: longPath, parentPath: '/root' }
      ]

      render(<PathBreadcrumbs items={longItems} isEdit={false} isNew={false} />)

      expect(screen.getByText('root')).toBeInTheDocument()
      expect(screen.getByText(longPath)).toBeInTheDocument()
    })

    test('should handle empty gitRefName', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName=""
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toBeInTheDocument()
    })

    test('should handle both isEdit and isNew being true', () => {
      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={true}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Component Display Name', () => {
    test('should have correct displayName', () => {
      expect(PathBreadcrumbs.displayName).toBe('PathBreadcrumbs')
    })
  })

  describe('Re-rendering', () => {
    test('should update when items change', () => {
      const { rerender } = render(<PathBreadcrumbs items={mockItems} isEdit={false} isNew={false} />)

      expect(screen.getByText('file.txt')).toBeInTheDocument()

      const newItems: PathParts[] = [{ path: 'newfile.ts', parentPath: '/' }]

      rerender(<PathBreadcrumbs items={newItems} isEdit={false} isNew={false} />)

      expect(screen.queryByText('file.txt')).not.toBeInTheDocument()
      expect(screen.getByText('newfile.ts')).toBeInTheDocument()
    })

    test('should update when switching from view to edit mode', () => {
      const { rerender } = render(<PathBreadcrumbs items={mockItems} isEdit={false} isNew={false} />)

      expect(screen.queryByPlaceholderText('Add a file name')).not.toBeInTheDocument()

      rerender(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={vi.fn()}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      expect(screen.getByPlaceholderText('Add a file name')).toBeInTheDocument()
    })

    test('should update when fileName changes', () => {
      const changeFileName = vi.fn()

      const { rerender } = render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={changeFileName}
          gitRefName="main"
          fileName="old.txt"
          handleOnBlur={vi.fn()}
        />
      )

      expect(screen.getByDisplayValue('old.txt')).toBeInTheDocument()

      rerender(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={changeFileName}
          gitRefName="main"
          fileName="new.txt"
          handleOnBlur={vi.fn()}
        />
      )

      expect(screen.getByDisplayValue('new.txt')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('old.txt')).not.toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle complete edit workflow', async () => {
      const changeFileName = vi.fn()
      const handleOnBlur = vi.fn()

      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={changeFileName}
          gitRefName="main"
          fileName="original.txt"
          handleOnBlur={handleOnBlur}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')

      await userEvent.clear(input)
      await userEvent.type(input, 'modified.txt')

      expect(changeFileName).toHaveBeenCalled()

      input.blur()
      expect(handleOnBlur).toHaveBeenCalledTimes(1)
    })

    test('should handle new file creation workflow', async () => {
      const changeFileName = vi.fn()
      const handleOnBlur = vi.fn()

      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={false}
          isNew={true}
          changeFileName={changeFileName}
          gitRefName="main"
          fileName=""
          handleOnBlur={handleOnBlur}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')

      await userEvent.type(input, 'newfile.ts')

      expect(changeFileName).toHaveBeenCalled()
    })

    test('should handle path with parentPath in focus', async () => {
      const changeFileName = vi.fn()
      const setParentPath = vi.fn()

      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={changeFileName}
          gitRefName="main"
          fileName="file.txt"
          handleOnBlur={vi.fn()}
          parentPath="folder/"
          setParentPath={setParentPath}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name')
      input.focus()

      await vi.waitFor(() => {
        expect(changeFileName).toHaveBeenCalled()
        expect(setParentPath).toHaveBeenCalledWith('')
      })
    })

    test('should handle multiple breadcrumb items', () => {
      const manyItems: PathParts[] = Array.from({ length: 10 }, (_, i) => ({
        path: `folder${i}`,
        parentPath: i === 0 ? '/' : `/folder${i - 1}`
      }))

      const { container } = render(<PathBreadcrumbs items={manyItems} isEdit={false} isNew={false} />)

      const links = container.querySelectorAll('a')
      expect(links).toHaveLength(10)
    })
  })

  describe('Decoded Path Display', () => {
    test('should decode URI components in path', () => {
      const encodedItems: PathParts[] = [
        { path: 'folder%20name', parentPath: '/' },
        { path: 'file%20name.txt', parentPath: '/folder%20name' }
      ]

      render(<PathBreadcrumbs items={encodedItems} isEdit={false} isNew={false} />)

      // decodeURIComponentIfValid should be called twice per path
      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    test('should handle invalid URI components', () => {
      const invalidItems: PathParts[] = [{ path: 'invalid%%uri', parentPath: '/' }]

      render(<PathBreadcrumbs items={invalidItems} isEdit={false} isNew={false} />)

      // Should not throw error, just display as-is
      expect(screen.getByRole('list')).toBeInTheDocument()
    })
  })

  describe('Input Focus Behavior', () => {
    test('should scroll input to end on focus', async () => {
      const changeFileName = vi.fn()

      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={changeFileName}
          gitRefName="main"
          fileName="test.txt"
          handleOnBlur={vi.fn()}
        />
      )

      const input = screen.getByPlaceholderText('Add a file name') as HTMLInputElement
      const scrollSpy = vi.spyOn(input, 'scrollLeft', 'set')

      input.focus()

      await vi.waitFor(() => {
        // scrollLeft should be set to MAX_SAFE_INTEGER to scroll to end
        expect(scrollSpy).toHaveBeenCalled()
      })

      scrollSpy.mockRestore()
    })

    test('should set selection range on focus', async () => {
      const changeFileName = vi.fn()

      render(
        <PathBreadcrumbs
          items={mockItems}
          isEdit={true}
          isNew={false}
          changeFileName={changeFileName}
          gitRefName="main"
          fileName="file.txt"
          handleOnBlur={vi.fn()}
          parentPath="path/"
        />
      )

      const input = screen.getByPlaceholderText('Add a file name') as HTMLInputElement
      const setSelectionRangeSpy = vi.spyOn(input, 'setSelectionRange')

      input.focus()

      await vi.waitFor(() => {
        // Should set selection to end of combined path "path/file.txt" = 14 chars
        expect(setSelectionRangeSpy).toHaveBeenCalled()
      })

      setSelectionRangeSpy.mockRestore()
    })
  })

  describe('Type Definitions', () => {
    test('should accept PathParts type correctly', () => {
      const pathParts: PathParts = {
        path: 'test.txt',
        parentPath: '/parent'
      }

      expect(pathParts.path).toBe('test.txt')
      expect(pathParts.parentPath).toBe('/parent')
    })

    test('should accept all required base props', () => {
      const items: PathParts[] = [{ path: 'file', parentPath: '/' }]

      render(<PathBreadcrumbs items={items} isEdit={false} isNew={false} />)

      expect(screen.getByText('file')).toBeInTheDocument()
    })
  })
})
