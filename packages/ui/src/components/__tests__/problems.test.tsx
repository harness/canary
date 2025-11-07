import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { NoProblemsFound, Problem, Problems, ProblemSeverity } from '../problems'

describe('Problems', () => {
  describe('Rendering', () => {
    test('should render problems list', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Syntax error',
          position: { row: 1, column: 5 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByText('Syntax error')).toBeInTheDocument()
    })

    test('should render with empty problems array', () => {
      const handleClick = vi.fn()
      const { container } = render(<Problems problems={[]} onClick={handleClick} />)

      const root = container.querySelector('.min-h-12')
      expect(root).toBeInTheDocument()
    })

    test('should render multiple problems', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error 1',
          position: { row: 1, column: 1 }
        },
        {
          severity: 'warning',
          message: 'Warning 1',
          position: { row: 2, column: 2 }
        },
        {
          severity: 'info',
          message: 'Info 1',
          position: { row: 3, column: 3 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByText('Error 1')).toBeInTheDocument()
      expect(screen.getByText('Warning 1')).toBeInTheDocument()
      expect(screen.getByText('Info 1')).toBeInTheDocument()
    })
  })

  describe('Problem Severity Icons', () => {
    test('should render error icon for error severity', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error message',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('should render warning icon for warning severity', () => {
      const problems: Problem[] = [
        {
          severity: 'warning',
          message: 'Warning message',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('should render info icon for info severity', () => {
      const problems: Problem[] = [
        {
          severity: 'info',
          message: 'Info message',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('should render all severity types correctly', () => {
      const severities: ProblemSeverity[] = ['error', 'warning', 'info']

      severities.forEach(severity => {
        const problems: Problem[] = [
          {
            severity,
            message: `${severity} message`,
            position: { row: 1, column: 1 }
          }
        ]
        const handleClick = vi.fn()

        const { container } = render(<Problems problems={problems} onClick={handleClick} />)

        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
      })
    })
  })

  describe('Position Display', () => {
    test('should display position in [row, column] format', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 10, column: 25 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByText('[10, 25]')).toBeInTheDocument()
    })

    test('should display different positions correctly', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error 1',
          position: { row: 1, column: 1 }
        },
        {
          severity: 'error',
          message: 'Error 2',
          position: { row: 100, column: 200 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByText('[1, 1]')).toBeInTheDocument()
      expect(screen.getByText('[100, 200]')).toBeInTheDocument()
    })

    test('should display zero position values', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 0, column: 0 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByText('[0, 0]')).toBeInTheDocument()
    })
  })

  describe('onClick Handler', () => {
    test('should call onClick when problem row is clicked', async () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error message',
          position: { row: 1, column: 5 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      const row = screen.getByRole('button')
      await userEvent.click(row)

      expect(handleClick).toHaveBeenCalledTimes(1)
      expect(handleClick).toHaveBeenCalledWith(problems[0])
    })

    test('should call onClick with correct problem data', async () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'First error',
          position: { row: 1, column: 1 }
        },
        {
          severity: 'warning',
          message: 'Second warning',
          position: { row: 2, column: 2 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      const rows = screen.getAllByRole('button')

      await userEvent.click(rows[0])
      expect(handleClick).toHaveBeenCalledWith(problems[0])

      await userEvent.click(rows[1])
      expect(handleClick).toHaveBeenCalledWith(problems[1])

      expect(handleClick).toHaveBeenCalledTimes(2)
    })

    test('should call onClick for each problem independently', async () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error 1',
          position: { row: 1, column: 1 }
        },
        {
          severity: 'error',
          message: 'Error 2',
          position: { row: 2, column: 2 }
        },
        {
          severity: 'error',
          message: 'Error 3',
          position: { row: 3, column: 3 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      const rows = screen.getAllByRole('button')

      await userEvent.click(rows[2])
      expect(handleClick).toHaveBeenCalledWith(problems[2])
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Problem with Data', () => {
    test('should handle problem with custom data property', () => {
      const problems: Problem<{ id: string; type: string }>[] = [
        {
          severity: 'error',
          message: 'Error with data',
          position: { row: 1, column: 1 },
          data: { id: 'err-1', type: 'syntax' }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByText('Error with data')).toBeInTheDocument()
    })

    test('should pass custom data to onClick handler', async () => {
      const customData = { id: 'custom-123', metadata: 'test' }
      const problems: Problem<typeof customData>[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 1 },
          data: customData
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      const row = screen.getByRole('button')
      await userEvent.click(row)

      expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ data: customData }))
    })

    test('should handle problem without data property', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error without data',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByText('Error without data')).toBeInTheDocument()
    })
  })

  describe('Problem with Action', () => {
    test('should render action when provided', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error with action',
          position: { row: 1, column: 1 },
          action: <button data-testid="fix-button">Fix</button>
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByTestId('fix-button')).toBeInTheDocument()
      expect(screen.getByText('Fix')).toBeInTheDocument()
    })

    test('should not render action container when action is not provided', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error without action',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      // Action should not be rendered
      expect(screen.queryByTestId('action-button')).not.toBeInTheDocument()
    })

    test('should render multiple problems with and without actions', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error 1',
          position: { row: 1, column: 1 },
          action: <button data-testid="action-1">Action 1</button>
        },
        {
          severity: 'warning',
          message: 'Warning 1',
          position: { row: 2, column: 2 }
        },
        {
          severity: 'info',
          message: 'Info 1',
          position: { row: 3, column: 3 },
          action: <button data-testid="action-3">Action 3</button>
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByTestId('action-1')).toBeInTheDocument()
      expect(screen.queryByTestId('action-2')).not.toBeInTheDocument()
      expect(screen.getByTestId('action-3')).toBeInTheDocument()
    })

    test('should render complex action components', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 1 },
          action: (
            <div data-testid="complex-action">
              <button>Fix</button>
              <button>Ignore</button>
            </div>
          )
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByTestId('complex-action')).toBeInTheDocument()
    })
  })

  describe('Problem Keys', () => {
    test('should generate unique keys for problems', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 1 }
        },
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 2 }
        }
      ]
      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      const rows = container.querySelectorAll('[role="button"]')
      expect(rows).toHaveLength(2)
    })

    test('should handle duplicate messages with different positions', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Duplicate message',
          position: { row: 5, column: 10 }
        },
        {
          severity: 'error',
          message: 'Duplicate message',
          position: { row: 10, column: 20 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      const messages = screen.getAllByText('Duplicate message')
      expect(messages).toHaveLength(2)
    })
  })

  describe('Accessibility', () => {
    test('should have button role for rows', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      const row = screen.getByRole('button')
      expect(row).toBeInTheDocument()
    })

    test('should have tabIndex for keyboard navigation', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      const row = screen.getByRole('button')
      expect(row).toHaveAttribute('tabIndex', '0')
    })

    test('should be keyboard accessible', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      const row = screen.getByRole('button')
      row.focus()
      expect(row).toHaveFocus()

      // div with role="button" is focusable via tabIndex
      expect(row).toHaveAttribute('tabIndex', '0')
    })

    test('should support multiple keyboard navigable rows', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error 1',
          position: { row: 1, column: 1 }
        },
        {
          severity: 'error',
          message: 'Error 2',
          position: { row: 2, column: 2 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      const rows = screen.getAllByRole('button')
      rows.forEach(row => {
        expect(row).toHaveAttribute('tabIndex', '0')
      })
    })
  })

  describe('Root Container', () => {
    test('should apply default root classes', () => {
      const problems: Problem[] = []
      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      const root = container.querySelector('.min-h-12')
      expect(root).toHaveClass('min-h-12')
      expect(root).toHaveClass('overflow-scroll')
      expect(root).toHaveClass('text-[13px]')
      expect(root).toHaveClass('leading-[15px]')
    })

    test('should render root container with problems', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      const root = container.querySelector('.min-h-12.overflow-scroll')
      expect(root).toBeInTheDocument()
    })
  })

  describe('Row Styling', () => {
    test('should apply row classes', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      const row = screen.getByRole('button')
      expect(row).toHaveClass('width-100')
      expect(row).toHaveClass('text-cn-1')
      expect(row).toHaveClass('flex')
      expect(row).toHaveClass('flex-1')
      expect(row).toHaveClass('cursor-pointer')
      expect(row).toHaveClass('items-center')
      expect(row).toHaveClass('justify-between')
      expect(row).toHaveClass('gap-cn-xs')
      expect(row).toHaveClass('text-nowrap')
      expect(row).toHaveClass('px-cn-md')
      expect(row).toHaveClass('py-cn-4xs')
    })
  })

  describe('Message Rendering', () => {
    test('should render message with truncate class', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Very long error message that should be truncated',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      const message = container.querySelector('.truncate')
      expect(message).toBeInTheDocument()
      expect(message).toHaveTextContent('Very long error message that should be truncated')
    })

    test('should render short messages', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Short',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByText('Short')).toBeInTheDocument()
    })

    test('should handle special characters in message', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error: <tag> & "quotes" \' apostrophe',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByText('Error: <tag> & "quotes" \' apostrophe')).toBeInTheDocument()
    })
  })

  describe('Complex Scenarios', () => {
    test('should render complete problem with all properties', async () => {
      const problems: Problem<{ custom: string }>[] = [
        {
          severity: 'error',
          message: 'Complete problem',
          position: { row: 5, column: 10 },
          data: { custom: 'data' },
          action: <span data-testid="fix-action">Fix</span>
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByText('Complete problem')).toBeInTheDocument()
      expect(screen.getByText('[5, 10]')).toBeInTheDocument()
      expect(screen.getByTestId('fix-action')).toBeInTheDocument()

      const row = screen.getByRole('button')
      await userEvent.click(row)

      expect(handleClick).toHaveBeenCalledWith(problems[0])
    })

    test('should render mixed severity problems', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Critical error',
          position: { row: 1, column: 1 }
        },
        {
          severity: 'warning',
          message: 'Warning message',
          position: { row: 5, column: 10 }
        },
        {
          severity: 'info',
          message: 'Info message',
          position: { row: 10, column: 20 }
        }
      ]
      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      const rows = container.querySelectorAll('[role="button"]')
      expect(rows).toHaveLength(3)

      expect(screen.getByText('Critical error')).toBeInTheDocument()
      expect(screen.getByText('Warning message')).toBeInTheDocument()
      expect(screen.getByText('Info message')).toBeInTheDocument()
    })

    test('should handle large number of problems', () => {
      const problems: Problem[] = Array.from({ length: 50 }, (_, i) => ({
        severity: i % 3 === 0 ? 'error' : i % 3 === 1 ? 'warning' : 'info',
        message: `Problem ${i + 1}`,
        position: { row: i + 1, column: i + 1 }
      })) as Problem[]

      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      const rows = container.querySelectorAll('[role="button"]')
      expect(rows).toHaveLength(50)
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty message', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: '',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      const row = container.querySelector('[role="button"]')
      expect(row).toBeInTheDocument()
    })

    test('should handle very long message', () => {
      const longMessage =
        'This is a very long error message that should be properly truncated when it exceeds the container width'
      const problems: Problem[] = [
        {
          severity: 'error',
          message: longMessage,
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      // Message should be rendered with truncate class
      const messageSpan = container.querySelector('.truncate')
      expect(messageSpan).toHaveTextContent(longMessage)
    })

    test('should handle large position numbers', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 99999, column: 88888 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByText('[99999, 88888]')).toBeInTheDocument()
    })

    test('should handle negative position numbers', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: -1, column: -1 }
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      expect(screen.getByText('[-1, -1]')).toBeInTheDocument()
    })
  })

  describe('NoProblemsFound Component', () => {
    test('should render NoProblemsFound', () => {
      render(<NoProblemsFound />)

      expect(screen.getByText('No problems found')).toBeInTheDocument()
    })

    test('should render check-circle icon', () => {
      const { container } = render(<NoProblemsFound />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('should apply success color to icon', () => {
      const { container } = render(<NoProblemsFound />)

      const icon = container.querySelector('.text-cn-success')
      expect(icon).toBeInTheDocument()
    })

    test('should have flex layout with gap', () => {
      const { container } = render(<NoProblemsFound />)

      const wrapper = container.querySelector('.flex.items-center.gap-cn-xs')
      expect(wrapper).toBeInTheDocument()
    })

    test('should have left padding', () => {
      const { container } = render(<NoProblemsFound />)

      const wrapper = container.querySelector('.pl-cn-md')
      expect(wrapper).toBeInTheDocument()
    })
  })

  describe('Re-rendering', () => {
    test('should update when problems change', () => {
      const handleClick = vi.fn()
      const { rerender } = render(
        <Problems
          problems={[
            {
              severity: 'error',
              message: 'Error 1',
              position: { row: 1, column: 1 }
            }
          ]}
          onClick={handleClick}
        />
      )

      expect(screen.getByText('Error 1')).toBeInTheDocument()

      rerender(
        <Problems
          problems={[
            {
              severity: 'warning',
              message: 'Warning 1',
              position: { row: 2, column: 2 }
            }
          ]}
          onClick={handleClick}
        />
      )

      expect(screen.queryByText('Error 1')).not.toBeInTheDocument()
      expect(screen.getByText('Warning 1')).toBeInTheDocument()
    })

    test('should update when onClick handler changes', async () => {
      const handleClick1 = vi.fn()
      const handleClick2 = vi.fn()

      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 1 }
        }
      ]

      const { rerender } = render(<Problems problems={problems} onClick={handleClick1} />)

      const row = screen.getByRole('button')
      await userEvent.click(row)
      expect(handleClick1).toHaveBeenCalledTimes(1)

      rerender(<Problems problems={problems} onClick={handleClick2} />)

      await userEvent.click(row)
      expect(handleClick2).toHaveBeenCalledTimes(1)
    })
  })

  describe('Generic Type Support', () => {
    test('should support custom generic data type', async () => {
      interface CustomData {
        file: string
        line: number
      }

      const problems: Problem<CustomData>[] = [
        {
          severity: 'error',
          message: 'Type error',
          position: { row: 1, column: 1 },
          data: { file: 'test.ts', line: 10 }
        }
      ]

      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      const row = screen.getByRole('button')
      await userEvent.click(row)

      expect(handleClick).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { file: 'test.ts', line: 10 }
        })
      )
    })
  })

  describe('ProblemSeverity Type', () => {
    test('should accept error severity', () => {
      const severity: ProblemSeverity = 'error'
      expect(severity).toBe('error')
    })

    test('should accept warning severity', () => {
      const severity: ProblemSeverity = 'warning'
      expect(severity).toBe('warning')
    })

    test('should accept info severity', () => {
      const severity: ProblemSeverity = 'info'
      expect(severity).toBe('info')
    })
  })

  describe('Layout and Structure', () => {
    test('should have correct icon and message layout', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      const iconMessageContainer = container.querySelector('.flex.items-center.gap-cn-xs')
      expect(iconMessageContainer).toBeInTheDocument()
    })

    test('should have overflow hidden for message container', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      const messageContainer = container.querySelector('.flex.items-center.overflow-hidden')
      expect(messageContainer).toBeInTheDocument()
    })

    test('should have text-nowrap on position', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 1 }
        }
      ]
      const handleClick = vi.fn()

      const { container } = render(<Problems problems={problems} onClick={handleClick} />)

      const positionContainer = container.querySelector('.text-nowrap.pr-cn-xs')
      expect(positionContainer).toBeInTheDocument()
    })
  })

  describe('Action Container Styling', () => {
    test('should render action container with correct classes', () => {
      const problems: Problem[] = [
        {
          severity: 'error',
          message: 'Error',
          position: { row: 1, column: 1 },
          action: <button>Fix</button>
        }
      ]
      const handleClick = vi.fn()

      render(<Problems problems={problems} onClick={handleClick} />)

      // Action is wrapped in a div with flex items-center
      const button = screen.getByText('Fix')
      expect(button.parentElement).toHaveClass('flex')
      expect(button.parentElement).toHaveClass('items-center')
    })
  })
})
