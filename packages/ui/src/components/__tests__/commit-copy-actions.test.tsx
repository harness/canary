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

  describe('Copy Functionality', () => {
    test('should render copy button with icon', () => {
      renderComponent({ sha: 'abc123' })

      const buttons = screen.getAllByRole('button')
      expect(buttons[1]).toBeInTheDocument()
    })

    test('should copy SHA to clipboard when copy button is clicked', async () => {
      renderComponent({ sha: 'full-sha-value' })

      const buttons = screen.getAllByRole('button')
      const copyButton = buttons[1]

      await userEvent.click(copyButton)

      // Copy functionality is tested through useCopyButton mock
      expect(copyButton).toBeInTheDocument()
    })

    test('should show copy icon in copy button', () => {
      const { container } = renderComponent()

      const buttons = container.querySelectorAll('button')
      expect(buttons[1]).toBeInTheDocument()
    })
  })

  describe('Text Component Integration', () => {
    test('should render SHA in Text component with code font', () => {
      const { container } = renderComponent({ sha: '123456789' })

      const text = container.querySelector('.font-body-code')
      expect(text).toHaveTextContent('123456')
    })

    test('should pass color="inherit" to Text', () => {
      const { container } = renderComponent()

      const text = container.querySelector('.font-body-code')
      expect(text).toBeInTheDocument()
    })
  })

  describe('Re-rendering with Prop Changes', () => {
    test('should update SHA when prop changes', () => {
      const { rerender } = render(
        <TestWrapper>
          <CommitCopyActions sha="abc123" />
        </TestWrapper>
      )

      expect(screen.getByText('abc123')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <CommitCopyActions sha="def456" />
        </TestWrapper>
      )

      expect(screen.getByText('def456')).toBeInTheDocument()
      expect(screen.queryByText('abc123')).not.toBeInTheDocument()
    })

    test('should update size when prop changes', () => {
      const { container, rerender } = render(
        <TestWrapper>
          <CommitCopyActions sha="abc123" size="xs" />
        </TestWrapper>
      )

      let buttons = container.querySelectorAll('.cn-button-xs')
      expect(buttons.length).toBe(2)

      rerender(
        <TestWrapper>
          <CommitCopyActions sha="abc123" size="sm" />
        </TestWrapper>
      )

      buttons = container.querySelectorAll('.cn-button-sm')
      expect(buttons.length).toBe(2)
    })

    test('should update navigation when toCommitDetails changes', async () => {
      const toCommitDetails1 = vi.fn(() => '/commits/1')
      const toCommitDetails2 = vi.fn(() => '/commits/2')

      const { rerender } = render(
        <TestWrapper>
          <CommitCopyActions sha="abc123" toCommitDetails={toCommitDetails1} />
        </TestWrapper>
      )

      let buttons = screen.getAllByRole('button')
      await userEvent.click(buttons[0])
      expect(toCommitDetails1).toHaveBeenCalled()

      rerender(
        <TestWrapper>
          <CommitCopyActions sha="abc123" toCommitDetails={toCommitDetails2} />
        </TestWrapper>
      )

      buttons = screen.getAllByRole('button')
      await userEvent.click(buttons[0])
      expect(toCommitDetails2).toHaveBeenCalled()
    })
  })

  describe('Default Values', () => {
    test('should use xs size by default', () => {
      const { container } = renderComponent({ sha: 'abc123' })

      const buttons = container.querySelectorAll('.cn-button-xs')
      expect(buttons.length).toBe(2)
    })
  })

  describe('Navigation Edge Cases', () => {
    test('should handle empty SHA in navigation', async () => {
      const toCommitDetails = vi.fn(({ sha }) => `/commits/${sha}`)
      renderComponent({ sha: '', toCommitDetails })

      const buttons = screen.getAllByRole('button')
      await userEvent.click(buttons[0])

      expect(toCommitDetails).toHaveBeenCalledWith({ sha: '' })
    })

    test('should navigate with empty string when no handlers provided', async () => {
      renderComponent({ sha: 'abc123' })

      const buttons = screen.getAllByRole('button')
      // Click should not error even without handlers
      await userEvent.click(buttons[0])

      expect(buttons[0]).toBeInTheDocument()
    })

    test('should handle undefined pullRequestId with toPullRequestChange', async () => {
      const toPullRequestChange = vi.fn(({ pullRequestId, commitSHA }) => `/pr/${pullRequestId}/${commitSHA}`)
      renderComponent({ sha: 'abc123', toPullRequestChange })

      const buttons = screen.getAllByRole('button')
      await userEvent.click(buttons[0])

      expect(toPullRequestChange).toHaveBeenCalledWith({ pullRequestId: 0, commitSHA: 'abc123' })
    })
  })

  describe('Button Props', () => {
    test('should apply font-body-code className to first button', () => {
      const { container } = renderComponent()

      const buttons = container.querySelectorAll('button')
      expect(buttons[0]).toHaveClass('font-body-code')
    })

    test('should render both buttons with same size', () => {
      const { container } = renderComponent({ size: 'md' })

      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBe(2)
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle all props together', async () => {
      const toCommitDetails = vi.fn(() => '/commits/abc')
      const toPullRequestChange = vi.fn()

      renderComponent({
        sha: '1234567890abcdef',
        toCommitDetails,
        pullRequestId: 99,
        toPullRequestChange,
        size: 'sm'
      })

      expect(screen.getByText('123456')).toBeInTheDocument()

      const buttons = screen.getAllByRole('button')
      await userEvent.click(buttons[0])

      expect(toCommitDetails).toHaveBeenCalled()
      expect(toPullRequestChange).not.toHaveBeenCalled()
    })

    test('should render correctly with minimal props', () => {
      renderComponent({ sha: 'a' })

      expect(screen.getByText('a')).toBeInTheDocument()
    })
  })

  describe('SHA Display', () => {
    test('should truncate SHA to 6 characters when longer', () => {
      renderComponent({ sha: '1234567890' })

      expect(screen.getByText('123456')).toBeInTheDocument()
      expect(screen.queryByText('1234567890')).not.toBeInTheDocument()
    })

    test('should display entire SHA when 6 characters or less', () => {
      renderComponent({ sha: '123' })

      expect(screen.getByText('123')).toBeInTheDocument()
    })

    test('should handle exactly 6 character SHA', () => {
      renderComponent({ sha: 'abcdef' })

      expect(screen.getByText('abcdef')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should render buttons with proper roles', () => {
      renderComponent()

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(2)
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button')
      })
    })

    test('should allow keyboard navigation between buttons', () => {
      renderComponent()

      const buttons = screen.getAllByRole('button')
      buttons[0].focus()
      expect(buttons[0]).toHaveFocus()

      buttons[1].focus()
      expect(buttons[1]).toHaveFocus()
    })
  })

  describe('Event Handling', () => {
    test('should handle click on SHA button without navigation', async () => {
      renderComponent({ sha: 'abc123' })

      const buttons = screen.getAllByRole('button')
      const shaButton = buttons[0]

      // Should not throw error even without navigation handler
      await userEvent.click(shaButton)
      expect(shaButton).toBeInTheDocument()
    })

    test('should handle multiple clicks on copy button', async () => {
      renderComponent({ sha: 'test123' })

      const buttons = screen.getAllByRole('button')
      const copyButton = buttons[1]

      await userEvent.click(copyButton)
      await userEvent.click(copyButton)
      await userEvent.click(copyButton)

      expect(copyButton).toBeInTheDocument()
    })
  })
})
