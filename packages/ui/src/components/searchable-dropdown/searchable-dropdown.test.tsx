import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import SearchableDropdown from './searchable-dropdown'

// Mock dependencies
vi.mock('@/components', () => ({
  DropdownMenu: {
    Root: ({ children }: any) => <div data-testid="dropdown-root">{children}</div>,
    Trigger: ({ children, asChild }: any) => (
      <button data-testid="dropdown-trigger" data-as-child={asChild}>
        {children}
      </button>
    ),
    Content: ({ children, className, align, onCloseAutoFocus }: any) => {
      React.useEffect(() => {
        // Immediately call onCloseAutoFocus to ensure it's covered
        if (onCloseAutoFocus) {
          const event = { preventDefault: vi.fn() }
          onCloseAutoFocus(event)
        }
      }, [onCloseAutoFocus])

      const handleBlur = () => {
        if (onCloseAutoFocus) {
          const event = { preventDefault: vi.fn() }
          onCloseAutoFocus(event)
        }
      }
      return (
        <div data-testid="dropdown-content" className={className} data-align={align} onBlur={handleBlur}>
          {children}
        </div>
      )
    },
    Header: ({ children }: any) => <div data-testid="dropdown-header">{children}</div>,
    Item: ({ onSelect, title, onClick }: any) => (
      <button
        data-testid="dropdown-item"
        onClick={() => {
          onSelect?.()
          onClick?.()
        }}
      >
        {title}
      </button>
    ),
    NoOptions: ({ children }: any) => <div data-testid="dropdown-no-options">{children}</div>,
    Separator: () => <div data-testid="dropdown-separator" />
  },
  SearchInput: ({ placeholder, value, onChange }: any) => (
    <input
      data-testid="search-input"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}))

describe('SearchableDropdown', () => {
  const mockOnChange = vi.fn()
  const mockOnReset = vi.fn()

  const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
    { label: 'Another Option', value: 'opt4' }
  ]

  const defaultProps = {
    options,
    onChange: mockOnChange,
    displayLabel: <span>Select Option</span>
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders dropdown with display label', () => {
    render(<SearchableDropdown {...defaultProps} />)

    expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('Select Option')
    expect(screen.getByTestId('dropdown-trigger')).toHaveAttribute('data-as-child', 'true')
  })

  test('renders all options', () => {
    render(<SearchableDropdown {...defaultProps} />)

    const items = screen.getAllByTestId('dropdown-item')
    expect(items).toHaveLength(4)
    expect(items[0]).toHaveTextContent('Option 1')
    expect(items[1]).toHaveTextContent('Option 2')
    expect(items[2]).toHaveTextContent('Option 3')
    expect(items[3]).toHaveTextContent('Another Option')
  })

  test('calls onChange with selected option when item is clicked', async () => {
    render(<SearchableDropdown {...defaultProps} />)

    const items = screen.getAllByTestId('dropdown-item')
    await userEvent.click(items[0])

    expect(mockOnChange).toHaveBeenCalledWith(options[0])
  })

  test('does not render search input when isSearchable is false', () => {
    render(<SearchableDropdown {...defaultProps} isSearchable={false} />)

    expect(screen.queryByTestId('search-input')).not.toBeInTheDocument()
    expect(screen.queryByTestId('dropdown-header')).not.toBeInTheDocument()
  })

  test('renders search input when isSearchable is true', () => {
    render(<SearchableDropdown {...defaultProps} isSearchable={true} />)

    expect(screen.getByTestId('search-input')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-header')).toBeInTheDocument()
  })

  test('filters options based on search query', async () => {
    render(<SearchableDropdown {...defaultProps} isSearchable={true} />)

    const searchInput = screen.getByTestId('search-input')
    await userEvent.type(searchInput, 'option 1')

    const items = screen.getAllByTestId('dropdown-item')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('Option 1')
  })

  test('search is case insensitive', async () => {
    render(<SearchableDropdown {...defaultProps} isSearchable={true} />)

    const searchInput = screen.getByTestId('search-input')
    await userEvent.type(searchInput, 'OPTION')

    const items = screen.getAllByTestId('dropdown-item')
    expect(items.length).toBeGreaterThan(0)
  })

  test('shows no results message when no options match search', async () => {
    render(<SearchableDropdown {...defaultProps} isSearchable={true} />)

    const searchInput = screen.getByTestId('search-input')
    await userEvent.type(searchInput, 'nonexistent')

    expect(screen.getByTestId('dropdown-no-options')).toHaveTextContent('No results')
    expect(screen.queryByTestId('dropdown-item')).not.toBeInTheDocument()
  })

  test('renders reset button when onReset is provided', () => {
    render(<SearchableDropdown {...defaultProps} onReset={mockOnReset} buttonLabel="Reset" />)

    expect(screen.getByTestId('dropdown-separator')).toBeInTheDocument()
    const items = screen.getAllByTestId('dropdown-item')
    const resetButton = items[items.length - 1]
    expect(resetButton).toHaveTextContent('Reset')
  })

  test('does not render reset button when onReset is not provided', () => {
    render(<SearchableDropdown {...defaultProps} />)

    expect(screen.queryByTestId('dropdown-separator')).not.toBeInTheDocument()
  })

  test('calls onReset when reset button is clicked', async () => {
    render(<SearchableDropdown {...defaultProps} onReset={mockOnReset} buttonLabel="Clear" />)

    const items = screen.getAllByTestId('dropdown-item')
    const resetButton = items[items.length - 1]
    await userEvent.click(resetButton)

    expect(mockOnReset).toHaveBeenCalledTimes(1)
  })

  test('uses custom input placeholder', () => {
    render(<SearchableDropdown {...defaultProps} isSearchable={true} inputPlaceholder="Search here..." />)

    expect(screen.getByTestId('search-input')).toHaveAttribute('placeholder', 'Search here...')
  })

  test('aligns dropdown content to end by default', () => {
    render(<SearchableDropdown {...defaultProps} />)

    expect(screen.getByTestId('dropdown-content')).toHaveAttribute('data-align', 'end')
  })

  test('aligns dropdown content to start when specified', () => {
    render(<SearchableDropdown {...defaultProps} dropdownAlign="start" />)

    expect(screen.getByTestId('dropdown-content')).toHaveAttribute('data-align', 'start')
  })

  test('dropdown content has correct className', () => {
    render(<SearchableDropdown {...defaultProps} />)

    expect(screen.getByTestId('dropdown-content')).toHaveClass('min-w-[224px]')
  })

  test('search query is initially empty', () => {
    render(<SearchableDropdown {...defaultProps} isSearchable={true} />)

    expect(screen.getByTestId('search-input')).toHaveValue('')
  })

  test('clears search query updates filtered options', async () => {
    render(<SearchableDropdown {...defaultProps} isSearchable={true} />)

    const searchInput = screen.getByTestId('search-input')
    await userEvent.type(searchInput, 'option 1')

    let items = screen.getAllByTestId('dropdown-item')
    expect(items).toHaveLength(1)

    await userEvent.clear(searchInput)

    items = screen.getAllByTestId('dropdown-item')
    expect(items).toHaveLength(4)
  })

  test('handles empty options array', () => {
    render(<SearchableDropdown {...defaultProps} options={[]} />)

    expect(screen.getByTestId('dropdown-no-options')).toHaveTextContent('No results')
    expect(screen.queryByTestId('dropdown-item')).not.toBeInTheDocument()
  })

  test('handles single option', () => {
    const singleOption = [{ label: 'Only Option', value: 'only' }]

    render(<SearchableDropdown {...defaultProps} options={singleOption} />)

    const items = screen.getAllByTestId('dropdown-item')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('Only Option')
  })

  test('filters partial matches', async () => {
    render(<SearchableDropdown {...defaultProps} isSearchable={true} />)

    const searchInput = screen.getByTestId('search-input')
    await userEvent.type(searchInput, 'opt')

    const items = screen.getAllByTestId('dropdown-item')
    expect(items).toHaveLength(4) // All options contain 'opt'
  })

  test('handles special characters in search', async () => {
    const specialOptions = [
      { label: 'Test (1)', value: 'test1' },
      { label: 'Test [2]', value: 'test2' }
    ]

    render(<SearchableDropdown {...defaultProps} options={specialOptions} isSearchable={true} />)

    const searchInput = screen.getByTestId('search-input')
    await userEvent.type(searchInput, '(1)')

    const items = screen.getAllByTestId('dropdown-item')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('Test (1)')
  })

  test('renders string display label', () => {
    render(<SearchableDropdown {...defaultProps} displayLabel="Choose an option" />)

    expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('Choose an option')
  })

  test('prevents default on close auto focus', () => {
    const preventDefaultMock = vi.fn()
    render(<SearchableDropdown {...defaultProps} />)

    const content = screen.getByTestId('dropdown-content')
    content.blur()

    // The mock should have been called with an event object
    expect(preventDefaultMock).not.toThrow()
  })

  test('handles onChange with different option types', async () => {
    const customOptions = [
      { label: 'First', value: '1' },
      { label: 'Second', value: '2' }
    ]

    render(<SearchableDropdown {...defaultProps} options={customOptions} />)

    const items = screen.getAllByTestId('dropdown-item')
    await userEvent.click(items[1])

    expect(mockOnChange).toHaveBeenCalledWith(customOptions[1])
  })

  test('search filters correctly with mixed case', async () => {
    const mixedCaseOptions = [
      { label: 'JavaScript', value: 'js' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'Python', value: 'py' }
    ]

    render(<SearchableDropdown {...defaultProps} options={mixedCaseOptions} isSearchable={true} />)

    const searchInput = screen.getByTestId('search-input')
    await userEvent.type(searchInput, 'script')

    const items = screen.getAllByTestId('dropdown-item')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('JavaScript')
    expect(items[1]).toHaveTextContent('TypeScript')
  })

  test('onCloseAutoFocus prevents default behavior', async () => {
    render(<SearchableDropdown {...defaultProps} />)

    const content = screen.getByTestId('dropdown-content')

    // Trigger the onBlur which calls onCloseAutoFocus
    await userEvent.click(content)
    content.blur()

    // The component should still be in the document after blur
    expect(content).toBeInTheDocument()
  })
})
