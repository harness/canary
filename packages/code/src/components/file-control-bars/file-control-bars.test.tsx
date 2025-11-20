import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { FileEditorControlBar } from './file-editor-control-bar'
import { FileViewerControlBar } from './file-viewer-control-bar'

// Mock dependencies
vi.mock('@/components', () => ({
  StackedList: {
    Root: ({ children, rounded }: any) => (
      <div data-testid="stacked-list-root" data-rounded={rounded}>
        {children}
      </div>
    ),
    Header: ({ children, paddingY }: any) => (
      <div data-testid="stacked-list-header" data-padding-y={paddingY}>
        {children}
      </div>
    ),
    Field: ({ title, right }: any) => (
      <div data-testid="stacked-list-field" data-right={right ? 'true' : 'false'}>
        {title}
      </div>
    )
  },
  Tabs: {
    List: ({ children, variant }: any) => (
      <div data-testid="tabs-list" data-variant={variant}>
        {children}
      </div>
    ),
    Trigger: ({ children, value }: any) => (
      <button data-testid={`tab-trigger-${value}`} data-value={value}>
        {children}
      </button>
    )
  },
  DropdownMenu: {
    Item: ({ onSelect, title, children }: any) => (
      <button data-testid="dropdown-item" onClick={onSelect}>
        {children || title}
      </button>
    )
  },
  FileToolbarActions: ({ showEdit, onDownloadClick, onEditClick, additionalButtonsProps }: any) => (
    <div data-testid="file-toolbar-actions" data-show-edit={showEdit ? 'true' : 'false'}>
      <button data-testid="download-button" onClick={onDownloadClick}>
        Download
      </button>
      {showEdit && (
        <button data-testid="edit-button" onClick={onEditClick}>
          Edit
        </button>
      )}
      {additionalButtonsProps?.map((props: any, index: number) => (
        <button key={index} data-testid="additional-button" ref={props.ref} aria-label={props['aria-label']}>
          {props.children}
          {props.dropdownProps?.content}
        </button>
      ))}
    </div>
  ),
  IconV2: ({ name }: any) => <span data-testid="icon" data-name={name} />,
  Layout: {
    Horizontal: ({ children, gap, align }: any) => (
      <div data-testid="layout-horizontal" data-gap={gap} data-align={align}>
        {children}
      </div>
    )
  },
  Separator: ({ orientation, className }: any) => (
    <div data-testid="separator" data-orientation={orientation} className={className} />
  ),
  Tag: ({ value, icon }: any) => (
    <div data-testid="tag" data-icon={icon}>
      {value}
    </div>
  ),
  Text: ({ children, color }: any) => (
    <span data-testid="text" data-color={color}>
      {children}
    </span>
  ),
  ViewTypeValue: {}
}))

vi.mock('@/context', () => ({
  useCustomDialogTrigger: () => ({
    triggerRef: { current: null },
    registerTrigger: vi.fn()
  })
}))

vi.mock('@views/repo/components/branch-selector-v2/types', () => ({
  BranchSelectorTab: {
    BRANCHES: 'branches',
    TAGS: 'tags'
  }
}))

// Define the enum locally for use in tests
enum BranchSelectorTab {
  BRANCHES = 'branches',
  TAGS = 'tags'
}

describe('FileEditorControlBar', () => {
  test('renders with edit and preview tabs by default', () => {
    render(<FileEditorControlBar />)

    expect(screen.getByTestId('stacked-list-root')).toHaveAttribute('data-rounded', 'top')
    expect(screen.getByTestId('stacked-list-header')).toHaveAttribute('data-padding-y', '2xs')
    expect(screen.getByTestId('tab-trigger-edit')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-preview')).toBeInTheDocument()
    expect(screen.getByTestId('tabs-list')).toHaveAttribute('data-variant', 'ghost')
  })

  test('renders only edit tab when showPreview is false', () => {
    render(<FileEditorControlBar showPreview={false} />)

    expect(screen.getByTestId('tab-trigger-edit')).toBeInTheDocument()
    expect(screen.queryByTestId('tab-trigger-preview')).not.toBeInTheDocument()
  })

  test('renders with preview tab when showPreview is explicitly true', () => {
    render(<FileEditorControlBar showPreview={true} />)

    expect(screen.getByTestId('tab-trigger-edit')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-preview')).toBeInTheDocument()
  })
})

describe('FileViewerControlBar', () => {
  const defaultProps = {
    view: 'code' as any,
    isMarkdown: false,
    fileBytesSize: '1.5 KB',
    fileContent: 'line1\nline2\nline3',
    url: 'https://example.com/file.txt',
    handleDownloadFile: vi.fn(),
    handleEditFile: vi.fn(),
    handleOpenDeleteDialog: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'open', {
      writable: true,
      value: vi.fn()
    })
  })

  test('renders with all tabs when not markdown', () => {
    render(<FileViewerControlBar {...defaultProps} />)

    expect(screen.getByTestId('tab-trigger-code')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-blame')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-history')).toBeInTheDocument()
    expect(screen.queryByTestId('tab-trigger-preview')).not.toBeInTheDocument()
  })

  test('renders preview tab when isMarkdown is true', () => {
    render(<FileViewerControlBar {...defaultProps} isMarkdown={true} />)

    expect(screen.getByTestId('tab-trigger-preview')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-code')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-blame')).toBeInTheDocument()
    expect(screen.getByTestId('tab-trigger-history')).toBeInTheDocument()
  })

  test('displays file statistics correctly', () => {
    render(<FileViewerControlBar {...defaultProps} />)

    const textElements = screen.getAllByTestId('text')
    const lineCountText = textElements.find(el => el.textContent === '3 lines')
    const fileSizeText = textElements.find(el => el.textContent === '1.5 KB')

    expect(lineCountText).toBeInTheDocument()
    expect(fileSizeText).toBeInTheDocument()
  })

  test('displays Git LFS tag when isGitLfsObject is true', () => {
    render(<FileViewerControlBar {...defaultProps} isGitLfsObject={true} />)

    const tag = screen.getByTestId('tag')
    expect(tag).toHaveTextContent('Stored with Git LFS')
    expect(tag).toHaveAttribute('data-icon', 'info-circle')
  })

  test('does not display Git LFS tag when isGitLfsObject is false', () => {
    render(<FileViewerControlBar {...defaultProps} isGitLfsObject={false} />)

    expect(screen.queryByTestId('tag')).not.toBeInTheDocument()
  })

  test('shows edit button when refType is BRANCHES', () => {
    render(<FileViewerControlBar {...defaultProps} refType={BranchSelectorTab.BRANCHES} />)

    const toolbar = screen.getByTestId('file-toolbar-actions')
    expect(toolbar).toHaveAttribute('data-show-edit', 'true')
    expect(screen.getByTestId('edit-button')).toBeInTheDocument()
  })

  test('hides edit button when refType is TAGS', () => {
    render(<FileViewerControlBar {...defaultProps} refType={BranchSelectorTab.TAGS} />)

    const toolbar = screen.getByTestId('file-toolbar-actions')
    expect(toolbar).toHaveAttribute('data-show-edit', 'false')
    expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument()
  })

  test('calls handleDownloadFile when download button is clicked', async () => {
    render(<FileViewerControlBar {...defaultProps} />)

    const downloadButton = screen.getByTestId('download-button')
    await userEvent.click(downloadButton)

    expect(defaultProps.handleDownloadFile).toHaveBeenCalledTimes(1)
  })

  test('calls handleEditFile when edit button is clicked', async () => {
    render(<FileViewerControlBar {...defaultProps} refType={BranchSelectorTab.BRANCHES} />)

    const editButton = screen.getByTestId('edit-button')
    await userEvent.click(editButton)

    expect(defaultProps.handleEditFile).toHaveBeenCalledTimes(1)
  })

  test('opens raw file in new tab when View Raw is clicked', async () => {
    render(<FileViewerControlBar {...defaultProps} />)

    const dropdownItems = screen.getAllByTestId('dropdown-item')
    const viewRawButton = dropdownItems.find(item => item.textContent === 'View Raw')

    await userEvent.click(viewRawButton!)

    expect(window.open).toHaveBeenCalledWith('https://example.com/file.txt', '_blank')
  })

  test('calls handleOpenDeleteDialog when Delete is clicked', async () => {
    render(<FileViewerControlBar {...defaultProps} />)

    const dropdownItems = screen.getAllByTestId('dropdown-item')
    const deleteButton = dropdownItems.find(item => item.textContent?.includes('Delete'))

    await userEvent.click(deleteButton!)

    expect(defaultProps.handleOpenDeleteDialog).toHaveBeenCalledTimes(1)
  })

  test('renders without rounded top when view is history', () => {
    render(<FileViewerControlBar {...defaultProps} view="history" />)

    const root = screen.getByTestId('stacked-list-root')
    expect(root).not.toHaveAttribute('data-rounded')
  })

  test('renders with rounded top when view is not history', () => {
    render(<FileViewerControlBar {...defaultProps} view="code" />)

    const root = screen.getByTestId('stacked-list-root')
    expect(root).toHaveAttribute('data-rounded', 'top')
  })

  test('handles empty file content correctly', () => {
    render(<FileViewerControlBar {...defaultProps} fileContent="" />)

    const textElements = screen.getAllByTestId('text')
    // Empty string splits to array with one empty element, so it shows "1 lines"
    const lineCountText = textElements.find(el => el.textContent?.includes('lines'))

    expect(lineCountText).toBeDefined()
    expect(lineCountText?.textContent).toMatch(/\d+ lines/)
  })

  test('uses default refType when not provided', () => {
    const propsWithoutRefType = { ...defaultProps }
    delete (propsWithoutRefType as any).refType

    render(<FileViewerControlBar {...propsWithoutRefType} />)

    const toolbar = screen.getByTestId('file-toolbar-actions')
    expect(toolbar).toHaveAttribute('data-show-edit', 'true')
  })

  test('renders additional button with correct aria-label', () => {
    render(<FileViewerControlBar {...defaultProps} />)

    const additionalButton = screen.getByTestId('additional-button')
    expect(additionalButton).toHaveAttribute('aria-label', 'More actions')
  })

  test('renders more-horizontal icon in additional button', () => {
    render(<FileViewerControlBar {...defaultProps} />)

    const icon = screen.getByTestId('icon')
    expect(icon).toHaveAttribute('data-name', 'more-horizontal')
  })

  test('handles null fileContent correctly', () => {
    render(<FileViewerControlBar {...defaultProps} fileContent={null as any} />)

    const textElements = screen.getAllByTestId('text')
    const lineCountText = textElements.find(el => el.textContent === '0 lines')

    expect(lineCountText).toBeDefined()
    expect(lineCountText?.textContent).toBe('0 lines')
  })

  test('handles undefined fileContent correctly', () => {
    render(<FileViewerControlBar {...defaultProps} fileContent={undefined as any} />)

    const textElements = screen.getAllByTestId('text')
    const lineCountText = textElements.find(el => el.textContent === '0 lines')

    expect(lineCountText).toBeDefined()
    expect(lineCountText?.textContent).toBe('0 lines')
  })
})
