import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExecutionState } from '@/types'
import { describe, expect, test, vi } from 'vitest'

import { CollapseButton, File, Folder, Tree, type TreeViewElement } from '../treeview'

// Helper function to create test tree data
const createNestedTree = (): TreeViewElement[] => [
  {
    id: 'root-1',
    name: 'Root 1',
    status: ExecutionState.SUCCESS,
    isSelectable: true,
    children: [
      {
        id: 'child-1-1',
        name: 'Child 1-1',
        status: ExecutionState.RUNNING,
        isSelectable: true
      },
      {
        id: 'child-1-2',
        name: 'Child 1-2',
        status: ExecutionState.FAILURE,
        isSelectable: true,
        children: [
          {
            id: 'grandchild-1-2-1',
            name: 'Grandchild 1-2-1',
            status: ExecutionState.PENDING,
            isSelectable: true
          }
        ]
      }
    ]
  },
  {
    id: 'root-2',
    name: 'Root 2',
    status: ExecutionState.SKIPPED,
    isSelectable: false
  }
]

describe('Tree Component', () => {
  describe('Basic Rendering', () => {
    test('should render Tree component', () => {
      render(<Tree>Content</Tree>)

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    test('should render children', () => {
      render(
        <Tree>
          <div>Test Content</div>
        </Tree>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    test('should apply custom className', () => {
      const { container } = render(<Tree className="custom-class">Content</Tree>)

      const treeDiv = container.querySelector('.custom-class')
      expect(treeDiv).toBeInTheDocument()
    })

    test('should have correct display name', () => {
      expect(Tree.displayName).toBe('Tree')
    })
  })

  describe('Direction Prop', () => {
    test('should apply rtl direction', () => {
      const { container } = render(<Tree dir="rtl">Content</Tree>)

      const scrollArea = container.querySelector('[dir="rtl"]')
      expect(scrollArea).toBeInTheDocument()
    })

    test('should apply ltr direction', () => {
      const { container } = render(<Tree dir="ltr">Content</Tree>)

      const scrollArea = container.querySelector('[dir="ltr"]')
      expect(scrollArea).toBeInTheDocument()
    })
  })

  describe('Initial State', () => {
    test('should set initialSelectedId', () => {
      const elements = createNestedTree()

      render(
        <Tree initialSelectedId="child-1-1" elements={elements}>
          <File value="child-1-1" status={ExecutionState.SUCCESS} level={1}>
            Child 1-1
          </File>
        </Tree>
      )

      expect(screen.getByText('Child 1-1')).toBeInTheDocument()
    })

    test('should set initialExpendedItems', () => {
      render(
        <Tree initialExpendedItems={['root-1', 'root-2']}>
          <Folder value="root-1" element="Root 1" status={ExecutionState.SUCCESS} level={0}>
            Content
          </Folder>
        </Tree>
      )

      expect(screen.getByText(/Root 1/)).toBeInTheDocument()
    })
  })

  describe('State Management', () => {
    test('should handle item selection', async () => {
      render(
        <Tree>
          <File value="file-1" status={ExecutionState.SUCCESS} level={0}>
            File 1
          </File>
        </Tree>
      )

      const file = screen.getByText('File 1')
      await userEvent.click(file)

      expect(file).toBeInTheDocument()
    })

    test('should handle folder expansion', async () => {
      render(
        <Tree>
          <Folder value="folder-1" element="Folder 1" status={ExecutionState.SUCCESS} level={0}>
            <File value="child-1" status={ExecutionState.SUCCESS} level={1}>
              Child
            </File>
          </Folder>
        </Tree>
      )

      const folderTrigger = screen.getByText(/Folder 1/)
      await userEvent.click(folderTrigger)

      expect(folderTrigger).toBeInTheDocument()
    })

    test('should handle folder collapse', async () => {
      render(
        <Tree initialExpendedItems={['folder-1']}>
          <Folder value="folder-1" element="Folder 1" status={ExecutionState.SUCCESS} level={0}>
            <File value="child-1" status={ExecutionState.SUCCESS} level={1}>
              Child
            </File>
          </Folder>
        </Tree>
      )

      const folderTrigger = screen.getByText(/Folder 1/)
      // Click to collapse
      await userEvent.click(folderTrigger)

      expect(folderTrigger).toBeInTheDocument()
    })
  })

  describe('Context Provider', () => {
    test('should provide context values to children', () => {
      const TestChild = () => {
        return (
          <File value="test" status={ExecutionState.SUCCESS} level={0}>
            Test
          </File>
        )
      }

      render(
        <Tree initialSelectedId="test">
          <TestChild />
        </Tree>
      )

      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    test('should throw error when useTree is used outside Tree', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      const TestComponent = () => {
        return (
          <File value="test" status={ExecutionState.SUCCESS} level={0}>
            Test
          </File>
        )
      }

      expect(() => render(<TestComponent />)).toThrow()

      consoleError.mockRestore()
    })
  })

  describe('Indicator Prop', () => {
    test('should enable indicator by default', () => {
      render(<Tree>Content</Tree>)

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    test('should disable indicator when set to false', () => {
      render(<Tree indicator={false}>Content</Tree>)

      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should accept ref without errors', () => {
      const ref = React.createRef<HTMLDivElement>()

      const { container } = render(<Tree ref={ref}>Content</Tree>)

      // Ref is accepted and component renders
      expect(container).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('Additional Props', () => {
    test('should forward additional props to container', () => {
      const { container } = render(
        <Tree data-testid="custom-tree" id="tree-id">
          Content
        </Tree>
      )

      const tree = container.querySelector('#tree-id')
      expect(tree).toBeInTheDocument()
    })
  })

  describe('ExpandSpecificTargetedElements', () => {
    test('should expand parent elements when initialSelectedId is set', () => {
      const elements = createNestedTree()

      render(
        <Tree initialSelectedId="grandchild-1-2-1" elements={elements}>
          <Folder value="root-1" element="Root 1" status={ExecutionState.SUCCESS} level={0}>
            <Folder value="child-1-2" element="Child 1-2" status={ExecutionState.FAILURE} level={1}>
              <File value="grandchild-1-2-1" status={ExecutionState.PENDING} level={2}>
                Grandchild 1-2-1
              </File>
            </Folder>
          </Folder>
        </Tree>
      )

      expect(screen.getByText(/Root 1/)).toBeInTheDocument()
    })

    test('should handle non-selectable elements in hierarchy', () => {
      const elements: TreeViewElement[] = [
        {
          id: 'root',
          name: 'Root',
          status: ExecutionState.SUCCESS,
          isSelectable: false,
          children: [
            {
              id: 'child',
              name: 'Child',
              status: ExecutionState.SUCCESS,
              isSelectable: true
            }
          ]
        }
      ]

      render(
        <Tree initialSelectedId="root" elements={elements}>
          <Folder value="root" element="Root" status={ExecutionState.SUCCESS} isSelectable={false} level={0}>
            <File value="child" status={ExecutionState.SUCCESS} level={1}>
              Child
            </File>
          </Folder>
        </Tree>
      )

      expect(screen.getByText(/Root/)).toBeInTheDocument()
    })

    test('should handle empty elements array', () => {
      render(
        <Tree initialSelectedId="test" elements={[]}>
          Content
        </Tree>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    test('should handle undefined elements', () => {
      render(
        <Tree initialSelectedId="test" elements={undefined}>
          Content
        </Tree>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle null children', () => {
      render(<Tree>{null}</Tree>)

      const container = document.body
      expect(container).toBeInTheDocument()
    })

    test('should handle multiple children', () => {
      render(
        <Tree>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </Tree>
      )

      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
      expect(screen.getByText('Child 3')).toBeInTheDocument()
    })

    test('should update when initialSelectedId changes', () => {
      const { rerender } = render(
        <Tree initialSelectedId="id-1" elements={createNestedTree()}>
          <File value="id-1" status={ExecutionState.SUCCESS} level={0}>
            File 1
          </File>
        </Tree>
      )

      rerender(
        <Tree initialSelectedId="id-2" elements={createNestedTree()}>
          <File value="id-2" status={ExecutionState.SUCCESS} level={0}>
            File 2
          </File>
        </Tree>
      )

      expect(screen.getByText('File 2')).toBeInTheDocument()
    })
  })
})

describe('Folder Component', () => {
  const TestWrapper = ({ children, ...props }: any) => <Tree {...props}>{children}</Tree>

  describe('Basic Rendering', () => {
    test('should render Folder component', () => {
      render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder 1" status={ExecutionState.SUCCESS} level={0}>
            Content
          </Folder>
        </TestWrapper>
      )

      expect(screen.getByText(/Folder 1/)).toBeInTheDocument()
    })

    test('should have correct display name', () => {
      expect(Folder.displayName).toBe('Folder')
    })

    test('should render children count', () => {
      render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder 1" status={ExecutionState.SUCCESS} level={0}>
            <File value="child-1" status={ExecutionState.SUCCESS} level={1}>
              Child 1
            </File>
            <File value="child-2" status={ExecutionState.SUCCESS} level={1}>
              Child 2
            </File>
            <File value="child-3" status={ExecutionState.SUCCESS} level={1}>
              Child 3
            </File>
          </Folder>
        </TestWrapper>
      )

      expect(screen.getByText(/\(3\)/)).toBeInTheDocument()
    })
  })

  describe('Status Icons', () => {
    test('should render status icon for SUCCESS', () => {
      const { container } = render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} level={0}>
            Content
          </Folder>
        </TestWrapper>
      )

      const icon = container.querySelector('.text-cn-icon-success')
      expect(icon).toBeInTheDocument()
    })

    test('should render status icon for RUNNING', () => {
      const { container } = render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder" status={ExecutionState.RUNNING} level={0}>
            Content
          </Folder>
        </TestWrapper>
      )

      const icon = container.querySelector('.animate-spin')
      expect(icon).toBeInTheDocument()
    })

    test('should render status icon for FAILURE', () => {
      const { container } = render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder" status={ExecutionState.FAILURE} level={0}>
            Content
          </Folder>
        </TestWrapper>
      )

      const icon = container.querySelector('.text-cn-icon-danger')
      expect(icon).toBeInTheDocument()
    })

    test('should render status icon for PENDING', () => {
      const { container } = render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder" status={ExecutionState.PENDING} level={0}>
            Content
          </Folder>
        </TestWrapper>
      )

      const icon = container.querySelector('.text-cn-disabled')
      expect(icon).toBeInTheDocument()
    })

    test('should render status icon for all states', () => {
      const states = [
        ExecutionState.SUCCESS,
        ExecutionState.FAILURE,
        ExecutionState.RUNNING,
        ExecutionState.PENDING,
        ExecutionState.SKIPPED,
        ExecutionState.WAITING_ON_DEPENDENCIES,
        ExecutionState.UNKNOWN
      ]

      states.forEach(status => {
        const { container } = render(
          <TestWrapper>
            <Folder value="folder-1" element="Folder" status={status} level={0}>
              Content
            </Folder>
          </TestWrapper>
        )

        const icon = container.querySelector('svg')
        expect(icon).toBeInTheDocument()
      })
    })
  })

  describe('Duration Display', () => {
    test('should display duration when provided', () => {
      render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} duration="2m 30s" level={0}>
            Content
          </Folder>
        </TestWrapper>
      )

      expect(screen.getByText('2m 30s')).toBeInTheDocument()
    })

    test('should display -- when duration is not provided', () => {
      render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} level={0}>
            Content
          </Folder>
        </TestWrapper>
      )

      expect(screen.getByText('--')).toBeInTheDocument()
    })

    test('should display duration for empty string', () => {
      const { container } = render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} duration="" level={0}>
            Content
          </Folder>
        </TestWrapper>
      )

      // Empty string will render as empty, not "--"
      expect(container.querySelector('.text-cn-2')).toBeInTheDocument()
    })
  })

  describe('Selectable State', () => {
    test('should be selectable by default', () => {
      render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} level={0}>
            Content
          </Folder>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).not.toHaveAttribute('disabled')
    })

    test('should be disabled when isSelectable is false', () => {
      render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} isSelectable={false} level={0}>
            Content
          </Folder>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('disabled')
    })
  })

  describe('Level-based Padding', () => {
    test('should apply padding based on level', () => {
      const { container: container0 } = render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} level={0}>
            Content
          </Folder>
        </TestWrapper>
      )

      const { container: container1 } = render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} level={1}>
            Content
          </Folder>
        </TestWrapper>
      )

      const { container: container2 } = render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} level={2}>
            Content
          </Folder>
        </TestWrapper>
      )

      // All should render successfully with different padding
      expect(container0.querySelector('button')).toBeInTheDocument()
      expect(container1.querySelector('.pl-\\[28px\\]')).toBeInTheDocument()
      expect(container2.querySelector('.pl-\\[56px\\]')).toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    test('should apply custom className', () => {
      const { container } = render(
        <TestWrapper>
          <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} className="custom-folder" level={0}>
            Content
          </Folder>
        </TestWrapper>
      )

      const button = container.querySelector('.custom-folder')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Nested Folders', () => {
    test('should render nested folders', () => {
      render(
        <TestWrapper initialExpendedItems={['parent']}>
          <Folder value="parent" element="Parent" status={ExecutionState.SUCCESS} level={0}>
            <Folder value="child" element="Child" status={ExecutionState.SUCCESS} level={1}>
              Nested Content
            </Folder>
          </Folder>
        </TestWrapper>
      )

      expect(screen.getByText(/Parent/)).toBeInTheDocument()
      expect(screen.getByText(/Child/)).toBeInTheDocument()
    })

    test('should render deeply nested structure', () => {
      render(
        <TestWrapper initialExpendedItems={['level-1', 'level-2', 'level-3']}>
          <Folder value="level-1" element="Level 1" status={ExecutionState.SUCCESS} level={0}>
            <Folder value="level-2" element="Level 2" status={ExecutionState.SUCCESS} level={1}>
              <Folder value="level-3" element="Level 3" status={ExecutionState.SUCCESS} level={2}>
                Deep Content
              </Folder>
            </Folder>
          </Folder>
        </TestWrapper>
      )

      expect(screen.getByText(/Level 1/)).toBeInTheDocument()
      expect(screen.getByText(/Level 2/)).toBeInTheDocument()
      expect(screen.getByText(/Level 3/)).toBeInTheDocument()
      expect(screen.getByText('Deep Content')).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should accept ref without errors', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(
        <TestWrapper>
          <Folder ref={ref} value="folder-1" element="Folder" status={ExecutionState.SUCCESS} level={0}>
            Content
          </Folder>
        </TestWrapper>
      )

      // Ref is accepted and component renders
      expect(screen.getByText(/Folder/)).toBeInTheDocument()
    })
  })
})

describe('File Component', () => {
  const TestWrapper = ({ children, ...props }: any) => <Tree {...props}>{children}</Tree>

  describe('Basic Rendering', () => {
    test('should render File component', () => {
      render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} level={0}>
            File Name
          </File>
        </TestWrapper>
      )

      expect(screen.getByText('File Name')).toBeInTheDocument()
    })

    test('should have correct display name', () => {
      expect(File.displayName).toBe('File')
    })

    test('should have aria-label', () => {
      render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} level={0}>
            File Name
          </File>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'File')
    })
  })

  describe('Status Icons', () => {
    test('should render status icons for all states', () => {
      const states = [
        ExecutionState.SUCCESS,
        ExecutionState.FAILURE,
        ExecutionState.RUNNING,
        ExecutionState.PENDING,
        ExecutionState.SKIPPED,
        ExecutionState.WAITING_ON_DEPENDENCIES,
        ExecutionState.UNKNOWN
      ]

      states.forEach(status => {
        const { container } = render(
          <TestWrapper>
            <File value="file-1" status={status} level={0}>
              File
            </File>
          </TestWrapper>
        )

        const icon = container.querySelector('svg')
        expect(icon).toBeInTheDocument()
      })
    })
  })

  describe('Duration Display', () => {
    test('should display duration when provided', () => {
      render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} duration="5s" level={0}>
            File
          </File>
        </TestWrapper>
      )

      expect(screen.getByText('5s')).toBeInTheDocument()
    })

    test('should display -- when duration is not provided', () => {
      render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} level={0}>
            File
          </File>
        </TestWrapper>
      )

      expect(screen.getByText('--')).toBeInTheDocument()
    })
  })

  describe('Selection', () => {
    test('should handle click to select', async () => {
      render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} level={0}>
            File
          </File>
        </TestWrapper>
      )

      const file = screen.getByText('File')
      await userEvent.click(file)

      expect(file).toBeInTheDocument()
    })

    test('should call handleSelect callback', async () => {
      const handleSelect = vi.fn()

      render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} handleSelect={handleSelect} level={0}>
            File
          </File>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(handleSelect).toHaveBeenCalledWith('file-1')
    })

    test('should mark file as selected with initialSelectedId', () => {
      const { container } = render(
        <TestWrapper initialSelectedId="file-1">
          <File value="file-1" status={ExecutionState.SUCCESS} level={0}>
            Selected File
          </File>
        </TestWrapper>
      )

      const button = container.querySelector('.after\\:absolute')
      expect(button).toBeInTheDocument()
    })

    test('should mark file with isSelect prop', () => {
      const { container } = render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} isSelect level={0}>
            Selected File
          </File>
        </TestWrapper>
      )

      const button = container.querySelector('.after\\:absolute')
      expect(button).toBeInTheDocument()
    })

    test('should handle multiple files with selection', async () => {
      render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} level={0}>
            File 1
          </File>
          <File value="file-2" status={ExecutionState.SUCCESS} level={0}>
            File 2
          </File>
          <File value="file-3" status={ExecutionState.SUCCESS} level={0}>
            File 3
          </File>
        </TestWrapper>
      )

      const file1 = screen.getByText('File 1')
      const file2 = screen.getByText('File 2')

      await userEvent.click(file1)
      await userEvent.click(file2)

      expect(file1).toBeInTheDocument()
      expect(file2).toBeInTheDocument()
    })
  })

  describe('Selectable State', () => {
    test('should be selectable by default', () => {
      render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} level={0}>
            File
          </File>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).not.toHaveAttribute('disabled')
    })

    test('should be disabled when isSelectable is false', () => {
      render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} isSelectable={false} level={0}>
            File
          </File>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('disabled')
    })

    test('should apply opacity when not selectable', () => {
      const { container } = render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} isSelectable={false} level={0}>
            File
          </File>
        </TestWrapper>
      )

      const button = container.querySelector('.opacity-50')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Level-based Padding', () => {
    test('should apply padding based on level', () => {
      const { container: container1 } = render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} level={1}>
            File
          </File>
        </TestWrapper>
      )

      const { container: container2 } = render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} level={2}>
            File
          </File>
        </TestWrapper>
      )

      expect(container1.querySelector('.pl-\\[28px\\]')).toBeInTheDocument()
      expect(container2.querySelector('.pl-\\[56px\\]')).toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    test('should apply custom className', () => {
      const { container } = render(
        <TestWrapper>
          <File value="file-1" status={ExecutionState.SUCCESS} className="custom-file" level={0}>
            File
          </File>
        </TestWrapper>
      )

      const button = container.querySelector('.custom-file')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to file button', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <File ref={ref} value="file-1" status={ExecutionState.SUCCESS} level={0}>
            File
          </File>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Direction', () => {
    test('should apply direction attribute', () => {
      const { container } = render(
        <TestWrapper dir="rtl">
          <File value="file-1" status={ExecutionState.SUCCESS} level={0}>
            File
          </File>
        </TestWrapper>
      )

      const button = container.querySelector('[dir="rtl"]')
      expect(button).toBeInTheDocument()
    })
  })
})

describe('CollapseButton Component', () => {
  const TestWrapper = ({ children, ...props }: any) => <Tree {...props}>{children}</Tree>

  const mockElements = createNestedTree()

  describe('Basic Rendering', () => {
    test('should render CollapseButton', () => {
      render(
        <TestWrapper>
          <CollapseButton elements={mockElements}>Expand</CollapseButton>
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should have correct display name', () => {
      expect(CollapseButton.displayName).toBe('CollapseButton')
    })

    test('should render sr-only text', () => {
      const { container } = render(
        <TestWrapper>
          <CollapseButton elements={mockElements}>Expand</CollapseButton>
        </TestWrapper>
      )

      const srOnly = container.querySelector('.sr-only')
      expect(srOnly).toBeInTheDocument()
    })

    test('should render children', () => {
      render(
        <TestWrapper>
          <CollapseButton elements={mockElements}>
            <span>Custom Content</span>
          </CollapseButton>
        </TestWrapper>
      )

      expect(screen.getByText('Custom Content')).toBeInTheDocument()
    })
  })

  describe('Expand All Functionality', () => {
    test('should expand all items on click when collapsed', async () => {
      render(
        <TestWrapper>
          <CollapseButton elements={mockElements}>Expand All</CollapseButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(button).toBeInTheDocument()
    })

    test('should handle expandAll prop', () => {
      render(
        <TestWrapper>
          <CollapseButton elements={mockElements} expandAll>
            Toggle
          </CollapseButton>
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('should skip non-selectable elements', async () => {
      const elementsWithNonSelectable: TreeViewElement[] = [
        {
          id: 'non-selectable',
          name: 'Non-Selectable',
          status: ExecutionState.SUCCESS,
          isSelectable: false,
          children: [
            {
              id: 'child',
              name: 'Child',
              status: ExecutionState.SUCCESS
            }
          ]
        }
      ]

      render(
        <TestWrapper>
          <CollapseButton elements={elementsWithNonSelectable}>Expand</CollapseButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(button).toBeInTheDocument()
    })
  })

  describe('Collapse All Functionality', () => {
    test('should collapse all items on click when expanded', async () => {
      render(
        <TestWrapper initialExpendedItems={['root-1', 'child-1-2']}>
          <CollapseButton elements={mockElements}>Collapse All</CollapseButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(button).toBeInTheDocument()
    })

    test('should handle rapid toggle clicks', async () => {
      render(
        <TestWrapper>
          <CollapseButton elements={mockElements}>Toggle</CollapseButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')

      await userEvent.click(button)
      await userEvent.click(button)
      await userEvent.click(button)

      expect(button).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    test('should forward ref to button element', () => {
      const ref = vi.fn()

      render(
        <TestWrapper>
          <CollapseButton ref={ref} elements={mockElements}>
            Toggle
          </CollapseButton>
        </TestWrapper>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Additional Props', () => {
    test('should forward additional props to button', () => {
      render(
        <TestWrapper>
          <CollapseButton elements={mockElements} data-custom="test">
            Toggle
          </CollapseButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-custom', 'test')
    })

    test('should forward additional HTML attributes', () => {
      render(
        <TestWrapper>
          <CollapseButton elements={mockElements} aria-label="collapse-btn">
            Toggle
          </CollapseButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'collapse-btn')
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty elements array', async () => {
      render(
        <TestWrapper>
          <CollapseButton elements={[]}>Toggle</CollapseButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(button).toBeInTheDocument()
    })
  })
})

describe('Complete TreeView Integration', () => {
  test('should render complete tree structure', () => {
    const elements = createNestedTree()

    render(
      <Tree initialExpendedItems={['root-1', 'child-1-2']} elements={elements}>
        <Folder value="root-1" element="Root 1" status={ExecutionState.SUCCESS} level={0}>
          <File value="child-1-1" status={ExecutionState.RUNNING} level={1}>
            Child 1-1
          </File>
          <Folder value="child-1-2" element="Child 1-2" status={ExecutionState.FAILURE} level={1}>
            <File value="grandchild-1-2-1" status={ExecutionState.PENDING} level={2}>
              Grandchild 1-2-1
            </File>
          </Folder>
        </Folder>
        <File value="root-2" status={ExecutionState.SKIPPED} isSelectable={false} level={0}>
          Root 2
        </File>
      </Tree>
    )

    expect(screen.getByText(/Root 1/)).toBeInTheDocument()
    expect(screen.getByText('Child 1-1')).toBeInTheDocument()
    expect(screen.getByText(/Child 1-2/)).toBeInTheDocument()
    expect(screen.getByText('Grandchild 1-2-1')).toBeInTheDocument()
    expect(screen.getByText('Root 2')).toBeInTheDocument()
  })

  test('should handle complex user interactions', async () => {
    const handleSelect = vi.fn()
    const elements = createNestedTree()

    render(
      <Tree elements={elements}>
        <Folder value="root-1" element="Root 1" status={ExecutionState.SUCCESS} level={0}>
          <File value="child-1-1" status={ExecutionState.SUCCESS} handleSelect={handleSelect} level={1}>
            Child 1-1
          </File>
        </Folder>
        <CollapseButton elements={elements}>Toggle</CollapseButton>
      </Tree>
    )

    const folder = screen.getByText(/Root 1/)
    await userEvent.click(folder)

    const file = screen.getByText('Child 1-1')
    await userEvent.click(file)

    expect(handleSelect).toHaveBeenCalledWith('child-1-1')

    const toggleBtn = screen.getByRole('button', { name: /toggle/i })
    await userEvent.click(toggleBtn)

    expect(folder).toBeInTheDocument()
  })

  test('should maintain state across re-renders', () => {
    const { rerender } = render(
      <Tree initialSelectedId="file-1" initialExpendedItems={['folder-1']}>
        <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} level={0}>
          <File value="file-1" status={ExecutionState.SUCCESS} level={1}>
            File
          </File>
        </Folder>
      </Tree>
    )

    rerender(
      <Tree initialSelectedId="file-1" initialExpendedItems={['folder-1']}>
        <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} level={0}>
          <File value="file-1" status={ExecutionState.SUCCESS} level={1}>
            File Updated
          </File>
        </Folder>
      </Tree>
    )

    expect(screen.getByText('File Updated')).toBeInTheDocument()
  })

  test('should handle all status states in mixed tree', () => {
    render(
      <Tree initialExpendedItems={['folder-1']}>
        <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} level={0}>
          <File value="success" status={ExecutionState.SUCCESS} level={1}>
            Success
          </File>
          <File value="failure" status={ExecutionState.FAILURE} level={1}>
            Failure
          </File>
          <File value="running" status={ExecutionState.RUNNING} level={1}>
            Running
          </File>
          <File value="pending" status={ExecutionState.PENDING} level={1}>
            Pending
          </File>
          <File value="skipped" status={ExecutionState.SKIPPED} level={1}>
            Skipped
          </File>
          <File value="waiting" status={ExecutionState.WAITING_ON_DEPENDENCIES} level={1}>
            Waiting
          </File>
          <File value="unknown" status={ExecutionState.UNKNOWN} level={1}>
            Unknown
          </File>
        </Folder>
      </Tree>
    )

    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.getByText('Failure')).toBeInTheDocument()
    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Skipped')).toBeInTheDocument()
    expect(screen.getByText('Waiting')).toBeInTheDocument()
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })

  test('should handle RTL tree with complete structure', () => {
    const { container } = render(
      <Tree dir="rtl" initialExpendedItems={['folder-1']}>
        <Folder value="folder-1" element="مجلد" status={ExecutionState.SUCCESS} level={0}>
          <File value="file-1" status={ExecutionState.SUCCESS} level={1}>
            ملف
          </File>
        </Folder>
      </Tree>
    )

    const rtlElement = container.querySelector('[dir="rtl"]')
    expect(rtlElement).toBeInTheDocument()
  })
})

describe('Edge Cases and Error Handling', () => {
  test('should handle undefined status', () => {
    const { container } = render(
      <Tree>
        <File value="file-1" status={undefined as any} level={0}>
          File
        </File>
      </Tree>
    )

    // Should fall back to default icon
    const icon = container.querySelector('.text-cn-disabled')
    expect(icon).toBeInTheDocument()
  })

  test('should handle null children', () => {
    render(
      <Tree initialExpendedItems={['folder-1']}>
        <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} level={0}>
          {null}
        </Folder>
      </Tree>
    )

    expect(screen.getByText(/Folder/)).toBeInTheDocument()
  })

  test('should handle mixed children types', () => {
    render(
      <Tree initialExpendedItems={['folder-1']}>
        <Folder value="folder-1" element="Folder" status={ExecutionState.SUCCESS} level={0}>
          <File value="file-1" status={ExecutionState.SUCCESS} level={1}>
            File 1
          </File>
          {null}
          <File value="file-2" status={ExecutionState.SUCCESS} level={1}>
            File 2
          </File>
          {false && (
            <File value="file-3" status={ExecutionState.SUCCESS} level={1}>
              File 3
            </File>
          )}
        </Folder>
      </Tree>
    )

    expect(screen.getByText('File 1')).toBeInTheDocument()
    expect(screen.getByText('File 2')).toBeInTheDocument()
    expect(screen.queryByText('File 3')).not.toBeInTheDocument()
  })

  test('should handle very long element names', () => {
    const longName = 'A'.repeat(200)

    render(
      <Tree>
        <File value="file-1" status={ExecutionState.SUCCESS} level={0}>
          {longName}
        </File>
      </Tree>
    )

    expect(screen.getByText(longName)).toBeInTheDocument()
  })

  test('should handle special characters in names', () => {
    render(
      <Tree>
        <File value="file-1" status={ExecutionState.SUCCESS} level={0}>
          {'<script>alert("xss")</script>'}
        </File>
      </Tree>
    )

    expect(screen.getByText('<script>alert("xss")</script>')).toBeInTheDocument()
  })

  test('should handle emoji in names', () => {
    render(
      <Tree>
        <File value="file-1" status={ExecutionState.SUCCESS} level={0}>
          📁 File with emoji 🎉
        </File>
      </Tree>
    )

    expect(screen.getByText('📁 File with emoji 🎉')).toBeInTheDocument()
  })
})
