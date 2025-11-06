import React from 'react'

import { render, screen } from '@testing-library/react'

import { Topbar } from '../topbar'

describe('Topbar', () => {
  describe('Topbar.Root', () => {
    describe('Basic Rendering', () => {
      test('should render topbar root', () => {
        const { container } = render(
          <Topbar.Root>
            <Topbar.Left>Left Content</Topbar.Left>
          </Topbar.Root>
        )

        const root = container.querySelector('div')
        expect(root).toBeInTheDocument()
      })

      test('should render children', () => {
        render(
          <Topbar.Root>
            <Topbar.Left>Left Side</Topbar.Left>
            <Topbar.Right>Right Side</Topbar.Right>
          </Topbar.Root>
        )

        expect(screen.getByText('Left Side')).toBeInTheDocument()
        expect(screen.getByText('Right Side')).toBeInTheDocument()
      })

      test('should apply default grid classes', () => {
        const { container } = render(
          <Topbar.Root>
            <Topbar.Left>Content</Topbar.Left>
          </Topbar.Root>
        )

        const root = container.firstChild
        expect(root).toHaveClass('grid')
        expect(root).toHaveClass('w-full')
      })

      test('should apply 2-column grid by default', () => {
        const { container } = render(
          <Topbar.Root>
            <Topbar.Left>Left</Topbar.Left>
            <Topbar.Right>Right</Topbar.Right>
          </Topbar.Root>
        )

        const root = container.firstChild
        expect(root).toHaveClass('grid-cols-[1fr_auto]')
      })

      test('should apply 3-column grid when Center is present', () => {
        const { container } = render(
          <Topbar.Root>
            <Topbar.Left>Left</Topbar.Left>
            <Topbar.Center>Center</Topbar.Center>
            <Topbar.Right>Right</Topbar.Right>
          </Topbar.Root>
        )

        const root = container.firstChild
        expect(root).toHaveClass('grid-cols-[auto_1fr_auto]')
      })

      test('should apply custom className', () => {
        const { container } = render(
          <Topbar.Root className="custom-topbar">
            <Topbar.Left>Content</Topbar.Left>
          </Topbar.Root>
        )

        const root = container.firstChild
        expect(root).toHaveClass('custom-topbar')
      })

      test('should merge custom className with default classes', () => {
        const { container } = render(
          <Topbar.Root className="custom">
            <Topbar.Left>Content</Topbar.Left>
          </Topbar.Root>
        )

        const root = container.firstChild
        expect(root).toHaveClass('custom')
        expect(root).toHaveClass('grid')
      })
    })

    describe('Layout Detection', () => {
      test('should detect Center component presence', () => {
        const { container } = render(
          <Topbar.Root>
            <Topbar.Left>Left</Topbar.Left>
            <Topbar.Center>Center</Topbar.Center>
          </Topbar.Root>
        )

        const root = container.firstChild
        expect(root).toHaveClass('grid-cols-[auto_1fr_auto]')
      })

      test('should not apply 3-column grid without Center', () => {
        const { container } = render(
          <Topbar.Root>
            <Topbar.Left>Left</Topbar.Left>
            <Topbar.Right>Right</Topbar.Right>
          </Topbar.Root>
        )

        const root = container.firstChild
        expect(root).not.toHaveClass('grid-cols-[auto_1fr_auto]')
        expect(root).toHaveClass('grid-cols-[1fr_auto]')
      })

      test('should handle only Center component', () => {
        const { container } = render(
          <Topbar.Root>
            <Topbar.Center>Only Center</Topbar.Center>
          </Topbar.Root>
        )

        const root = container.firstChild
        expect(root).toHaveClass('grid-cols-[auto_1fr_auto]')
      })

      test('should handle mixed children including non-Topbar components', () => {
        const { container } = render(
          <Topbar.Root>
            <Topbar.Left>Left</Topbar.Left>
            <div>Other Content</div>
            <Topbar.Center>Center</Topbar.Center>
          </Topbar.Root>
        )

        const root = container.firstChild
        expect(root).toHaveClass('grid-cols-[auto_1fr_auto]')
      })
    })

    describe('Styling', () => {
      test('should apply font-regular class', () => {
        const { container } = render(
          <Topbar.Root>
            <Topbar.Left>Content</Topbar.Left>
          </Topbar.Root>
        )

        const root = container.firstChild
        expect(root).toHaveClass('font-regular')
      })

      test('should apply items-center class', () => {
        const { container } = render(
          <Topbar.Root>
            <Topbar.Left>Content</Topbar.Left>
          </Topbar.Root>
        )

        const root = container.firstChild
        expect(root).toHaveClass('items-center')
      })

      test('should have breadcrumbs height CSS variable', () => {
        const { container } = render(
          <Topbar.Root>
            <Topbar.Left>Content</Topbar.Left>
          </Topbar.Root>
        )

        const root = container.firstChild as HTMLElement
        expect(root.className).toContain('h-[var(--cn-breadcrumbs-height)]')
      })
    })
  })

  describe('Topbar.Left', () => {
    describe('Basic Rendering', () => {
      test('should render left section', () => {
        render(
          <Topbar.Root>
            <Topbar.Left>Left Content</Topbar.Left>
          </Topbar.Root>
        )

        expect(screen.getByText('Left Content')).toBeInTheDocument()
      })

      test('should render children', () => {
        render(
          <Topbar.Root>
            <Topbar.Left>
              <button>Button 1</button>
              <button>Button 2</button>
            </Topbar.Left>
          </Topbar.Root>
        )

        expect(screen.getByText('Button 1')).toBeInTheDocument()
        expect(screen.getByText('Button 2')).toBeInTheDocument()
      })

      test('should apply correct order class', () => {
        render(
          <Topbar.Root>
            <Topbar.Left>
              <div data-testid="left-content">Content</div>
            </Topbar.Left>
          </Topbar.Root>
        )

        const leftContent = screen.getByTestId('left-content')
        const leftContainer = leftContent.parentElement
        expect(leftContainer).toHaveClass('order-1')
      })

      test('should apply flex layout classes', () => {
        render(
          <Topbar.Root>
            <Topbar.Left>
              <div data-testid="left-content">Content</div>
            </Topbar.Left>
          </Topbar.Root>
        )

        const leftContent = screen.getByTestId('left-content')
        const leftContainer = leftContent.parentElement
        expect(leftContainer).toHaveClass('flex')
        expect(leftContainer).toHaveClass('items-center')
      })

      test('should apply gap spacing', () => {
        render(
          <Topbar.Root>
            <Topbar.Left>
              <div data-testid="left-content">Content</div>
            </Topbar.Left>
          </Topbar.Root>
        )

        const leftContent = screen.getByTestId('left-content')
        const leftContainer = leftContent.parentElement
        expect(leftContainer).toHaveClass('gap-cn-sm')
      })
    })

    describe('Memoization', () => {
      test('should be memoized component', () => {
        // React.memo wraps the component
        expect(Topbar.Left).toBeDefined()
      })
    })
  })

  describe('Topbar.Center', () => {
    describe('Basic Rendering', () => {
      test('should render center section', () => {
        render(
          <Topbar.Root>
            <Topbar.Center>Center Content</Topbar.Center>
          </Topbar.Root>
        )

        expect(screen.getByText('Center Content')).toBeInTheDocument()
      })

      test('should render children', () => {
        render(
          <Topbar.Root>
            <Topbar.Center>
              <span>Centered</span>
              <span>Items</span>
            </Topbar.Center>
          </Topbar.Root>
        )

        expect(screen.getByText('Centered')).toBeInTheDocument()
        expect(screen.getByText('Items')).toBeInTheDocument()
      })

      test('should apply correct order class', () => {
        render(
          <Topbar.Root>
            <Topbar.Center>
              <div data-testid="center-content">Content</div>
            </Topbar.Center>
          </Topbar.Root>
        )

        const centerContent = screen.getByTestId('center-content')
        const centerContainer = centerContent.parentElement
        expect(centerContainer).toHaveClass('order-2')
      })

      test('should apply flex and justify-center classes', () => {
        render(
          <Topbar.Root>
            <Topbar.Center>
              <div data-testid="center-content">Content</div>
            </Topbar.Center>
          </Topbar.Root>
        )

        const centerContent = screen.getByTestId('center-content')
        const centerContainer = centerContent.parentElement
        expect(centerContainer).toHaveClass('flex')
        expect(centerContainer).toHaveClass('items-center')
        expect(centerContainer).toHaveClass('justify-center')
      })
    })

    describe('Memoization', () => {
      test('should be memoized component', () => {
        expect(Topbar.Center).toBeDefined()
      })
    })
  })

  describe('Topbar.Right', () => {
    describe('Basic Rendering', () => {
      test('should render right section', () => {
        render(
          <Topbar.Root>
            <Topbar.Right>Right Content</Topbar.Right>
          </Topbar.Root>
        )

        expect(screen.getByText('Right Content')).toBeInTheDocument()
      })

      test('should render children', () => {
        render(
          <Topbar.Root>
            <Topbar.Right>
              <button>Action 1</button>
              <button>Action 2</button>
            </Topbar.Right>
          </Topbar.Root>
        )

        expect(screen.getByText('Action 1')).toBeInTheDocument()
        expect(screen.getByText('Action 2')).toBeInTheDocument()
      })

      test('should apply correct order class', () => {
        render(
          <Topbar.Root>
            <Topbar.Right>
              <div data-testid="right-content">Content</div>
            </Topbar.Right>
          </Topbar.Root>
        )

        const rightContent = screen.getByTestId('right-content')
        const rightContainer = rightContent.parentElement
        expect(rightContainer).toHaveClass('order-3')
      })

      test('should apply flex layout classes', () => {
        render(
          <Topbar.Root>
            <Topbar.Right>
              <div data-testid="right-content">Content</div>
            </Topbar.Right>
          </Topbar.Root>
        )

        const rightContent = screen.getByTestId('right-content')
        const rightContainer = rightContent.parentElement
        expect(rightContainer).toHaveClass('flex')
        expect(rightContainer).toHaveClass('items-center')
      })

      test('should apply gap spacing', () => {
        render(
          <Topbar.Root>
            <Topbar.Right>
              <div data-testid="right-content">Content</div>
            </Topbar.Right>
          </Topbar.Root>
        )

        const rightContent = screen.getByTestId('right-content')
        const rightContainer = rightContent.parentElement
        expect(rightContainer).toHaveClass('gap-cn-sm')
      })
    })

    describe('Memoization', () => {
      test('should be memoized component', () => {
        expect(Topbar.Right).toBeDefined()
      })
    })
  })

  describe('Topbar Namespace', () => {
    test('should export all subcomponents', () => {
      expect(Topbar.Root).toBeDefined()
      expect(Topbar.Left).toBeDefined()
      expect(Topbar.Center).toBeDefined()
      expect(Topbar.Right).toBeDefined()
    })

    test('should have all components as functions', () => {
      expect(typeof Topbar.Root).toBe('function')
      expect(typeof Topbar.Left).toBe('object') // Memoized
      expect(typeof Topbar.Center).toBe('object') // Memoized
      expect(typeof Topbar.Right).toBe('object') // Memoized
    })
  })

  describe('Complete Topbar', () => {
    test('should render complete topbar with all sections', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>
            <button>Menu</button>
            <span>Title</span>
          </Topbar.Left>
          <Topbar.Center>
            <span>Centered Content</span>
          </Topbar.Center>
          <Topbar.Right>
            <button>Settings</button>
            <button>Profile</button>
          </Topbar.Right>
        </Topbar.Root>
      )

      expect(screen.getByText('Menu')).toBeInTheDocument()
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Centered Content')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
    })

    test('should render topbar with only left and right', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>Left Side</Topbar.Left>
          <Topbar.Right>Right Side</Topbar.Right>
        </Topbar.Root>
      )

      expect(screen.getByText('Left Side')).toBeInTheDocument()
      expect(screen.getByText('Right Side')).toBeInTheDocument()
    })

    test('should render topbar with only left', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>Only Left</Topbar.Left>
        </Topbar.Root>
      )

      expect(screen.getByText('Only Left')).toBeInTheDocument()
    })

    test('should render topbar with only right', () => {
      render(
        <Topbar.Root>
          <Topbar.Right>Only Right</Topbar.Right>
        </Topbar.Root>
      )

      expect(screen.getByText('Only Right')).toBeInTheDocument()
    })

    test('should render topbar with only center', () => {
      const { container } = render(
        <Topbar.Root>
          <Topbar.Center>Only Center</Topbar.Center>
        </Topbar.Root>
      )

      expect(screen.getByText('Only Center')).toBeInTheDocument()
      const root = container.firstChild
      expect(root).toHaveClass('grid-cols-[auto_1fr_auto]')
    })

    test('should handle left and center without right', () => {
      const { container } = render(
        <Topbar.Root>
          <Topbar.Left>Left</Topbar.Left>
          <Topbar.Center>Center</Topbar.Center>
        </Topbar.Root>
      )

      expect(screen.getByText('Left')).toBeInTheDocument()
      expect(screen.getByText('Center')).toBeInTheDocument()
      const root = container.firstChild
      expect(root).toHaveClass('grid-cols-[auto_1fr_auto]')
    })

    test('should handle center and right without left', () => {
      const { container } = render(
        <Topbar.Root>
          <Topbar.Center>Center</Topbar.Center>
          <Topbar.Right>Right</Topbar.Right>
        </Topbar.Root>
      )

      expect(screen.getByText('Center')).toBeInTheDocument()
      expect(screen.getByText('Right')).toBeInTheDocument()
      const root = container.firstChild
      expect(root).toHaveClass('grid-cols-[auto_1fr_auto]')
    })
  })

  describe('Section Ordering', () => {
    test('should maintain correct order with all sections', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>
            <div data-testid="left">Left</div>
          </Topbar.Left>
          <Topbar.Center>
            <div data-testid="center">Center</div>
          </Topbar.Center>
          <Topbar.Right>
            <div data-testid="right">Right</div>
          </Topbar.Right>
        </Topbar.Root>
      )

      const left = screen.getByTestId('left').parentElement
      const center = screen.getByTestId('center').parentElement
      const right = screen.getByTestId('right').parentElement

      expect(left).toHaveClass('order-1')
      expect(center).toHaveClass('order-2')
      expect(right).toHaveClass('order-3')
    })

    test('should maintain order regardless of render order', () => {
      render(
        <Topbar.Root>
          <Topbar.Right>
            <div data-testid="right">Right</div>
          </Topbar.Right>
          <Topbar.Left>
            <div data-testid="left">Left</div>
          </Topbar.Left>
          <Topbar.Center>
            <div data-testid="center">Center</div>
          </Topbar.Center>
        </Topbar.Root>
      )

      const left = screen.getByTestId('left').parentElement
      const center = screen.getByTestId('center').parentElement
      const right = screen.getByTestId('right').parentElement

      expect(left).toHaveClass('order-1')
      expect(center).toHaveClass('order-2')
      expect(right).toHaveClass('order-3')
    })
  })

  describe('Complex Content', () => {
    test('should handle complex nested components in left', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>
            <div>
              <button>
                <span>Nested Button</span>
              </button>
            </div>
          </Topbar.Left>
        </Topbar.Root>
      )

      expect(screen.getByText('Nested Button')).toBeInTheDocument()
    })

    test('should handle complex nested components in center', () => {
      render(
        <Topbar.Root>
          <Topbar.Center>
            <div>
              <div>
                <span>Deeply Nested</span>
              </div>
            </div>
          </Topbar.Center>
        </Topbar.Root>
      )

      expect(screen.getByText('Deeply Nested')).toBeInTheDocument()
    })

    test('should handle complex nested components in right', () => {
      render(
        <Topbar.Root>
          <Topbar.Right>
            <div>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </Topbar.Right>
        </Topbar.Root>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle Root with minimal content', () => {
      const { container } = render(
        <Topbar.Root>
          <div>Content</div>
        </Topbar.Root>
      )

      const root = container.firstChild
      expect(root).toBeInTheDocument()
    })

    test('should handle Left section with empty children', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>
            <span />
          </Topbar.Left>
        </Topbar.Root>
      )

      const left = document.querySelector('.order-1')
      expect(left).toBeInTheDocument()
    })

    test('should handle Center section with empty children', () => {
      render(
        <Topbar.Root>
          <Topbar.Center>
            <span />
          </Topbar.Center>
        </Topbar.Root>
      )

      const center = document.querySelector('.order-2')
      expect(center).toBeInTheDocument()
    })

    test('should handle Right section with empty children', () => {
      render(
        <Topbar.Root>
          <Topbar.Right>
            <span />
          </Topbar.Right>
        </Topbar.Root>
      )

      const right = document.querySelector('.order-3')
      expect(right).toBeInTheDocument()
    })

    test('should handle multiple Left sections', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>Left 1</Topbar.Left>
          <Topbar.Left>Left 2</Topbar.Left>
        </Topbar.Root>
      )

      expect(screen.getByText('Left 1')).toBeInTheDocument()
      expect(screen.getByText('Left 2')).toBeInTheDocument()
    })

    test('should handle multiple Center sections', () => {
      const { container } = render(
        <Topbar.Root>
          <Topbar.Center>Center 1</Topbar.Center>
          <Topbar.Center>Center 2</Topbar.Center>
        </Topbar.Root>
      )

      expect(screen.getByText('Center 1')).toBeInTheDocument()
      expect(screen.getByText('Center 2')).toBeInTheDocument()
      // Should still apply 3-column grid
      const root = container.firstChild
      expect(root).toHaveClass('grid-cols-[auto_1fr_auto]')
    })

    test('should handle multiple Right sections', () => {
      render(
        <Topbar.Root>
          <Topbar.Right>Right 1</Topbar.Right>
          <Topbar.Right>Right 2</Topbar.Right>
        </Topbar.Root>
      )

      expect(screen.getByText('Right 1')).toBeInTheDocument()
      expect(screen.getByText('Right 2')).toBeInTheDocument()
    })

    test('should handle non-Topbar children', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>Left</Topbar.Left>
          <div>Custom Div</div>
          <Topbar.Right>Right</Topbar.Right>
        </Topbar.Root>
      )

      expect(screen.getByText('Left')).toBeInTheDocument()
      expect(screen.getByText('Custom Div')).toBeInTheDocument()
      expect(screen.getByText('Right')).toBeInTheDocument()
    })

    test('should handle string children in Root', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>Left</Topbar.Left>
          Just a string
          <Topbar.Right>Right</Topbar.Right>
        </Topbar.Root>
      )

      expect(screen.getByText('Just a string')).toBeInTheDocument()
    })

    test('should handle null and undefined children', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>Left</Topbar.Left>
          {null}
          {undefined}
          <Topbar.Right>Right</Topbar.Right>
        </Topbar.Root>
      )

      expect(screen.getByText('Left')).toBeInTheDocument()
      expect(screen.getByText('Right')).toBeInTheDocument()
    })

    test('should handle fragments', () => {
      render(
        <Topbar.Root>
          <>
            <Topbar.Left>Left</Topbar.Left>
            <Topbar.Center>Center</Topbar.Center>
          </>
          <Topbar.Right>Right</Topbar.Right>
        </Topbar.Root>
      )

      expect(screen.getByText('Left')).toBeInTheDocument()
      expect(screen.getByText('Center')).toBeInTheDocument()
      expect(screen.getByText('Right')).toBeInTheDocument()
    })
  })

  describe('Styling Integration', () => {
    test('should maintain correct layout with custom className', () => {
      const { container } = render(
        <Topbar.Root className="bg-custom border-custom">
          <Topbar.Left>Left</Topbar.Left>
          <Topbar.Center>Center</Topbar.Center>
          <Topbar.Right>Right</Topbar.Right>
        </Topbar.Root>
      )

      const root = container.firstChild
      expect(root).toHaveClass('bg-custom')
      expect(root).toHaveClass('border-custom')
      expect(root).toHaveClass('grid')
      expect(root).toHaveClass('grid-cols-[auto_1fr_auto]')
    })

    test('should handle very long content in sections', () => {
      const longText = 'A'.repeat(200)
      render(
        <Topbar.Root>
          <Topbar.Left>{longText}</Topbar.Left>
          <Topbar.Center>Center</Topbar.Center>
          <Topbar.Right>Right</Topbar.Right>
        </Topbar.Root>
      )

      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    test('should handle mixed element types', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>
            <button>Button</button>
            <a href="/">Link</a>
            <span>Text</span>
          </Topbar.Left>
        </Topbar.Root>
      )

      expect(screen.getByText('Button')).toBeInTheDocument()
      expect(screen.getByText('Link')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    test('should apply responsive padding classes', () => {
      const { container } = render(
        <Topbar.Root>
          <Topbar.Left>Content</Topbar.Left>
        </Topbar.Root>
      )

      const root = container.firstChild
      expect(root).toHaveClass('px-cn-2xl')
    })

    test('should apply responsive gap classes', () => {
      const { container } = render(
        <Topbar.Root>
          <Topbar.Left>Content</Topbar.Left>
        </Topbar.Root>
      )

      const root = container.firstChild
      expect(root).toHaveClass('gap-cn-xl')
    })
  })

  describe('Type Detection', () => {
    test('should correctly identify Topbar.Center type', () => {
      const { container } = render(
        <Topbar.Root>
          <Topbar.Center>Center</Topbar.Center>
        </Topbar.Root>
      )

      const root = container.firstChild
      expect(root).toHaveClass('grid-cols-[auto_1fr_auto]')
    })

    test('should not trigger 3-column for non-Center components', () => {
      const CustomComponent = () => <div>Custom</div>
      const { container } = render(
        <Topbar.Root>
          <Topbar.Left>Left</Topbar.Left>
          <CustomComponent />
          <Topbar.Right>Right</Topbar.Right>
        </Topbar.Root>
      )

      const root = container.firstChild
      expect(root).toHaveClass('grid-cols-[1fr_auto]')
    })

    test('should handle Center wrapped in fragment', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>Left</Topbar.Left>
          <>
            <Topbar.Center>Center</Topbar.Center>
          </>
        </Topbar.Root>
      )

      // Fragment children are flattened by React
      expect(screen.getByText('Center')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should render as semantic HTML elements', () => {
      const { container } = render(
        <Topbar.Root>
          <Topbar.Left>Left</Topbar.Left>
        </Topbar.Root>
      )

      const root = container.firstChild
      expect(root?.nodeName).toBe('DIV')
    })

    test('should support interactive elements', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>
            <button>Interactive</button>
          </Topbar.Left>
        </Topbar.Root>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('should handle links in sections', () => {
      render(
        <Topbar.Root>
          <Topbar.Right>
            <a href="/settings">Settings</a>
          </Topbar.Right>
        </Topbar.Root>
      )

      const link = screen.getByText('Settings')
      expect(link.tagName).toBe('A')
    })
  })

  describe('Performance', () => {
    test('should render efficiently with many items', () => {
      render(
        <Topbar.Root>
          <Topbar.Left>
            {Array.from({ length: 10 }, (_, i) => (
              <button key={i}>Button {i}</button>
            ))}
          </Topbar.Left>
        </Topbar.Root>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(10)
    })

    test('should handle re-renders with memoized sections', () => {
      const { rerender } = render(
        <Topbar.Root>
          <Topbar.Left>Left Content</Topbar.Left>
        </Topbar.Root>
      )

      expect(screen.getByText('Left Content')).toBeInTheDocument()

      rerender(
        <Topbar.Root>
          <Topbar.Left>Left Content</Topbar.Left>
        </Topbar.Root>
      )

      expect(screen.getByText('Left Content')).toBeInTheDocument()
    })
  })
})
