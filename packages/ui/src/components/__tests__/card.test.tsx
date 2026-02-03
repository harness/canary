import React from 'react'

import { render, screen } from '@testing-library/react'

import { Card } from '../card'

const renderComponent = (component: React.ReactElement) => {
  return render(component)
}

describe('Card', () => {
  describe('Card.Root', () => {
    describe('Basic Rendering', () => {
      test('should render card root element', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card')
        expect(card).toBeInTheDocument()
      })

      test('should render children', () => {
        renderComponent(
          <Card.Root>
            <Card.Content>Test Content</Card.Content>
          </Card.Root>
        )

        expect(screen.getByText('Test Content')).toBeInTheDocument()
      })

      test('should forward ref to div element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <Card.Root ref={ref}>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })
    })

    describe('Size Variants', () => {
      test('should apply small size variant', () => {
        const { container } = renderComponent(
          <Card.Root size="sm">
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-sm')
        expect(card).toBeInTheDocument()
      })

      test('should apply medium size variant by default', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-md')
        expect(card).toBeInTheDocument()
      })

      test('should apply large size variant', () => {
        const { container } = renderComponent(
          <Card.Root size="lg">
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-lg')
        expect(card).toBeInTheDocument()
      })
    })

    describe('Orientation Variants', () => {
      test('should apply vertical orientation by default', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-vertical')
        expect(card).toBeInTheDocument()
      })

      test('should apply horizontal orientation', () => {
        const { container } = renderComponent(
          <Card.Root orientation="horizontal">
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-horizontal')
        expect(card).toBeInTheDocument()
      })
    })

    describe('Position Variants', () => {
      test('should apply start position by default', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-position-start')
        expect(card).toBeInTheDocument()
      })

      test('should apply end position', () => {
        const { container } = renderComponent(
          <Card.Root position="end">
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-position-end')
        expect(card).toBeInTheDocument()
      })
    })

    describe('Selected State', () => {
      test('should not be selected by default', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-selected')
        expect(card).not.toBeInTheDocument()
      })

      test('should apply selected state', () => {
        const { container } = renderComponent(
          <Card.Root selected>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-selected')
        expect(card).toBeInTheDocument()
      })

      test('should handle selected as false explicitly', () => {
        const { container } = renderComponent(
          <Card.Root selected={false}>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-selected')
        expect(card).not.toBeInTheDocument()
      })
    })

    describe('Disabled State', () => {
      test('should not be disabled by default', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-disabled')
        expect(card).not.toBeInTheDocument()
      })

      test('should apply disabled state', () => {
        const { container } = renderComponent(
          <Card.Root disabled>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-disabled')
        expect(card).toBeInTheDocument()
      })

      test('should handle disabled as false explicitly', () => {
        const { container } = renderComponent(
          <Card.Root disabled={false}>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-disabled')
        expect(card).not.toBeInTheDocument()
      })
    })

    describe('Interactive State', () => {
      test('should not be interactive by default without onClick', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-interactive')
        expect(card).not.toBeInTheDocument()
      })

      test('should be interactive when onClick is provided', () => {
        const { container } = renderComponent(
          <Card.Root onClick={() => {}}>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-interactive')
        expect(card).toBeInTheDocument()
      })

      test('should apply non-interactive state', () => {
        const { container } = renderComponent(
          <Card.Root interactive={false}>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-interactive')
        expect(card).not.toBeInTheDocument()
      })

      test('should handle interactive as true explicitly', () => {
        const { container } = renderComponent(
          <Card.Root interactive>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card-interactive')
        expect(card).toBeInTheDocument()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <Card.Root className="custom-card">
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.custom-card')
        expect(card).toBeInTheDocument()
      })

      test('should apply custom wrapperClassname', () => {
        const { container } = renderComponent(
          <Card.Root wrapperClassname="custom-wrapper">
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const wrapper = container.querySelector('.custom-wrapper')
        expect(wrapper).toBeInTheDocument()
      })

      test('should combine custom className with variant classes', () => {
        const { container } = renderComponent(
          <Card.Root className="custom-card" size="lg" selected>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.custom-card.cn-card-lg.cn-card-selected')
        expect(card).toBeInTheDocument()
      })
    })

    describe('Image Handling', () => {
      test('should separate CardImage from other content', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Image src="/test.jpg" alt="Test" />
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const image = container.querySelector('.cn-card-image')
        const wrapper = container.querySelector('.cn-card-content-wrapper')

        expect(image).toBeInTheDocument()
        expect(wrapper).toBeInTheDocument()
        expect(image?.parentElement).not.toBe(wrapper)
      })

      test('should only use first CardImage when multiple are provided', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Image src="/test1.jpg" alt="Test 1" />
            <Card.Image src="/test2.jpg" alt="Test 2" />
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const images = container.querySelectorAll('.cn-card-image')
        expect(images.length).toBe(1)
      })

      test('should render without image', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const image = container.querySelector('.cn-card-image')
        expect(image).not.toBeInTheDocument()
      })

      test('should place non-image content in content wrapper', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Title>Title</Card.Title>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const wrapper = container.querySelector('.cn-card-content-wrapper')
        const title = screen.getByText('Title')
        const content = screen.getByText('Content')

        expect(wrapper).toContainElement(title)
        expect(wrapper).toContainElement(content)
      })
    })

    describe('Props Forwarding', () => {
      test('should forward data attributes', () => {
        const { container } = renderComponent(
          <Card.Root data-testid="custom-card">
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('[data-testid="custom-card"]')
        expect(card).toBeInTheDocument()
      })

      test('should forward aria attributes', () => {
        const { container } = renderComponent(
          <Card.Root aria-label="Custom card">
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('[aria-label="Custom card"]')
        expect(card).toBeInTheDocument()
      })

      test('should forward onClick handler', () => {
        const handleClick = vi.fn()
        const { container } = renderComponent(
          <Card.Root onClick={handleClick}>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector('.cn-card')
        card?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Card.Root.displayName).toBe('CardRoot')
      })
    })

    describe('Complex Scenarios', () => {
      test('should handle all variants together', () => {
        const { container } = renderComponent(
          <Card.Root size="lg" orientation="horizontal" position="end" selected disabled interactive={false}>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const card = container.querySelector(
          '.cn-card-lg.cn-card-horizontal.cn-card-position-end.cn-card-selected.cn-card-disabled'
        )
        expect(card).toBeInTheDocument()
        expect(card).not.toHaveClass('cn-card-interactive')
      })

      test('should handle complete card with all subcomponents', () => {
        renderComponent(
          <Card.Root>
            <Card.Image src="/test.jpg" alt="Test Image" />
            <Card.Title>Card Title</Card.Title>
            <Card.Content>Card Content</Card.Content>
          </Card.Root>
        )

        expect(screen.getByAltText('Test Image')).toBeInTheDocument()
        expect(screen.getByText('Card Title')).toBeInTheDocument()
        expect(screen.getByText('Card Content')).toBeInTheDocument()
      })
    })
  })

  describe('Card.Title', () => {
    describe('Basic Rendering', () => {
      test('should render title element', () => {
        renderComponent(
          <Card.Root>
            <Card.Title>Title</Card.Title>
          </Card.Root>
        )

        expect(screen.getByText('Title')).toBeInTheDocument()
      })

      test('should render as h3 by default', () => {
        renderComponent(
          <Card.Root>
            <Card.Title>Title</Card.Title>
          </Card.Root>
        )

        const title = screen.getByText('Title')
        expect(title.tagName).toBe('H3')
      })

      test('should apply cn-card-title class', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Title>Title</Card.Title>
          </Card.Root>
        )

        const title = container.querySelector('.cn-card-title')
        expect(title).toBeInTheDocument()
      })

      test('should forward ref to heading element', () => {
        const ref = React.createRef<HTMLHeadingElement>()
        render(<Card.Title ref={ref}>Title</Card.Title>)

        expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
      })
    })

    describe('Heading Variants', () => {
      test('should render as h1', () => {
        renderComponent(<Card.Title as="h1">Title</Card.Title>)

        const title = screen.getByText('Title')
        expect(title.tagName).toBe('H1')
      })

      test('should render as h2', () => {
        renderComponent(<Card.Title as="h2">Title</Card.Title>)

        const title = screen.getByText('Title')
        expect(title.tagName).toBe('H2')
      })

      test('should render as h4', () => {
        renderComponent(<Card.Title as="h4">Title</Card.Title>)

        const title = screen.getByText('Title')
        expect(title.tagName).toBe('H4')
      })

      test('should render as h5', () => {
        renderComponent(<Card.Title as="h5">Title</Card.Title>)

        const title = screen.getByText('Title')
        expect(title.tagName).toBe('H5')
      })

      test('should render as h6', () => {
        renderComponent(<Card.Title as="h6">Title</Card.Title>)

        const title = screen.getByText('Title')
        expect(title.tagName).toBe('H6')
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(<Card.Title className="custom-title">Title</Card.Title>)

        const title = container.querySelector('.custom-title')
        expect(title).toBeInTheDocument()
      })

      test('should combine custom className with base class', () => {
        const { container } = renderComponent(<Card.Title className="custom-title">Title</Card.Title>)

        const title = container.querySelector('.cn-card-title.custom-title')
        expect(title).toBeInTheDocument()
      })
    })

    describe('Props Forwarding', () => {
      test('should forward data attributes', () => {
        renderComponent(<Card.Title data-testid="custom-title">Title</Card.Title>)

        const title = screen.getByTestId('custom-title')
        expect(title).toBeInTheDocument()
      })

      test('should forward id attribute', () => {
        renderComponent(<Card.Title id="card-title">Title</Card.Title>)

        const title = document.getElementById('card-title')
        expect(title).toBeInTheDocument()
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Card.Title.displayName).toBe('CardTitle')
      })
    })
  })

  describe('Card.Content', () => {
    describe('Basic Rendering', () => {
      test('should render content element', () => {
        renderComponent(
          <Card.Root>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      test('should apply cn-card-content class', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Content>Content</Card.Content>
          </Card.Root>
        )

        const content = container.querySelector('.cn-card-content')
        expect(content).toBeInTheDocument()
      })

      test('should forward ref to div element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(<Card.Content ref={ref}>Content</Card.Content>)

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(<Card.Content className="custom-content">Content</Card.Content>)

        const content = container.querySelector('.custom-content')
        expect(content).toBeInTheDocument()
      })

      test('should combine custom className with base class', () => {
        const { container } = renderComponent(<Card.Content className="custom-content">Content</Card.Content>)

        const content = container.querySelector('.cn-card-content.custom-content')
        expect(content).toBeInTheDocument()
      })
    })

    describe('Props Forwarding', () => {
      test('should forward data attributes', () => {
        renderComponent(<Card.Content data-testid="custom-content">Content</Card.Content>)

        const content = screen.getByTestId('custom-content')
        expect(content).toBeInTheDocument()
      })

      test('should forward role attribute', () => {
        const { container } = renderComponent(<Card.Content role="article">Content</Card.Content>)

        const content = container.querySelector('[role="article"]')
        expect(content).toBeInTheDocument()
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Card.Content.displayName).toBe('CardContent')
      })
    })
  })

  describe('Card.Image', () => {
    describe('Basic Rendering', () => {
      test('should render image element', () => {
        renderComponent(
          <Card.Root>
            <Card.Image src="/test.jpg" alt="Test Image" />
          </Card.Root>
        )

        expect(screen.getByAltText('Test Image')).toBeInTheDocument()
      })

      test('should apply cn-card-image class', () => {
        const { container } = renderComponent(
          <Card.Root>
            <Card.Image src="/test.jpg" alt="Test" />
          </Card.Root>
        )

        const image = container.querySelector('.cn-card-image')
        expect(image).toBeInTheDocument()
      })

      test('should forward ref to img element', () => {
        const ref = React.createRef<HTMLImageElement>()
        render(<Card.Image ref={ref} src="/test.jpg" alt="Test" />)

        expect(ref.current).toBeInstanceOf(HTMLImageElement)
      })

      test('should set src attribute', () => {
        renderComponent(<Card.Image src="/test.jpg" alt="Test" />)

        const image = screen.getByAltText('Test')
        expect(image).toHaveAttribute('src', '/test.jpg')
      })

      test('should set alt attribute', () => {
        renderComponent(<Card.Image src="/test.jpg" alt="Test Image" />)

        const image = screen.getByAltText('Test Image')
        expect(image).toBeInTheDocument()
      })
    })

    describe('Dimensions', () => {
      test('should set width as number in pixels', () => {
        renderComponent(<Card.Image src="/test.jpg" alt="Test" width={200} />)

        const image = screen.getByAltText('Test') as HTMLImageElement
        expect(image.style.width).toBe('200px')
      })

      test('should set width as string', () => {
        renderComponent(<Card.Image src="/test.jpg" alt="Test" width="50%" />)

        const image = screen.getByAltText('Test') as HTMLImageElement
        expect(image.style.width).toBe('50%')
      })

      test('should set height as number in pixels', () => {
        renderComponent(<Card.Image src="/test.jpg" alt="Test" height={150} />)

        const image = screen.getByAltText('Test') as HTMLImageElement
        expect(image.style.height).toBe('150px')
      })

      test('should set height as string', () => {
        renderComponent(<Card.Image src="/test.jpg" alt="Test" height="auto" />)

        const image = screen.getByAltText('Test') as HTMLImageElement
        expect(image.style.height).toBe('auto')
      })

      test('should set both width and height', () => {
        renderComponent(<Card.Image src="/test.jpg" alt="Test" width={200} height={150} />)

        const image = screen.getByAltText('Test') as HTMLImageElement
        expect(image.style.width).toBe('200px')
        expect(image.style.height).toBe('150px')
      })

      test('should handle mixed number and string dimensions', () => {
        renderComponent(<Card.Image src="/test.jpg" alt="Test" width={200} height="100%" />)

        const image = screen.getByAltText('Test') as HTMLImageElement
        expect(image.style.width).toBe('200px')
        expect(image.style.height).toBe('100%')
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(<Card.Image src="/test.jpg" alt="Test" className="custom-image" />)

        const image = container.querySelector('.custom-image')
        expect(image).toBeInTheDocument()
      })

      test('should combine custom className with base class', () => {
        const { container } = renderComponent(<Card.Image src="/test.jpg" alt="Test" className="custom-image" />)

        const image = container.querySelector('.cn-card-image.custom-image')
        expect(image).toBeInTheDocument()
      })
    })

    describe('Props Forwarding', () => {
      test('should forward data attributes', () => {
        renderComponent(<Card.Image src="/test.jpg" alt="Test" data-testid="custom-image" />)

        const image = screen.getByTestId('custom-image')
        expect(image).toBeInTheDocument()
      })

      test('should forward loading attribute', () => {
        renderComponent(<Card.Image src="/test.jpg" alt="Test" loading="lazy" />)

        const image = screen.getByAltText('Test')
        expect(image).toHaveAttribute('loading', 'lazy')
      })

      test('should forward srcSet attribute', () => {
        renderComponent(<Card.Image src="/test.jpg" alt="Test" srcSet="/test-2x.jpg 2x" />)

        const image = screen.getByAltText('Test')
        expect(image).toHaveAttribute('srcSet', '/test-2x.jpg 2x')
      })
    })

    describe('Display Name', () => {
      test('should have correct display name', () => {
        expect(Card.Image.displayName).toBe('CardImage')
      })
    })
  })

  describe('Card Namespace', () => {
    test('should export all subcomponents', () => {
      expect(Card.Root).toBeDefined()
      expect(Card.Title).toBeDefined()
      expect(Card.Content).toBeDefined()
      expect(Card.Image).toBeDefined()
    })
  })
})
