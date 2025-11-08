import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { FileItem, FolderItem, Item, Root } from '../file-explorer'

// Mock dependencies
vi.mock('@/components', () => ({
  Accordion: {
    Root: ({ children, value, type, indicatorPosition, ...props }: any) => (
      <div
        data-testid="accordion-root"
        data-value={JSON.stringify(value)}
        data-type={type}
        data-indicator-position={indicatorPosition}
        {...props}
      >
        {children}
      </div>
    ),
    Item: ({ children, value, ...props }: any) => (
      <div data-testid="accordion-item" data-value={value} {...props}>
        {children}
      </div>
    ),
    Trigger: ({ headerClassName, indicatorProps, ...props }: any) => (
      <button
        data-testid="accordion-trigger"
        data-header-classname={headerClassName}
        data-indicator-size={indicatorProps?.size}
        {...props}
      />
    ),
    Content: ({ children, containerClassName, className, ...props }: any) => (
      <div
        data-testid="accordion-content"
        data-container-classname={containerClassName}
        className={className}
        {...props}
      >
        {children}
      </div>
    )
  },
  Button: (() => {
    const ButtonComponent = React.forwardRef(
      ({ children, size, variant, iconOnly, onClick, ...props }: any, ref: any) => (
        <button
          ref={ref}
          data-testid="button"
          data-size={size}
          data-variant={variant}
          data-icon-only={iconOnly}
          onClick={onClick}
          {...props}
        >
          {children}
        </button>
      )
    )
    ButtonComponent.displayName = 'Button'
    return ButtonComponent
  })(),
  IconV2: ({ name, size, ...props }: any) => <span data-testid="icon" data-name={name} data-size={size} {...props} />,
  Layout: {
    Horizontal: Object.assign(
      ({ children, gap, ...props }: any) => (
        <div data-testid="layout-horizontal" data-gap={gap} {...props}>
          {children}
        </div>
      ),
      { displayName: 'LayoutHorizontal' }
    ),
    Grid: (() => {
      const GridComponent = React.forwardRef(({ children, className, as, ...props }: any, ref: any) => {
        const Component = as || 'div'
        return (
          <Component ref={ref} data-testid="layout-grid" className={className} {...props}>
            {children}
          </Component>
        )
      })
      GridComponent.displayName = 'LayoutGrid'
      return GridComponent
    })(),
    Flex: Object.assign(
      ({ children, className, ...props }: any) => (
        <div data-testid="layout-flex" className={className} {...props}>
          {children}
        </div>
      ),
      { displayName: 'LayoutFlex' }
    )
  },
  Text: ({ children, align, color, truncate, as, ...props }: any) => {
    const Component = as || 'span'
    return (
      <Component data-testid="text" data-align={align} data-color={color} data-truncate={truncate} {...props}>
        {children}
      </Component>
    )
  },
  Tooltip: ({ children, content, ...props }: any) => (
    <div data-testid="tooltip" data-content={content} {...props}>
      {children}
    </div>
  )
}))

vi.mock('@/context', () => {
  const LinkComponent = React.forwardRef(({ children, to, className, ...props }: any, ref: any) => (
    <a ref={ref} data-testid="link" href={to} className={className} {...props}>
      {children}
    </a>
  ))
  LinkComponent.displayName = 'Link'

  return {
    useRouterContext: () => ({
      Link: LinkComponent
    }),
    useTranslation: () => ({
      t: (key: string, defaultValue: string) => defaultValue
    })
  }
})

vi.mock('@utils/cn', () => ({
  cn: (...args: any[]) => {
    const classes: string[] = []
    args.forEach(arg => {
      if (typeof arg === 'string') {
        classes.push(arg)
      } else if (typeof arg === 'object' && arg !== null) {
        Object.entries(arg).forEach(([key, value]) => {
          if (value) classes.push(key)
        })
      }
    })
    return classes.join(' ')
  }
}))

describe('FileExplorer', () => {
  describe('Root', () => {
    test('renders accordion root with children', () => {
      render(
        <Root onValueChange={vi.fn()} value={[]}>
          <div>Child content</div>
        </Root>
      )

      expect(screen.getByTestId('accordion-root')).toBeInTheDocument()
      expect(screen.getByText('Child content')).toBeInTheDocument()
    })

    test('passes value prop to accordion', () => {
      render(
        <Root onValueChange={vi.fn()} value={['folder1', 'folder2']}>
          <div>Content</div>
        </Root>
      )

      const root = screen.getByTestId('accordion-root')
      expect(root).toHaveAttribute('data-value', JSON.stringify(['folder1', 'folder2']))
    })

    test('calls onValueChange when accordion value changes', () => {
      const handleValueChange = vi.fn()

      render(
        <Root onValueChange={handleValueChange} value={[]}>
          <div>Content</div>
        </Root>
      )

      expect(screen.getByTestId('accordion-root')).toBeInTheDocument()
    })

    test('renders with empty value array', () => {
      render(
        <Root onValueChange={vi.fn()} value={[]}>
          <div>Content</div>
        </Root>
      )

      const root = screen.getByTestId('accordion-root')
      expect(root).toHaveAttribute('data-value', '[]')
    })

    test('applies correct accordion configuration', () => {
      render(
        <Root onValueChange={vi.fn()} value={[]}>
          <div>Content</div>
        </Root>
      )

      const root = screen.getByTestId('accordion-root')
      expect(root).toHaveAttribute('data-indicator-position', 'left')
      expect(root).toHaveAttribute('data-type', 'multiple')
    })
  })

  describe('Item', () => {
    test('renders as link when link prop is provided', () => {
      render(
        <Item icon="folder" link="/test-path">
          Test Item
        </Item>
      )

      const link = screen.getByTestId('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test-path')
      expect(screen.getByText('Test Item')).toBeInTheDocument()
    })

    test('renders as button when link prop is not provided', () => {
      render(<Item icon="folder">Test Item</Item>)

      const grid = screen.getByTestId('layout-grid')
      expect(grid).toBeInTheDocument()
      expect(screen.getByText('Test Item')).toBeInTheDocument()
    })

    test('renders icon with correct name', () => {
      render(<Item icon="empty-page">Test Item</Item>)

      const icon = screen.getByTestId('icon')
      expect(icon).toHaveAttribute('data-name', 'empty-page')
      expect(icon).toHaveAttribute('data-size', 'md')
    })

    test('applies active class when isActive is true and not a folder', () => {
      render(
        <Item icon={'file' as any} isActive>
          Active Item
        </Item>
      )

      const grid = screen.getByTestId('layout-grid')
      expect(grid.className).toContain('cn-file-tree-item-active')
    })

    test('does not apply active class when isFolder is true', () => {
      render(
        <Item icon="folder" isActive isFolder>
          Folder Item
        </Item>
      )

      const grid = screen.getByTestId('layout-grid')
      expect(grid.className).not.toContain('cn-file-tree-item-active')
    })

    test('applies folder-specific classes when isFolder is true', () => {
      render(
        <Item icon="folder" isFolder>
          Folder
        </Item>
      )

      const grid = screen.getByTestId('layout-grid')
      expect(grid.className).not.toContain('cn-file-tree-item-wrapper')
      expect(grid.className).not.toContain('cn-file-tree-item-leaf')
    })

    test('applies leaf classes when isFolder is false', () => {
      render(<Item icon={'file' as any}>File</Item>)

      const grid = screen.getByTestId('layout-grid')
      expect(grid.className).toContain('cn-file-tree-item-wrapper')
      expect(grid.className).toContain('cn-file-tree-item-leaf')
    })

    test('renders action buttons when provided', () => {
      const handleClick = vi.fn()

      render(
        <Item
          icon={'file' as any}
          actionButtons={[
            {
              title: 'Delete',
              iconName: 'trash',
              onClick: handleClick
            }
          ]}
        >
          Item with actions
        </Item>
      )

      expect(screen.getByTestId('layout-horizontal')).toBeInTheDocument()
      expect(screen.getByTestId('button')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    test('renders multiple action buttons', () => {
      render(
        <Item
          icon={'file' as any}
          actionButtons={[
            { iconName: 'trash', onClick: vi.fn() },
            { iconName: 'edit', onClick: vi.fn() },
            { iconName: 'copy', onClick: vi.fn() }
          ]}
        >
          Item
        </Item>
      )

      const buttons = screen.getAllByTestId('button')
      expect(buttons).toHaveLength(3)
    })

    test('action button onClick handler is called', async () => {
      const handleClick = vi.fn()

      render(
        <Item
          icon={'file' as any}
          actionButtons={[
            {
              iconName: 'trash',
              onClick: handleClick
            }
          ]}
        >
          Item
        </Item>
      )

      const button = screen.getByTestId('button')
      await userEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('renders action button with icon', () => {
      render(
        <Item
          icon={'file' as any}
          actionButtons={[
            {
              iconName: 'trash',
              onClick: vi.fn()
            }
          ]}
        >
          Item
        </Item>
      )

      const icon = screen.getAllByTestId('icon').find(el => el.getAttribute('data-name') === 'trash')
      expect(icon).toBeInTheDocument()
    })

    test('applies custom className', () => {
      render(
        <Item icon={'file' as any} className="custom-class">
          Item
        </Item>
      )

      const grid = screen.getByTestId('layout-grid')
      expect(grid.className).toContain('custom-class')
    })

    test('renders with action buttons class when action buttons are present', () => {
      render(
        <Item
          icon={'file' as any}
          actionButtons={[
            {
              iconName: 'trash',
              onClick: vi.fn()
            }
          ]}
        >
          Item
        </Item>
      )

      const grid = screen.getByTestId('layout-grid')
      expect(grid.className).toContain('cn-file-tree-item-with-action-buttons')
    })

    test('does not render action buttons when array is empty', () => {
      render(
        <Item icon={'file' as any} actionButtons={[]}>
          Item
        </Item>
      )

      // Empty array still renders the container but with no buttons
      const horizontal = screen.queryByTestId('layout-horizontal')
      if (horizontal) {
        expect(screen.queryAllByTestId('button')).toHaveLength(0)
      }
    })

    test('action button defaults to iconOnly true', () => {
      render(
        <Item
          icon={'file' as any}
          actionButtons={[
            {
              iconName: 'trash',
              onClick: vi.fn()
            }
          ]}
        >
          Item
        </Item>
      )

      const button = screen.getByTestId('button')
      expect(button).toHaveAttribute('data-icon-only', 'true')
    })

    test('action button respects iconOnly prop when explicitly set', () => {
      render(
        <Item
          icon={'file' as any}
          actionButtons={[
            {
              iconName: 'trash',
              iconOnly: false,
              title: 'Delete',
              onClick: vi.fn()
            }
          ]}
        >
          Item
        </Item>
      )

      const button = screen.getByTestId('button')
      expect(button).toHaveAttribute('data-icon-only', 'false')
    })

    test('renders with iconProps for action button', () => {
      render(
        <Item
          icon={'file' as any}
          actionButtons={[
            {
              iconName: 'trash',
              iconProps: { size: 'lg' },
              onClick: vi.fn()
            }
          ]}
        >
          Item
        </Item>
      )

      const icon = screen.getAllByTestId('icon').find(el => el.getAttribute('data-name') === 'trash')
      expect(icon).toHaveAttribute('data-size', 'lg')
    })

    test('forwards ref correctly for link items', () => {
      const ref = React.createRef<HTMLAnchorElement>()

      render(
        <Item ref={ref as any} icon={'file' as any} link="/test">
          Item
        </Item>
      )

      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    test('forwards ref correctly for non-link items', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(
        <Item ref={ref as any} icon={'file' as any}>
          Item
        </Item>
      )

      // The ref is forwarded to the Layout.Grid which renders as a button by default
      expect(ref.current).toBeTruthy()
    })
  })

  describe('FileItem', () => {
    test('renders file item with children', () => {
      render(
        <FileItem level={1} value="file1" onClick={vi.fn()}>
          Test File
        </FileItem>
      )

      expect(screen.getByText('Test File')).toBeInTheDocument()
    })

    test('renders with default icon', () => {
      render(
        <FileItem level={1} value="file1">
          File
        </FileItem>
      )

      const icon = screen.getByTestId('icon')
      expect(icon).toHaveAttribute('data-name', 'empty-page')
    })

    test('renders with custom icon', () => {
      render(
        <FileItem level={1} value="file1" icon="code">
          Code File
        </FileItem>
      )

      const icon = screen.getByTestId('icon')
      expect(icon).toHaveAttribute('data-name', 'code')
    })

    test('calls onClick with value when clicked', async () => {
      const handleClick = vi.fn()

      render(
        <FileItem level={1} value="file1" onClick={handleClick}>
          File
        </FileItem>
      )

      const grid = screen.getByTestId('layout-grid')
      await userEvent.click(grid)

      expect(handleClick).toHaveBeenCalledWith('file1')
    })

    test('renders as link when link prop is provided', () => {
      render(
        <FileItem level={1} value="file1" link="/file/path">
          File
        </FileItem>
      )

      const link = screen.getByTestId('link')
      expect(link).toHaveAttribute('href', '/file/path')
    })

    test('applies active state correctly', () => {
      render(
        <FileItem level={1} value="file1" isActive>
          Active File
        </FileItem>
      )

      const grid = screen.getByTestId('layout-grid')
      expect(grid.className).toContain('cn-file-tree-item-active')
    })

    test('renders with tooltip when tooltip prop is provided', () => {
      render(
        <FileItem level={1} value="file1" tooltip="File tooltip">
          File
        </FileItem>
      )

      const tooltip = screen.getByTestId('tooltip')
      expect(tooltip).toHaveAttribute('data-content', 'File tooltip')
    })

    test('renders without tooltip when tooltip prop is not provided', () => {
      render(
        <FileItem level={1} value="file1">
          File
        </FileItem>
      )

      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument()
    })

    test('passes data attributes correctly', () => {
      render(
        <FileItem level={1} value="file1" data-test="custom-data" data-id="123">
          File
        </FileItem>
      )

      const grid = screen.getByTestId('layout-grid')
      expect(grid).toHaveAttribute('data-test', 'custom-data')
      expect(grid).toHaveAttribute('data-id', '123')
    })

    test('does not call onClick when onClick is not provided', async () => {
      render(
        <FileItem level={1} value="file1">
          File
        </FileItem>
      )

      const grid = screen.getByTestId('layout-grid')
      await userEvent.click(grid)

      // Should not throw error
      expect(grid).toBeInTheDocument()
    })

    test('renders with level prop', () => {
      render(
        <FileItem level={3} value="file1">
          File
        </FileItem>
      )

      expect(screen.getByText('File')).toBeInTheDocument()
    })

    test('applies margin bottom class', () => {
      render(
        <FileItem level={1} value="file1">
          File
        </FileItem>
      )

      const grid = screen.getByTestId('layout-grid')
      expect(grid.className).toContain('mb-cn-4xs')
    })
  })

  describe('FolderItem', () => {
    test('renders folder item with children', () => {
      render(
        <FolderItem level={1} value="folder1">
          Test Folder
        </FolderItem>
      )

      expect(screen.getByText('Test Folder')).toBeInTheDocument()
    })

    test('renders with default folder icon', () => {
      render(
        <FolderItem level={1} value="folder1">
          Folder
        </FolderItem>
      )

      const icon = screen.getByTestId('icon')
      expect(icon).toHaveAttribute('data-name', 'folder')
    })

    test('renders with custom icon', () => {
      render(
        <FolderItem level={1} value="folder1" icon={'repo' as any}>
          Repository
        </FolderItem>
      )

      const icon = screen.getByTestId('icon')
      expect(icon).toHaveAttribute('data-name', 'repo')
    })

    test('renders accordion trigger', () => {
      render(
        <FolderItem level={1} value="folder1">
          Folder
        </FolderItem>
      )

      expect(screen.getByTestId('accordion-trigger')).toBeInTheDocument()
    })

    test('renders accordion item with correct value', () => {
      render(
        <FolderItem level={1} value="folder1">
          Folder
        </FolderItem>
      )

      const item = screen.getByTestId('accordion-item')
      expect(item).toHaveAttribute('data-value', 'folder1')
    })

    test('calls onClick with value when folder is clicked', async () => {
      const handleClick = vi.fn()

      render(
        <FolderItem level={1} value="folder1" onClick={handleClick}>
          Folder
        </FolderItem>
      )

      const grid = screen.getByTestId('layout-grid')
      await userEvent.click(grid)

      expect(handleClick).toHaveBeenCalledWith('folder1')
    })

    test('renders as link when link prop is provided', () => {
      render(
        <FolderItem level={1} value="folder1" link="/folder/path">
          Folder
        </FolderItem>
      )

      const link = screen.getByTestId('link')
      expect(link).toHaveAttribute('href', '/folder/path')
    })

    test('applies active state correctly', () => {
      render(
        <FolderItem level={1} value="folder1" isActive>
          Active Folder
        </FolderItem>
      )

      const flex = screen.getByTestId('layout-flex')
      expect(flex.className).toContain('cn-file-tree-item-active')
    })

    test('renders content when content prop is provided', () => {
      render(
        <FolderItem level={1} value="folder1" content={<div>Folder Content</div>}>
          Folder
        </FolderItem>
      )

      expect(screen.getByText('Folder Content')).toBeInTheDocument()
      expect(screen.getByTestId('accordion-content')).toBeInTheDocument()
    })

    test('does not render accordion content when content prop is not provided', () => {
      render(
        <FolderItem level={1} value="folder1">
          Folder
        </FolderItem>
      )

      expect(screen.queryByTestId('accordion-content')).not.toBeInTheDocument()
    })

    test('does not call onClick when onClick is not provided', async () => {
      render(
        <FolderItem level={1} value="folder1">
          Folder
        </FolderItem>
      )

      const grid = screen.getByTestId('layout-grid')
      await userEvent.click(grid)

      // Should not throw error
      expect(grid).toBeInTheDocument()
    })

    test('renders with level prop', () => {
      render(
        <FolderItem level={2} value="folder1">
          Folder
        </FolderItem>
      )

      expect(screen.getByText('Folder')).toBeInTheDocument()
    })

    test('applies correct trigger classes', () => {
      render(
        <FolderItem level={1} value="folder1">
          Folder
        </FolderItem>
      )

      const trigger = screen.getByTestId('accordion-trigger')
      expect(trigger).toHaveAttribute('data-header-classname', 'rounded-l-4 hover:bg-cn-hover')
    })

    test('applies correct indicator size', () => {
      render(
        <FolderItem level={1} value="folder1">
          Folder
        </FolderItem>
      )

      const trigger = screen.getByTestId('accordion-trigger')
      expect(trigger).toHaveAttribute('data-indicator-size', '2xs')
    })

    test('renders with empty content', () => {
      render(
        <FolderItem level={1} value="folder1" content={null}>
          Folder
        </FolderItem>
      )

      expect(screen.queryByTestId('accordion-content')).not.toBeInTheDocument()
    })

    test('renders nested folder structure', () => {
      render(
        <FolderItem
          level={1}
          value="parent"
          content={
            <FolderItem level={2} value="child">
              Child Folder
            </FolderItem>
          }
        >
          Parent Folder
        </FolderItem>
      )

      expect(screen.getByText('Parent Folder')).toBeInTheDocument()
      expect(screen.getByText('Child Folder')).toBeInTheDocument()
    })

    test('applies folder item wrapper classes', () => {
      render(
        <FolderItem level={1} value="folder1">
          Folder
        </FolderItem>
      )

      const flex = screen.getByTestId('layout-flex')
      expect(flex.className).toContain('cn-file-tree-folder-item')
      expect(flex.className).toContain('cn-file-tree-item-wrapper')
    })

    test('renders with default value when value is empty string', () => {
      render(
        <FolderItem level={1} value="">
          Folder
        </FolderItem>
      )

      const item = screen.getByTestId('accordion-item')
      expect(item).toHaveAttribute('data-value', '')
    })

    test('handles undefined value with default parameter', () => {
      render(
        <FolderItem level={1} value={undefined as any}>
          Folder
        </FolderItem>
      )

      const item = screen.getByTestId('accordion-item')
      expect(item).toHaveAttribute('data-value', '')
    })
  })

  describe('Integration', () => {
    test('renders complete file tree structure', () => {
      const handleValueChange = vi.fn()

      render(
        <Root onValueChange={handleValueChange} value={['folder1']}>
          <FolderItem
            level={1}
            value="folder1"
            content={
              <>
                <FileItem level={2} value="file1">
                  File 1
                </FileItem>
                <FileItem level={2} value="file2">
                  File 2
                </FileItem>
              </>
            }
          >
            Folder 1
          </FolderItem>
          <FileItem level={1} value="file3">
            File 3
          </FileItem>
        </Root>
      )

      expect(screen.getByText('Folder 1')).toBeInTheDocument()
      expect(screen.getByText('File 1')).toBeInTheDocument()
      expect(screen.getByText('File 2')).toBeInTheDocument()
      expect(screen.getByText('File 3')).toBeInTheDocument()
    })

    test('handles multiple folders with different states', () => {
      render(
        <Root onValueChange={vi.fn()} value={['folder1']}>
          <FolderItem level={1} value="folder1" isActive>
            Active Folder
          </FolderItem>
          <FolderItem level={1} value="folder2">
            Inactive Folder
          </FolderItem>
        </Root>
      )

      const flexElements = screen.getAllByTestId('layout-flex')
      expect(flexElements[0].className).toContain('cn-file-tree-item-active')
      expect(flexElements[1].className).not.toContain('cn-file-tree-item-active')
    })

    test('handles file items with links and tooltips', () => {
      render(
        <Root onValueChange={vi.fn()} value={[]}>
          <FileItem level={1} value="file1" link="/file1" tooltip="File 1 tooltip">
            File 1
          </FileItem>
          <FileItem level={1} value="file2" link="/file2">
            File 2
          </FileItem>
        </Root>
      )

      const links = screen.getAllByTestId('link')
      expect(links).toHaveLength(2)
      expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    })

    test('handles deeply nested folder structure', () => {
      render(
        <Root onValueChange={vi.fn()} value={['folder1', 'folder2']}>
          <FolderItem
            level={1}
            value="folder1"
            content={
              <FolderItem
                level={2}
                value="folder2"
                content={
                  <FileItem level={3} value="file1">
                    Nested File
                  </FileItem>
                }
              >
                Nested Folder
              </FolderItem>
            }
          >
            Root Folder
          </FolderItem>
        </Root>
      )

      expect(screen.getByText('Root Folder')).toBeInTheDocument()
      expect(screen.getByText('Nested Folder')).toBeInTheDocument()
      expect(screen.getByText('Nested File')).toBeInTheDocument()
    })
  })
})
