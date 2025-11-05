import React from 'react'

import { render, screen } from '@testing-library/react'

import { Layout } from '../layout'

const renderComponent = (component: React.ReactElement) => {
  return render(component)
}

describe('Layout', () => {
  describe('Layout.Flex', () => {
    describe('Basic Rendering', () => {
      test('should render flex element', () => {
        const { container } = renderComponent(
          <Layout.Flex>
            <div>Child 1</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.flex')
        expect(flex).toBeInTheDocument()
      })

      test('should render children', () => {
        renderComponent(
          <Layout.Flex>
            <div>Test Child</div>
          </Layout.Flex>
        )

        expect(screen.getByText('Test Child')).toBeInTheDocument()
      })

      test('should render as div by default', () => {
        const { container } = renderComponent(
          <Layout.Flex>
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.flex')
        expect(flex?.tagName).toBe('DIV')
      })

      test('should forward ref to element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <Layout.Flex ref={ref}>
            <div>Child</div>
          </Layout.Flex>
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })

      test('should have correct display name', () => {
        expect(Layout.Flex.displayName).toBe('LayoutFlex')
      })
    })

    describe('Direction Variants', () => {
      test('should apply row direction by default', () => {
        const { container } = renderComponent(
          <Layout.Flex>
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.flex-row')
        expect(flex).toBeInTheDocument()
      })

      test('should apply column direction', () => {
        const { container } = renderComponent(
          <Layout.Flex direction="column">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.flex-col')
        expect(flex).toBeInTheDocument()
      })

      test('should apply row-reverse direction', () => {
        const { container } = renderComponent(
          <Layout.Flex direction="row-reverse">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.flex-row-reverse')
        expect(flex).toBeInTheDocument()
      })

      test('should apply column-reverse direction', () => {
        const { container } = renderComponent(
          <Layout.Flex direction="column-reverse">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.flex-col-reverse')
        expect(flex).toBeInTheDocument()
      })
    })

    describe('Align Variants', () => {
      test('should apply start alignment', () => {
        const { container } = renderComponent(
          <Layout.Flex align="start">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.items-start')
        expect(flex).toBeInTheDocument()
      })

      test('should apply center alignment', () => {
        const { container } = renderComponent(
          <Layout.Flex align="center">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.items-center')
        expect(flex).toBeInTheDocument()
      })

      test('should apply end alignment', () => {
        const { container } = renderComponent(
          <Layout.Flex align="end">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.items-end')
        expect(flex).toBeInTheDocument()
      })

      test('should apply baseline alignment', () => {
        const { container } = renderComponent(
          <Layout.Flex align="baseline">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.items-baseline')
        expect(flex).toBeInTheDocument()
      })

      test('should apply stretch alignment', () => {
        const { container } = renderComponent(
          <Layout.Flex align="stretch">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.items-stretch')
        expect(flex).toBeInTheDocument()
      })
    })

    describe('Justify Variants', () => {
      test('should apply start justification', () => {
        const { container } = renderComponent(
          <Layout.Flex justify="start">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.justify-start')
        expect(flex).toBeInTheDocument()
      })

      test('should apply center justification', () => {
        const { container } = renderComponent(
          <Layout.Flex justify="center">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.justify-center')
        expect(flex).toBeInTheDocument()
      })

      test('should apply end justification', () => {
        const { container } = renderComponent(
          <Layout.Flex justify="end">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.justify-end')
        expect(flex).toBeInTheDocument()
      })

      test('should apply between justification', () => {
        const { container } = renderComponent(
          <Layout.Flex justify="between">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.justify-between')
        expect(flex).toBeInTheDocument()
      })
    })

    describe('Wrap Variants', () => {
      test('should apply nowrap', () => {
        const { container } = renderComponent(
          <Layout.Flex wrap="nowrap">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.flex-nowrap')
        expect(flex).toBeInTheDocument()
      })

      test('should apply wrap', () => {
        const { container } = renderComponent(
          <Layout.Flex wrap="wrap">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.flex-wrap')
        expect(flex).toBeInTheDocument()
      })

      test('should apply wrap-reverse', () => {
        const { container } = renderComponent(
          <Layout.Flex wrap="wrap-reverse">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.flex-wrap-reverse')
        expect(flex).toBeInTheDocument()
      })
    })

    describe('Grow Variant', () => {
      test('should apply flex-grow when true', () => {
        const { container } = renderComponent(
          <Layout.Flex grow>
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.flex-grow')
        expect(flex).toBeInTheDocument()
      })

      test('should apply flex-grow-0 when false', () => {
        const { container } = renderComponent(
          <Layout.Flex grow={false}>
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.flex-grow-0')
        expect(flex).toBeInTheDocument()
      })
    })

    describe('Gap Variants', () => {
      test('should apply gap none', () => {
        const { container } = renderComponent(
          <Layout.Flex gap="none">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.gap-0')
        expect(flex).toBeInTheDocument()
      })

      test('should apply gap md', () => {
        const { container } = renderComponent(
          <Layout.Flex gap="md">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.gap-cn-md')
        expect(flex).toBeInTheDocument()
      })

      test('should apply gap lg', () => {
        const { container } = renderComponent(
          <Layout.Flex gap="lg">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.gap-cn-lg')
        expect(flex).toBeInTheDocument()
      })

      test('should apply gapX', () => {
        const { container } = renderComponent(
          <Layout.Flex gapX="sm">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.gap-x-cn-sm')
        expect(flex).toBeInTheDocument()
      })

      test('should apply gapY', () => {
        const { container } = renderComponent(
          <Layout.Flex gapY="lg">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.gap-y-cn-lg')
        expect(flex).toBeInTheDocument()
      })

      test('should apply both gapX and gapY', () => {
        const { container } = renderComponent(
          <Layout.Flex gapX="sm" gapY="lg">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.gap-x-cn-sm.gap-y-cn-lg')
        expect(flex).toBeInTheDocument()
      })
    })

    describe('Custom Element', () => {
      test('should render as custom element', () => {
        const { container } = renderComponent(
          <Layout.Flex as="section">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('section')
        expect(flex).toBeInTheDocument()
      })

      test('should render as article', () => {
        const { container } = renderComponent(
          <Layout.Flex as="article">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('article')
        expect(flex).toBeInTheDocument()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <Layout.Flex className="custom-flex">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = container.querySelector('.custom-flex')
        expect(flex).toBeInTheDocument()
      })
    })

    describe('Props Forwarding', () => {
      test('should forward data attributes', () => {
        renderComponent(
          <Layout.Flex data-testid="custom-flex">
            <div>Child</div>
          </Layout.Flex>
        )

        const flex = screen.getByTestId('custom-flex')
        expect(flex).toBeInTheDocument()
      })
    })
  })

  describe('Layout.Grid', () => {
    describe('Basic Rendering', () => {
      test('should render grid element', () => {
        const { container } = renderComponent(
          <Layout.Grid>
            <div>Child 1</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.grid')
        expect(grid).toBeInTheDocument()
      })

      test('should render children', () => {
        renderComponent(
          <Layout.Grid>
            <div>Test Child</div>
          </Layout.Grid>
        )

        expect(screen.getByText('Test Child')).toBeInTheDocument()
      })

      test('should render as div by default', () => {
        const { container } = renderComponent(
          <Layout.Grid>
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.grid')
        expect(grid?.tagName).toBe('DIV')
      })

      test('should forward ref to element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <Layout.Grid ref={ref}>
            <div>Child</div>
          </Layout.Grid>
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })

      test('should have correct display name', () => {
        expect(Layout.Grid.displayName).toBe('LayoutGrid')
      })
    })

    describe('Columns Configuration', () => {
      test('should set columns as number', () => {
        const { container } = renderComponent(
          <Layout.Grid columns={3}>
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.grid') as HTMLElement
        expect(grid.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))')
      })

      test('should set columns as string', () => {
        const { container } = renderComponent(
          <Layout.Grid columns="200px 1fr 200px">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.grid') as HTMLElement
        expect(grid.style.gridTemplateColumns).toBe('200px 1fr 200px')
      })
    })

    describe('Rows Configuration', () => {
      test('should set rows as number', () => {
        const { container } = renderComponent(
          <Layout.Grid rows={2}>
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.grid') as HTMLElement
        expect(grid.style.gridTemplateRows).toBe('repeat(2, minmax(0, auto))')
      })

      test('should set rows as string', () => {
        const { container } = renderComponent(
          <Layout.Grid rows="100px auto 100px">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.grid') as HTMLElement
        expect(grid.style.gridTemplateRows).toBe('100px auto 100px')
      })
    })

    describe('Flow Configuration', () => {
      test('should set grid auto flow', () => {
        const { container } = renderComponent(
          <Layout.Grid flow="column">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.grid') as HTMLElement
        expect(grid.style.gridAutoFlow).toBe('column')
      })

      test('should handle dense flow', () => {
        const { container } = renderComponent(
          <Layout.Grid flow="dense">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.grid') as HTMLElement
        expect(grid.style.gridAutoFlow).toBe('dense')
      })

      test('should handle row dense flow', () => {
        const { container } = renderComponent(
          <Layout.Grid flow="row dense">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.grid') as HTMLElement
        expect(grid.style.gridAutoFlow).toBe('row dense')
      })

      test('should handle column dense flow', () => {
        const { container } = renderComponent(
          <Layout.Grid flow="column dense">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.grid') as HTMLElement
        expect(grid.style.gridAutoFlow).toBe('column dense')
      })
    })

    describe('Align Variants', () => {
      test('should apply start alignment', () => {
        const { container } = renderComponent(
          <Layout.Grid align="start">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.items-start')
        expect(grid).toBeInTheDocument()
      })

      test('should apply center alignment', () => {
        const { container } = renderComponent(
          <Layout.Grid align="center">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.items-center')
        expect(grid).toBeInTheDocument()
      })

      test('should apply end alignment', () => {
        const { container } = renderComponent(
          <Layout.Grid align="end">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.items-end')
        expect(grid).toBeInTheDocument()
      })

      test('should apply baseline alignment', () => {
        const { container } = renderComponent(
          <Layout.Grid align="baseline">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.items-baseline')
        expect(grid).toBeInTheDocument()
      })

      test('should apply stretch alignment', () => {
        const { container } = renderComponent(
          <Layout.Grid align="stretch">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.items-stretch')
        expect(grid).toBeInTheDocument()
      })
    })

    describe('Justify Variants', () => {
      test('should apply start justification', () => {
        const { container } = renderComponent(
          <Layout.Grid justify="start">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.justify-start')
        expect(grid).toBeInTheDocument()
      })

      test('should apply center justification', () => {
        const { container } = renderComponent(
          <Layout.Grid justify="center">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.justify-center')
        expect(grid).toBeInTheDocument()
      })

      test('should apply end justification', () => {
        const { container } = renderComponent(
          <Layout.Grid justify="end">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.justify-end')
        expect(grid).toBeInTheDocument()
      })

      test('should apply between justification', () => {
        const { container } = renderComponent(
          <Layout.Grid justify="between">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.justify-between')
        expect(grid).toBeInTheDocument()
      })
    })

    describe('Gap Variants', () => {
      test('should apply gap sm', () => {
        const { container } = renderComponent(
          <Layout.Grid gap="sm">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.gap-cn-sm')
        expect(grid).toBeInTheDocument()
      })

      test('should apply gap md', () => {
        const { container } = renderComponent(
          <Layout.Grid gap="md">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.gap-cn-md')
        expect(grid).toBeInTheDocument()
      })

      test('should apply gapX and gapY independently', () => {
        const { container } = renderComponent(
          <Layout.Grid gapX="xs" gapY="xl">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.gap-x-cn-xs.gap-y-cn-xl')
        expect(grid).toBeInTheDocument()
      })
    })

    describe('Custom Element', () => {
      test('should render as custom element', () => {
        const { container } = renderComponent(
          <Layout.Grid as="section">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('section')
        expect(grid).toBeInTheDocument()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <Layout.Grid className="custom-grid">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.custom-grid')
        expect(grid).toBeInTheDocument()
      })

      test('should merge custom styles', () => {
        const { container } = renderComponent(
          <Layout.Grid style={{ padding: '10px' }} columns={2}>
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = container.querySelector('.grid') as HTMLElement
        expect(grid.style.padding).toBe('10px')
        expect(grid.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))')
      })
    })

    describe('Props Forwarding', () => {
      test('should forward data attributes', () => {
        renderComponent(
          <Layout.Grid data-testid="custom-grid">
            <div>Child</div>
          </Layout.Grid>
        )

        const grid = screen.getByTestId('custom-grid')
        expect(grid).toBeInTheDocument()
      })
    })
  })

  describe('Layout.Horizontal', () => {
    describe('Basic Rendering', () => {
      test('should render horizontal layout', () => {
        const { container } = renderComponent(
          <Layout.Horizontal>
            <div>Child</div>
          </Layout.Horizontal>
        )

        const horizontal = container.querySelector('.flex-row')
        expect(horizontal).toBeInTheDocument()
      })

      test('should render children', () => {
        renderComponent(
          <Layout.Horizontal>
            <div>Test Child</div>
          </Layout.Horizontal>
        )

        expect(screen.getByText('Test Child')).toBeInTheDocument()
      })

      test('should forward ref to element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <Layout.Horizontal ref={ref}>
            <div>Child</div>
          </Layout.Horizontal>
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })

      test('should have correct display name', () => {
        expect(Layout.Horizontal.displayName).toBe('LayoutHorizontal')
      })
    })

    describe('Default Gap', () => {
      test('should apply medium gap by default', () => {
        const { container } = renderComponent(
          <Layout.Horizontal>
            <div>Child</div>
          </Layout.Horizontal>
        )

        const horizontal = container.querySelector('.gap-cn-md')
        expect(horizontal).toBeInTheDocument()
      })

      test('should override default gap', () => {
        const { container } = renderComponent(
          <Layout.Horizontal gap="lg">
            <div>Child</div>
          </Layout.Horizontal>
        )

        const horizontal = container.querySelector('.gap-cn-lg')
        expect(horizontal).toBeInTheDocument()
      })
    })

    describe('Flex Props', () => {
      test('should accept align prop', () => {
        const { container } = renderComponent(
          <Layout.Horizontal align="center">
            <div>Child</div>
          </Layout.Horizontal>
        )

        const horizontal = container.querySelector('.items-center')
        expect(horizontal).toBeInTheDocument()
      })

      test('should accept justify prop', () => {
        const { container } = renderComponent(
          <Layout.Horizontal justify="between">
            <div>Child</div>
          </Layout.Horizontal>
        )

        const horizontal = container.querySelector('.justify-between')
        expect(horizontal).toBeInTheDocument()
      })

      test('should accept wrap prop', () => {
        const { container } = renderComponent(
          <Layout.Horizontal wrap="wrap">
            <div>Child</div>
          </Layout.Horizontal>
        )

        const horizontal = container.querySelector('.flex-wrap')
        expect(horizontal).toBeInTheDocument()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <Layout.Horizontal className="custom-horizontal">
            <div>Child</div>
          </Layout.Horizontal>
        )

        const horizontal = container.querySelector('.custom-horizontal')
        expect(horizontal).toBeInTheDocument()
      })
    })
  })

  describe('Layout.Vertical', () => {
    describe('Basic Rendering', () => {
      test('should render vertical layout', () => {
        const { container } = renderComponent(
          <Layout.Vertical>
            <div>Child</div>
          </Layout.Vertical>
        )

        const vertical = container.querySelector('.flex-col')
        expect(vertical).toBeInTheDocument()
      })

      test('should render children', () => {
        renderComponent(
          <Layout.Vertical>
            <div>Test Child</div>
          </Layout.Vertical>
        )

        expect(screen.getByText('Test Child')).toBeInTheDocument()
      })

      test('should forward ref to element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <Layout.Vertical ref={ref}>
            <div>Child</div>
          </Layout.Vertical>
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })

      test('should have correct display name', () => {
        expect(Layout.Vertical.displayName).toBe('LayoutVertical')
      })
    })

    describe('Default Gap', () => {
      test('should apply medium gap by default', () => {
        const { container } = renderComponent(
          <Layout.Vertical>
            <div>Child</div>
          </Layout.Vertical>
        )

        const vertical = container.querySelector('.gap-cn-md')
        expect(vertical).toBeInTheDocument()
      })

      test('should override default gap', () => {
        const { container } = renderComponent(
          <Layout.Vertical gap="xs">
            <div>Child</div>
          </Layout.Vertical>
        )

        const vertical = container.querySelector('.gap-cn-xs')
        expect(vertical).toBeInTheDocument()
      })
    })

    describe('Flex Props', () => {
      test('should accept align prop', () => {
        const { container } = renderComponent(
          <Layout.Vertical align="center">
            <div>Child</div>
          </Layout.Vertical>
        )

        const vertical = container.querySelector('.items-center')
        expect(vertical).toBeInTheDocument()
      })

      test('should accept justify prop', () => {
        const { container } = renderComponent(
          <Layout.Vertical justify="between">
            <div>Child</div>
          </Layout.Vertical>
        )

        const vertical = container.querySelector('.justify-between')
        expect(vertical).toBeInTheDocument()
      })

      test('should accept wrap prop', () => {
        const { container } = renderComponent(
          <Layout.Vertical wrap="wrap">
            <div>Child</div>
          </Layout.Vertical>
        )

        const vertical = container.querySelector('.flex-wrap')
        expect(vertical).toBeInTheDocument()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <Layout.Vertical className="custom-vertical">
            <div>Child</div>
          </Layout.Vertical>
        )

        const vertical = container.querySelector('.custom-vertical')
        expect(vertical).toBeInTheDocument()
      })
    })
  })

  describe('Layout Namespace', () => {
    test('should export all subcomponents', () => {
      expect(Layout.Flex).toBeDefined()
      expect(Layout.Grid).toBeDefined()
      expect(Layout.Horizontal).toBeDefined()
      expect(Layout.Vertical).toBeDefined()
    })
  })

  describe('Complex Scenarios', () => {
    test('should handle nested layouts', () => {
      renderComponent(
        <Layout.Vertical gap="lg">
          <Layout.Horizontal gap="sm">
            <div>Item 1</div>
            <div>Item 2</div>
          </Layout.Horizontal>
          <Layout.Grid columns={2} gap="md">
            <div>Grid Item 1</div>
            <div>Grid Item 2</div>
          </Layout.Grid>
        </Layout.Vertical>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Grid Item 1')).toBeInTheDocument()
      expect(screen.getByText('Grid Item 2')).toBeInTheDocument()
    })

    test('should handle all gap sizes', () => {
      const gapSizes = ['none', '4xs', '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const

      gapSizes.forEach(size => {
        const { container } = renderComponent(
          <Layout.Flex gap={size}>
            <div>Child</div>
          </Layout.Flex>
        )

        const expectedClass = size === 'none' ? 'gap-0' : `gap-cn-${size}`
        const flex = container.querySelector(`.${expectedClass}`)
        expect(flex).toBeInTheDocument()
      })
    })
  })
})
