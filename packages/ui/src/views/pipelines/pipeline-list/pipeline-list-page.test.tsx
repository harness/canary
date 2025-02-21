import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PipelineListPage } from './pipeline-list-page'
import { IPipelineListPageProps } from './types'

// Mocking usePipelineListStore
const mockUsePipelineListStore = vi.fn(() => ({
  pipelines: [
    { id: '1', name: 'Pipeline 1' },
    { id: '2', name: 'Pipeline 2' }
  ],
  totalPages: 2,
  page: 1,
  setPage: vi.fn()
}))

// Mocking useTranslationStore
const mockUseTranslationStore = vi.fn(() => ({
  t: (key: string) => key,
  i18n: {
    language: 'en',
    changeLanguage: vi.fn()
  }
}))

const defaultProps: IPipelineListPageProps = {
  usePipelineListStore: mockUsePipelineListStore as unknown as any,
  useTranslationStore: mockUseTranslationStore as unknown as any,
  isLoading: false,
  isError: false,
  errorMessage: '',
  searchQuery: '',
  setSearchQuery: vi.fn(),
  handleCreatePipeline: vi.fn(),
  LinkComponent: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  toPipelineDetails: vi.fn()
}

describe('PipelineListPage', () => {
  it('renders without crashing', () => {
    render(<PipelineListPage {...defaultProps} />)
    expect(screen.getByText('Pipelines')).toBeInTheDocument()
  })

  it('displays error message when isError is true', () => {
    render(<PipelineListPage {...defaultProps} isError={true} errorMessage="Error occurred" />)
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })

  it('calls handleCreatePipeline when Create pipeline button is clicked', () => {
    render(<PipelineListPage {...defaultProps} />)
    const createButton = screen.getByText('Create pipeline')
    fireEvent.click(createButton)
    expect(defaultProps.handleCreatePipeline).toHaveBeenCalled()
  })

  it('calls setSearchQuery when search input changes', () => {
    render(<PipelineListPage {...defaultProps} />)
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    expect(defaultProps.setSearchQuery).toHaveBeenCalledWith('test')
  })

  it('renders Pagination component with correct props', () => {
    render(<PipelineListPage {...defaultProps} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
