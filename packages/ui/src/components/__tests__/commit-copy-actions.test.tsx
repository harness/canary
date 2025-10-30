import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { CommitCopyActions } from '../commit-copy-actions'

vi.mock('clipboard-copy', () => ({
  default: vi.fn(() => Promise.resolve())
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const renderComponent = (props: Partial<React.ComponentProps<typeof CommitCopyActions>> = {}): RenderResult => {
  return render(
    <TestWrapper>
      <CommitCopyActions sha="abc123def456" {...props} />
    </TestWrapper>
  )
}

describe('CommitCopyActions', () => {
  describe('Basic Rendering', () => {
    test('should render commit SHA', () => {
      renderComponent({ sha: 'abc123def456' })

      expect(screen.getByText('abc123')).toBeInTheDocument()
    })

    test('should display first 6 characters of SHA', () => {
      renderComponent({ sha: '1234567890abcdef' })

      expect(screen.getByText('123456')).toBeInTheDocument()
    })

    test('should render two buttons (SHA and copy)', () => {
      const { container } = renderComponent()

      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBe(2)
    })

    test('should render SHA button with code font', () => {
      const { container } = renderComponent()

      const codeText = container.querySelector('.font-body-code')
      expect(codeText).toBeInTheDocument()
    })

    test('should render copy button', () => {
      renderComponent()

      // Copy button is present (second button)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(2)
    })
  })

  describe('Navigation Functionality', () => {
    test('should navigate to commit details when clicked', async () => {
      const toCommitDetails = vi.fn(({ sha }) => `/commits/${sha}`)
      renderComponent({ sha: 'abc123', toCommitDetails })

      const buttons = screen.getAllByRole('button')
      const shaButton = buttons[0]

      await userEvent.click(shaButton)

      // Navigation is triggered (mocked navigate in vitest-setup.ts)
      expect(toCommitDetails).toHaveBeenCalledWith({ sha: 'abc123' })
    })

    test('should navigate to pull request change when clicked', async () => {
      const toPullRequestChange = vi.fn(({ pullRequestId, commitSHA }) => `/pr/${pullRequestId}/commits/${commitSHA}`)
      renderComponent({
        sha: 'abc123',
        pullRequestId: 42,
        toPullRequestChange
      })

      const buttons = screen.getAllByRole('button')
      const shaButton = buttons[0]

      await userEvent.click(shaButton)

      expect(toPullRequestChange).toHaveBeenCalledWith({ pullRequestId: 42, commitSHA: 'abc123' })
    })

    test('should prioritize toCommitDetails over toPullRequestChange', async () => {
      const toCommitDetails = vi.fn(({ sha }) => `/commits/${sha}`)
      const toPullRequestChange = vi.fn()

      renderComponent({
        sha: 'abc123',
        toCommitDetails,
        pullRequestId: 42,
        toPullRequestChange
      })

      const buttons = screen.getAllByRole('button')
      const shaButton = buttons[0]

      await userEvent.click(shaButton)

      expect(toCommitDetails).toHaveBeenCalled()
      expect(toPullRequestChange).not.toHaveBeenCalled()
    })

    test('should stop event propagation when SHA button is clicked', async () => {
      const handleParentClick = vi.fn()
      const toCommitDetails = vi.fn(() => '/commits/abc123')

      render(
        <TestWrapper>
          <div onClick={handleParentClick} role="presentation">
            <CommitCopyActions sha="abc123" toCommitDetails={toCommitDetails} />
          </div>
        </TestWrapper>
      )

      const buttons = screen.getAllByRole('button')
      const shaButton = buttons[0]

      await userEvent.click(shaButton)

      expect(toCommitDetails).toHaveBeenCalled()
      expect(handleParentClick).not.toHaveBeenCalled()
    })
  })

  describe('Size Variants', () => {
    test('should apply xs size by default', () => {
      const { container } = renderComponent()

      const buttons = container.querySelectorAll('.cn-button-xs')
      expect(buttons.length).toBe(2)
    })

    test('should apply custom size', () => {
      const { container } = renderComponent({ size: 'sm' })

      const buttons = container.querySelectorAll('.cn-button-sm')
      expect(buttons.length).toBe(2)
    })

    test('should apply medium size', () => {
      const { container } = renderComponent({ size: 'md' })

      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBe(2)
    })
  })

  describe('Edge Cases', () => {
    test('should handle short SHA', () => {
      renderComponent({ sha: 'abc' })

      expect(screen.getByText('abc')).toBeInTheDocument()
    })

    test('should handle empty SHA', () => {
      renderComponent({ sha: '' })

      // Empty SHA renders as empty text
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(2)
    })

    test('should handle long SHA', () => {
      const longSHA = 'a'.repeat(40)
      renderComponent({ sha: longSHA })

      expect(screen.getByText('aaaaaa')).toBeInTheDocument()
    })

    test('should handle special characters in SHA', () => {
      renderComponent({ sha: '123-abc-def' })

      expect(screen.getByText('123-ab')).toBeInTheDocument()
    })

    test('should work without navigation props', () => {
      renderComponent({ sha: 'abc123' })

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(2)
    })

    test('should handle navigation with pullRequestId but no toPullRequestChange', () => {
      renderComponent({ sha: 'abc123', pullRequestId: 42 })

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(2)
    })
  })

  describe('ButtonGroup Integration', () => {
    test('should render as ButtonGroup', () => {
      const { container } = renderComponent()

      const buttonGroup = container.querySelector('.cn-button-group')
      expect(buttonGroup).toBeInTheDocument()
    })

    test('should render buttons in horizontal orientation', () => {
      const { container } = renderComponent()

      const group = container.querySelector('.cn-button-group-horizontal')
      expect(group).toBeInTheDocument()
    })

    test('should apply button group styles', () => {
      const { container } = renderComponent()

      const firstButton = container.querySelector('.cn-button-group-first')
      const lastButton = container.querySelector('.cn-button-group-last')

      expect(firstButton).toBeInTheDocument()
      expect(lastButton).toBeInTheDocument()
    })
  })
})
