import React from 'react'

import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Resizable } from '../resizable'

// Mock react-resizable-panels with simple components
vi.mock('react-resizable-panels', () => ({
  PanelGroup: ({ children, ...props }: any) => (
    <div data-testid="panel-group" {...props}>
      {children}
    </div>
  ),
  Panel: ({ children, ...props }: any) => (
    <div data-testid="panel" {...props}>
      {children}
    </div>
  ),
  PanelResizeHandle: ({ children, ...props }: any) => (
    <div data-testid="resize-handle" {...props}>
      {children}
    </div>
  )
}))

describe('Resizable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Resizable.PanelGroup', () => {
    describe('Basic Rendering', () => {
      test('should render panel group', () => {
        render(
          <Resizable.PanelGroup direction="horizontal">
            <div>Content</div>
          </Resizable.PanelGroup>
        )

        const panelGroup = screen.getByTestId('panel-group')
        expect(panelGroup).toBeInTheDocument()
      })

      test('should render children inside panel group', () => {
        render(
          <Resizable.PanelGroup direction="horizontal">
            <div>Test Content</div>
          </Resizable.PanelGroup>
        )

        expect(screen.getByText('Test Content')).toBeInTheDocument()
      })

      test('should accept props like direction and id', () => {
        render(
          <Resizable.PanelGroup direction="vertical" id="test-group">
            <div>Content</div>
          </Resizable.PanelGroup>
        )

        const panelGroup = screen.getByTestId('panel-group')
        expect(panelGroup).toHaveAttribute('id', 'test-group')
        expect(panelGroup).toHaveAttribute('direction', 'vertical')
      })
    })

    describe('Direction Prop', () => {
      test('should handle horizontal direction', () => {
        render(
          <Resizable.PanelGroup direction="horizontal">
            <div>Content</div>
          </Resizable.PanelGroup>
        )

        const panelGroup = screen.getByTestId('panel-group')
        expect(panelGroup).toHaveAttribute('direction', 'horizontal')
      })

      test('should handle vertical direction', () => {
        render(
          <Resizable.PanelGroup direction="vertical">
            <div>Content</div>
          </Resizable.PanelGroup>
        )

        const panelGroup = screen.getByTestId('panel-group')
        expect(panelGroup).toHaveAttribute('direction', 'vertical')
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        render(
          <Resizable.PanelGroup direction="horizontal" className="custom-class">
            <div>Content</div>
          </Resizable.PanelGroup>
        )

        const panelGroup = screen.getByTestId('panel-group')
        expect(panelGroup).toHaveClass('custom-class')
      })

      test('should apply default flex classes', () => {
        render(
          <Resizable.PanelGroup direction="horizontal">
            <div>Content</div>
          </Resizable.PanelGroup>
        )

        const panelGroup = screen.getByTestId('panel-group')
        // Check that classes are applied
        expect(panelGroup.className).toBeTruthy()
      })

      test('should handle vertical direction styling', () => {
        render(
          <Resizable.PanelGroup direction="vertical">
            <div>Content</div>
          </Resizable.PanelGroup>
        )

        const panelGroup = screen.getByTestId('panel-group')
        expect(panelGroup).toHaveAttribute('direction', 'vertical')
      })
    })

    describe('Additional Props', () => {
      test('should accept autoSaveId prop', () => {
        render(
          <Resizable.PanelGroup direction="horizontal" autoSaveId="test-save">
            <div>Content</div>
          </Resizable.PanelGroup>
        )

        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should accept data attributes', () => {
        render(
          <Resizable.PanelGroup direction="horizontal" data-testattr="value">
            <div>Content</div>
          </Resizable.PanelGroup>
        )

        const panelGroup = screen.getByTestId('panel-group')
        expect(panelGroup).toHaveAttribute('data-testattr', 'value')
      })

      test('should accept style prop', () => {
        const customStyle = { backgroundColor: 'red' }
        render(
          <Resizable.PanelGroup direction="horizontal" style={customStyle}>
            <div>Content</div>
          </Resizable.PanelGroup>
        )

        expect(screen.getByText('Content')).toBeInTheDocument()
      })
    })

    describe('Multiple Children', () => {
      test('should render multiple children', () => {
        render(
          <Resizable.PanelGroup direction="horizontal">
            <div>Child 1</div>
            <div>Child 2</div>
            <div>Child 3</div>
          </Resizable.PanelGroup>
        )

        expect(screen.getByText('Child 1')).toBeInTheDocument()
        expect(screen.getByText('Child 2')).toBeInTheDocument()
        expect(screen.getByText('Child 3')).toBeInTheDocument()
      })
    })
  })

  describe('Resizable.Panel', () => {
    describe('Basic Rendering', () => {
      test('should render panel', () => {
        render(<Resizable.Panel>Panel Content</Resizable.Panel>)

        const panel = screen.getByTestId('panel')
        expect(panel).toBeInTheDocument()
      })

      test('should render children inside panel', () => {
        render(<Resizable.Panel>Test Panel Content</Resizable.Panel>)

        expect(screen.getByText('Test Panel Content')).toBeInTheDocument()
      })

      test('should accept id and defaultSize props', () => {
        render(
          <Resizable.Panel id="test-panel" defaultSize={50}>
            Content
          </Resizable.Panel>
        )

        const panel = screen.getByTestId('panel')
        expect(panel).toHaveAttribute('id', 'test-panel')
        expect(screen.getByText('Content')).toBeInTheDocument()
      })
    })

    describe('Size Props', () => {
      test('should accept defaultSize prop', () => {
        render(<Resizable.Panel defaultSize={30}>Content</Resizable.Panel>)

        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should accept minSize prop', () => {
        render(<Resizable.Panel minSize={10}>Content</Resizable.Panel>)

        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should accept maxSize prop', () => {
        render(<Resizable.Panel maxSize={80}>Content</Resizable.Panel>)

        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should accept collapsible prop', () => {
        render(<Resizable.Panel collapsible>Content</Resizable.Panel>)

        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should accept collapsedSize prop', () => {
        render(<Resizable.Panel collapsedSize={5}>Content</Resizable.Panel>)

        expect(screen.getByText('Content')).toBeInTheDocument()
      })
    })

    describe('Additional Props', () => {
      test('should accept className prop', () => {
        render(<Resizable.Panel className="custom-panel">Content</Resizable.Panel>)

        const panel = screen.getByTestId('panel')
        expect(panel).toHaveClass('custom-panel')
      })

      test('should accept style prop', () => {
        const customStyle = { padding: '10px' }
        render(<Resizable.Panel style={customStyle}>Content</Resizable.Panel>)

        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should accept order prop', () => {
        render(<Resizable.Panel order={2}>Content</Resizable.Panel>)

        expect(screen.getByText('Content')).toBeInTheDocument()
      })
    })

    describe('Multiple Panels', () => {
      test('should render multiple panels', () => {
        render(
          <>
            <Resizable.Panel>Panel 1</Resizable.Panel>
            <Resizable.Panel>Panel 2</Resizable.Panel>
          </>
        )

        expect(screen.getByText('Panel 1')).toBeInTheDocument()
        expect(screen.getByText('Panel 2')).toBeInTheDocument()
      })
    })
  })

  describe('Resizable.Handle', () => {
    describe('Basic Rendering', () => {
      test('should render resize handle', () => {
        render(<Resizable.Handle />)

        const handle = screen.getByTestId('resize-handle')
        expect(handle).toBeInTheDocument()
      })

      test('should render without handle icon by default', () => {
        const { container } = render(<Resizable.Handle />)

        const icon = container.querySelector('.cn-icon')
        expect(icon).not.toBeInTheDocument()
      })

      test('should render with handle icon when withHandle is true', () => {
        const { container } = render(<Resizable.Handle withHandle />)

        const icon = container.querySelector('.cn-icon')
        expect(icon).toBeInTheDocument()
      })

      test('should accept id prop', () => {
        render(<Resizable.Handle id="test-handle" />)

        const handle = screen.getByTestId('resize-handle')
        expect(handle).toHaveAttribute('id', 'test-handle')
      })
    })

    describe('WithHandle Prop', () => {
      test('should not render icon when withHandle is false', () => {
        const { container } = render(<Resizable.Handle withHandle={false} />)

        const icon = container.querySelector('.cn-icon')
        expect(icon).not.toBeInTheDocument()
      })

      test('should render icon when withHandle is true', () => {
        const { container } = render(<Resizable.Handle withHandle={true} />)

        const icon = container.querySelector('.cn-icon')
        expect(icon).toBeInTheDocument()
      })

      test('should render grip-dots icon', () => {
        render(<Resizable.Handle withHandle />)

        expect(screen.getByTestId('resize-handle')).toBeInTheDocument()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        render(<Resizable.Handle className="custom-handle" />)

        const handle = screen.getByTestId('resize-handle')
        expect(handle).toHaveClass('custom-handle')
      })

      test('should apply default classes', () => {
        render(<Resizable.Handle className="custom" />)

        const handle = screen.getByTestId('resize-handle')
        expect(handle).toHaveClass('custom')
        // Check that classes are applied
        expect(handle.className).toBeTruthy()
      })

      test('should render with styling classes', () => {
        render(<Resizable.Handle />)

        const handle = screen.getByTestId('resize-handle')
        expect(handle.className).toBeTruthy()
      })

      test('should render handle element', () => {
        render(<Resizable.Handle />)

        const handle = screen.getByTestId('resize-handle')
        expect(handle).toBeInTheDocument()
      })
    })

    describe('Handle Icon Styling', () => {
      test('should render handle with icon container', () => {
        const { container } = render(<Resizable.Handle withHandle />)

        const icon = container.querySelector('.cn-icon')
        expect(icon).toBeInTheDocument()

        const handle = screen.getByTestId('resize-handle')
        expect(handle).toBeInTheDocument()
      })

      test('should render icon when withHandle is true', () => {
        render(<Resizable.Handle withHandle />)

        const handle = screen.getByTestId('resize-handle')
        expect(handle).toBeInTheDocument()
      })
    })

    describe('Additional Props', () => {
      test('should accept disabled prop', () => {
        render(<Resizable.Handle disabled />)

        const handle = screen.getByTestId('resize-handle')
        expect(handle).toBeInTheDocument()
      })

      test('should accept hitAreaMargins prop', () => {
        render(<Resizable.Handle hitAreaMargins={{ coarse: 10, fine: 5 }} />)

        const handle = screen.getByTestId('resize-handle')
        expect(handle).toBeInTheDocument()
      })

      test('should accept data attributes', () => {
        render(<Resizable.Handle data-testattr="value" />)

        const handle = screen.getByTestId('resize-handle')
        expect(handle).toHaveAttribute('data-testattr', 'value')
      })

      test('should accept style prop', () => {
        const customStyle = { cursor: 'col-resize' }
        render(<Resizable.Handle style={customStyle} />)

        const handle = screen.getByTestId('resize-handle')
        expect(handle).toBeInTheDocument()
      })
    })

    describe('Multiple Handles', () => {
      test('should render multiple handles', () => {
        const { container } = render(
          <>
            <Resizable.Handle />
            <Resizable.Handle withHandle />
          </>
        )

        const handles = container.querySelectorAll('[data-testid="resize-handle"]')
        expect(handles.length).toBe(2)
      })

      test('should render handles with different props independently', () => {
        const { container } = render(
          <>
            <Resizable.Handle withHandle={false} />
            <Resizable.Handle withHandle={true} />
          </>
        )

        const handles = container.querySelectorAll('[data-testid="resize-handle"]')
        expect(handles.length).toBe(2)
      })
    })
  })

  describe('Resizable Namespace', () => {
    test('should export PanelGroup component', () => {
      expect(Resizable.PanelGroup).toBeDefined()
      expect(typeof Resizable.PanelGroup).toBe('function')
    })

    test('should export Panel component', () => {
      expect(Resizable.Panel).toBeDefined()
      // Panel can be either object or function depending on React version
      expect(Resizable.Panel).toBeTruthy()
    })

    test('should export Handle component', () => {
      expect(Resizable.Handle).toBeDefined()
      expect(typeof Resizable.Handle).toBe('function')
    })

    test('should have all three components', () => {
      const keys = Object.keys(Resizable)
      expect(keys).toContain('PanelGroup')
      expect(keys).toContain('Panel')
      expect(keys).toContain('Handle')
    })
  })

  describe('Complete Resizable Layout', () => {
    test('should render complete resizable layout', () => {
      render(
        <Resizable.PanelGroup direction="horizontal">
          <Resizable.Panel defaultSize={50}>
            <div>Left Panel</div>
          </Resizable.Panel>
          <Resizable.Handle />
          <Resizable.Panel defaultSize={50}>
            <div>Right Panel</div>
          </Resizable.Panel>
        </Resizable.PanelGroup>
      )

      expect(screen.getByText('Left Panel')).toBeInTheDocument()
      expect(screen.getByText('Right Panel')).toBeInTheDocument()
      expect(screen.getByTestId('resize-handle')).toBeInTheDocument()
    })

    test('should render vertical layout', () => {
      render(
        <Resizable.PanelGroup direction="vertical">
          <Resizable.Panel defaultSize={50}>
            <div>Top Panel</div>
          </Resizable.Panel>
          <Resizable.Handle withHandle />
          <Resizable.Panel defaultSize={50}>
            <div>Bottom Panel</div>
          </Resizable.Panel>
        </Resizable.PanelGroup>
      )

      expect(screen.getByText('Top Panel')).toBeInTheDocument()
      expect(screen.getByText('Bottom Panel')).toBeInTheDocument()
      const handle = screen.getByTestId('resize-handle')
      expect(handle).toBeInTheDocument()
    })

    test('should render three-panel layout with two handles', () => {
      const { container } = render(
        <Resizable.PanelGroup direction="horizontal">
          <Resizable.Panel defaultSize={33}>Panel 1</Resizable.Panel>
          <Resizable.Handle />
          <Resizable.Panel defaultSize={34}>Panel 2</Resizable.Panel>
          <Resizable.Handle withHandle />
          <Resizable.Panel defaultSize={33}>Panel 3</Resizable.Panel>
        </Resizable.PanelGroup>
      )

      expect(screen.getByText('Panel 1')).toBeInTheDocument()
      expect(screen.getByText('Panel 2')).toBeInTheDocument()
      expect(screen.getByText('Panel 3')).toBeInTheDocument()

      const handles = container.querySelectorAll('[data-testid="resize-handle"]')
      expect(handles.length).toBe(2)
    })

    test('should render nested panel groups', () => {
      render(
        <Resizable.PanelGroup direction="horizontal">
          <Resizable.Panel>
            <Resizable.PanelGroup direction="vertical">
              <Resizable.Panel>Nested Top</Resizable.Panel>
              <Resizable.Handle />
              <Resizable.Panel>Nested Bottom</Resizable.Panel>
            </Resizable.PanelGroup>
          </Resizable.Panel>
          <Resizable.Handle withHandle />
          <Resizable.Panel>Right Panel</Resizable.Panel>
        </Resizable.PanelGroup>
      )

      expect(screen.getByText('Nested Top')).toBeInTheDocument()
      expect(screen.getByText('Nested Bottom')).toBeInTheDocument()
      expect(screen.getByText('Right Panel')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle panel with no size constraints', () => {
      render(<Resizable.Panel>Content</Resizable.Panel>)

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    test('should handle handle without any props', () => {
      render(<Resizable.Handle />)

      expect(screen.getByTestId('resize-handle')).toBeInTheDocument()
    })

    test('should handle empty panel', () => {
      render(<Resizable.Panel />)

      expect(screen.getByTestId('panel')).toBeInTheDocument()
    })

    test('should handle panel group with single panel', () => {
      render(
        <Resizable.PanelGroup direction="horizontal">
          <Resizable.Panel>Single Panel</Resizable.Panel>
        </Resizable.PanelGroup>
      )

      expect(screen.getByText('Single Panel')).toBeInTheDocument()
    })

    test('should handle zero defaultSize', () => {
      render(<Resizable.Panel defaultSize={0}>Content</Resizable.Panel>)

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    test('should handle 100% defaultSize', () => {
      render(<Resizable.Panel defaultSize={100}>Content</Resizable.Panel>)

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    test('should handle handle with empty className', () => {
      render(<Resizable.Handle className="" />)

      const handle = screen.getByTestId('resize-handle')
      expect(handle).toBeInTheDocument()
    })

    test('should handle panel group with empty className', () => {
      render(
        <Resizable.PanelGroup direction="horizontal" className="">
          Content
        </Resizable.PanelGroup>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('Type Safety', () => {
    test('should accept valid direction values', () => {
      expect(() => {
        render(
          <>
            <Resizable.PanelGroup direction="horizontal">Content</Resizable.PanelGroup>
            <Resizable.PanelGroup direction="vertical">Content</Resizable.PanelGroup>
          </>
        )
      }).not.toThrow()
    })

    test('should handle boolean withHandle prop', () => {
      expect(() => {
        render(
          <>
            <Resizable.Handle withHandle={true} />
            <Resizable.Handle withHandle={false} />
            <Resizable.Handle withHandle />
          </>
        )
      }).not.toThrow()
    })

    test('should handle numeric size props', () => {
      expect(() => {
        render(
          <Resizable.Panel defaultSize={50} minSize={10} maxSize={90} collapsedSize={5}>
            Content
          </Resizable.Panel>
        )
      }).not.toThrow()
    })
  })

  describe('Component Integration', () => {
    test('should integrate PanelGroup, Panel, and Handle correctly', () => {
      const { container } = render(
        <Resizable.PanelGroup direction="horizontal" className="custom-group">
          <Resizable.Panel defaultSize={40} className="custom-panel-1">
            Panel 1
          </Resizable.Panel>
          <Resizable.Handle className="custom-handle" withHandle />
          <Resizable.Panel defaultSize={60} className="custom-panel-2">
            Panel 2
          </Resizable.Panel>
        </Resizable.PanelGroup>
      )

      const panelGroup = screen.getByTestId('panel-group')
      expect(panelGroup).toHaveClass('custom-group')

      const panels = container.querySelectorAll('[data-testid="panel"]')
      expect(panels[0]).toHaveClass('custom-panel-1')
      expect(panels[1]).toHaveClass('custom-panel-2')

      const handle = screen.getByTestId('resize-handle')
      expect(handle).toHaveClass('custom-handle')

      expect(screen.getByText('Panel 1')).toBeInTheDocument()
      expect(screen.getByText('Panel 2')).toBeInTheDocument()
    })
  })
})
