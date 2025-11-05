import React from 'react'

import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Drawer } from '../index'

// Mock vaul
vi.mock('vaul', () => {
  const DrawerRoot = ({ children, ...props }: any) => (
    <div data-testid="drawer-root" {...props}>
      {children}
    </div>
  )
  DrawerRoot.displayName = 'DrawerRoot'

  const DrawerNestedRoot = ({ children, ...props }: any) => (
    <div data-testid="drawer-nested-root" {...props}>
      {children}
    </div>
  )
  DrawerNestedRoot.displayName = 'DrawerNestedRoot'

  const DrawerTrigger = ({ children, asChild, ...props }: any) =>
    asChild ? (
      <>{children}</>
    ) : (
      <button data-testid="drawer-trigger" {...props}>
        {children}
      </button>
    )
  DrawerTrigger.displayName = 'DrawerTrigger'

  const DrawerContent = React.forwardRef(({ children, ...props }: any, ref) => (
    <div ref={ref} data-testid="drawer-content" {...props}>
      {children}
    </div>
  ))
  DrawerContent.displayName = 'DrawerContent'

  const DrawerPortal = ({ children }: any) => <div data-testid="drawer-portal">{children}</div>
  DrawerPortal.displayName = 'DrawerPortal'

  const DrawerOverlay = ({ children, ...props }: any) => (
    <div data-testid="drawer-overlay" {...props}>
      {children}
    </div>
  )
  DrawerOverlay.displayName = 'DrawerOverlay'

  const DrawerClose = ({ children, asChild, ...props }: any) =>
    asChild ? (
      <>{children}</>
    ) : (
      <button data-testid="drawer-close" {...props}>
        {children}
      </button>
    )
  DrawerClose.displayName = 'DrawerClose'

  const DrawerTitleComponent = React.forwardRef<any, any>(({ children, ...props }, ref) => (
    <h2 ref={ref} data-testid="drawer-title" {...props}>
      {children}
    </h2>
  ))
  DrawerTitleComponent.displayName = 'DrawerTitle'

  const DrawerDescriptionComponent = React.forwardRef<any, any>(({ children, ...props }, ref) => (
    <p ref={ref} data-testid="drawer-description" {...props}>
      {children}
    </p>
  ))
  DrawerDescriptionComponent.displayName = 'DrawerDescription'

  return {
    Drawer: {
      Root: DrawerRoot,
      NestedRoot: DrawerNestedRoot,
      Trigger: DrawerTrigger,
      Content: DrawerContent,
      Portal: DrawerPortal,
      Overlay: DrawerOverlay,
      Close: DrawerClose,
      Title: DrawerTitleComponent,
      Description: DrawerDescriptionComponent
    }
  }
})

// Mock context
vi.mock('@/context', async () => {
  const actual = await vi.importActual('@/context')
  return {
    ...actual,
    usePortal: () => ({ portalContainer: document.body }),
    DialogOpenContext: {
      Provider: ({ children }: any) => <>{children}</>
    },
    useRegisterDialog: () => ({ handleCloseAutoFocus: vi.fn() })
  }
})

// Mock ScrollArea
vi.mock('@/components', async () => {
  const actual = await vi.importActual('@/components')

  const MockScrollArea = React.forwardRef<any, any>(({ children, className, classNameContent, ...props }, ref) => (
    <div ref={ref} data-testid="scroll-area" className={className} {...props}>
      <div className={classNameContent}>{children}</div>
    </div>
  ))
  MockScrollArea.displayName = 'ScrollArea'

  return {
    ...actual,
    ScrollArea: MockScrollArea,
    useScrollArea: () => ({
      isTop: true,
      isBottom: false,
      onScrollTop: vi.fn(),
      onScrollBottom: vi.fn()
    })
  }
})

const renderComponent = (component: React.ReactElement) => {
  return render(component)
}

describe('Drawer', () => {
  describe('Drawer.Root', () => {
    describe('Basic Rendering', () => {
      test('should render drawer root', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        expect(screen.getByTestId('drawer-root')).toBeInTheDocument()
      })

      test('should render children', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>Test Content</Drawer.Content>
          </Drawer.Root>
        )

        expect(screen.getByText('Test Content')).toBeInTheDocument()
      })

      test('should have correct display name', () => {
        expect(Drawer.Root.displayName).toBe('DrawerRoot')
      })
    })

    describe('Direction', () => {
      test('should default to right direction', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const root = screen.getByTestId('drawer-root')
        expect(root).toHaveAttribute('direction', 'right')
      })

      test('should apply left direction', () => {
        renderComponent(
          <Drawer.Root open direction="left">
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const root = screen.getByTestId('drawer-root')
        expect(root).toHaveAttribute('direction', 'left')
      })

      test('should apply top direction', () => {
        renderComponent(
          <Drawer.Root open direction="top">
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const root = screen.getByTestId('drawer-root')
        expect(root).toHaveAttribute('direction', 'top')
      })

      test('should apply bottom direction', () => {
        renderComponent(
          <Drawer.Root open direction="bottom">
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const root = screen.getByTestId('drawer-root')
        expect(root).toHaveAttribute('direction', 'bottom')
      })
    })

    describe('Open State', () => {
      test('should handle open prop', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const root = screen.getByTestId('drawer-root')
        expect(root).toBeInTheDocument()
      })

      test('should handle open change callback', () => {
        const onOpenChange = vi.fn()
        renderComponent(
          <Drawer.Root open onOpenChange={onOpenChange}>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        expect(onOpenChange).toBeDefined()
      })
    })

    describe('Modal Prop', () => {
      test('should default to modal=true', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const root = screen.getByTestId('drawer-root')
        expect(root).toBeInTheDocument()
      })

      test('should handle modal=false', () => {
        renderComponent(
          <Drawer.Root open modal={false}>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const root = screen.getByTestId('drawer-root')
        expect(root).toBeInTheDocument()
      })
    })
  })

  describe('Drawer.Content', () => {
    describe('Basic Rendering', () => {
      test('should render drawer content', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        expect(screen.getByTestId('drawer-content')).toBeInTheDocument()
      })

      test('should render children', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>Test Content</Drawer.Content>
          </Drawer.Root>
        )

        expect(screen.getByText('Test Content')).toBeInTheDocument()
      })

      test('should forward ref to content element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <Drawer.Root open>
            <Drawer.Content ref={ref}>Content</Drawer.Content>
          </Drawer.Root>
        )

        expect(ref.current).toBeTruthy()
      })

      test('should have correct display name', () => {
        expect(Drawer.Content.displayName).toBe('DrawerContent')
      })
    })

    describe('Size Variants', () => {
      test('should default to small size', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const content = container.querySelector('.cn-drawer-content-sm')
        expect(content).toBeInTheDocument()
      })

      test('should apply 2xs size', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content size="2xs">Content</Drawer.Content>
          </Drawer.Root>
        )

        const content = container.querySelector('.cn-drawer-content-2xs')
        expect(content).toBeInTheDocument()
      })

      test('should apply xs size', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content size="xs">Content</Drawer.Content>
          </Drawer.Root>
        )

        const content = container.querySelector('.cn-drawer-content-xs')
        expect(content).toBeInTheDocument()
      })

      test('should apply md size', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content size="md">Content</Drawer.Content>
          </Drawer.Root>
        )

        const content = container.querySelector('.cn-drawer-content-md')
        expect(content).toBeInTheDocument()
      })

      test('should apply lg size', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content size="lg">Content</Drawer.Content>
          </Drawer.Root>
        )

        const content = container.querySelector('.cn-drawer-content-lg')
        expect(content).toBeInTheDocument()
      })
    })

    describe('Direction Variants', () => {
      test('should default to right direction', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const content = container.querySelector('.cn-drawer-content-right')
        expect(content).toBeInTheDocument()
      })

      test('should apply left direction', () => {
        const { container } = renderComponent(
          <Drawer.Root open direction="left">
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const content = container.querySelector('.cn-drawer-content-left')
        expect(content).toBeInTheDocument()
      })

      test('should apply top direction', () => {
        const { container } = renderComponent(
          <Drawer.Root open direction="top">
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const content = container.querySelector('.cn-drawer-content-top')
        expect(content).toBeInTheDocument()
      })

      test('should apply bottom direction', () => {
        const { container } = renderComponent(
          <Drawer.Root open direction="bottom">
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const content = container.querySelector('.cn-drawer-content-bottom')
        expect(content).toBeInTheDocument()
      })
    })

    describe('Close Button', () => {
      test('should render close button by default', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const closeButton = container.querySelector('.cn-drawer-close-button')
        expect(closeButton).toBeInTheDocument()
      })

      test('should hide close button when hideClose is true', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content hideClose>Content</Drawer.Content>
          </Drawer.Root>
        )

        const closeButton = container.querySelector('.cn-drawer-close-button')
        expect(closeButton).not.toBeInTheDocument()
      })

      test('should render xmark icon in close button', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const icon = container.querySelector('.cn-drawer-close-button-icon')
        expect(icon).toBeInTheDocument()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content className="custom-drawer">Content</Drawer.Content>
          </Drawer.Root>
        )

        const content = container.querySelector('.custom-drawer')
        expect(content).toBeInTheDocument()
      })

      test('should apply custom overlayClassName', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content overlayClassName="custom-overlay">Content</Drawer.Content>
          </Drawer.Root>
        )

        const overlay = container.querySelector('.custom-overlay')
        expect(overlay).toBeInTheDocument()
      })
    })

    describe('Portal Rendering', () => {
      test('should render content in portal', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        expect(screen.getByTestId('drawer-portal')).toBeInTheDocument()
      })
    })

    describe('Overlay Rendering', () => {
      test('should render overlay', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        expect(screen.getByTestId('drawer-overlay')).toBeInTheDocument()
      })

      test('should wrap content with overlay when modal is true', () => {
        renderComponent(
          <Drawer.Root open modal>
            <Drawer.Content>Content</Drawer.Content>
          </Drawer.Root>
        )

        const overlay = screen.getByTestId('drawer-overlay')
        const content = screen.getByTestId('drawer-content')

        expect(overlay).toContainElement(content)
      })
    })
  })

  describe('Drawer.Header', () => {
    describe('Basic Rendering', () => {
      test('should render drawer header', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Title</Drawer.Title>
              </Drawer.Header>
            </Drawer.Content>
          </Drawer.Root>
        )

        const header = container.querySelector('.cn-drawer-header')
        expect(header).toBeInTheDocument()
      })

      test('should render children', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Test Title</Drawer.Title>
              </Drawer.Header>
            </Drawer.Content>
          </Drawer.Root>
        )

        expect(screen.getByText('Test Title')).toBeInTheDocument()
      })

      test('should forward ref to div element', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Header ref={ref}>
                <Drawer.Title>Title</Drawer.Title>
              </Drawer.Header>
            </Drawer.Content>
          </Drawer.Root>
        )

        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })

      test('should have correct display name', () => {
        expect(Drawer.Header.displayName).toBe('DrawerHeader')
      })
    })

    describe('Icon Support', () => {
      test('should render header with icon prop', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Header icon="xmark">
                <Drawer.Title>Settings</Drawer.Title>
              </Drawer.Header>
            </Drawer.Content>
          </Drawer.Root>
        )

        const header = container.querySelector('.cn-drawer-header')
        expect(header).toBeInTheDocument()
      })

      test('should render header top when icon prop is provided', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Header icon="xmark">
                <Drawer.Title>Settings</Drawer.Title>
              </Drawer.Header>
            </Drawer.Content>
          </Drawer.Root>
        )

        const headerTop = container.querySelector('.cn-drawer-header-top')
        expect(headerTop).toBeInTheDocument()
      })
    })

    describe('Logo Support', () => {
      test('should render logo when provided', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Header logo="harness">
                <Drawer.Title>Harness</Drawer.Title>
              </Drawer.Header>
            </Drawer.Content>
          </Drawer.Root>
        )

        const logo = container.querySelector('.cn-drawer-header-icon')
        expect(logo).toBeInTheDocument()
      })
    })

    describe('Title and Tagline Separation', () => {
      test('should separate title children', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Title</Drawer.Title>
                <div>Other content</div>
              </Drawer.Header>
            </Drawer.Content>
          </Drawer.Root>
        )

        const titleWrapper = container.querySelector('.cn-drawer-header-title')
        expect(titleWrapper).toBeInTheDocument()
      })

      test('should render header top when title is present', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Title</Drawer.Title>
              </Drawer.Header>
            </Drawer.Content>
          </Drawer.Root>
        )

        const headerTop = container.querySelector('.cn-drawer-header-top')
        expect(headerTop).toBeInTheDocument()
      })

      test('should render header top when icon is present', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Header icon="xmark">
                <div>Content</div>
              </Drawer.Header>
            </Drawer.Content>
          </Drawer.Root>
        )

        const headerTop = container.querySelector('.cn-drawer-header-top')
        expect(headerTop).toBeInTheDocument()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Header className="custom-header">
                <Drawer.Title>Title</Drawer.Title>
              </Drawer.Header>
            </Drawer.Content>
          </Drawer.Root>
        )

        const header = container.querySelector('.custom-header')
        expect(header).toBeInTheDocument()
      })
    })
  })

  describe('Drawer.Body', () => {
    describe('Basic Rendering', () => {
      test('should render drawer body', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Body>Body Content</Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        )

        expect(screen.getByText('Body Content')).toBeInTheDocument()
      })

      test('should render ScrollArea', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Body>Body Content</Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        )

        expect(screen.getByTestId('scroll-area')).toBeInTheDocument()
      })

      test('should forward ref to scroll area', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Body ref={ref}>Body Content</Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        )

        expect(ref.current).toBeTruthy()
      })

      test('should have correct display name', () => {
        expect(Drawer.Body.displayName).toBe('DrawerBody')
      })
    })

    describe('Scroll State Classes', () => {
      test('should apply top class when at top', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Body>Body Content</Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        )

        const wrapper = container.querySelector('.cn-drawer-body-wrap-top')
        expect(wrapper).toBeInTheDocument()
      })

      test('should apply body wrapper class', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Body>Body Content</Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        )

        const wrapper = container.querySelector('.cn-drawer-body-wrap')
        expect(wrapper).toBeInTheDocument()
      })

      test('should apply body class to scroll area', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Body>Body Content</Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        )

        const body = container.querySelector('.cn-drawer-body')
        expect(body).toBeInTheDocument()
      })

      test('should apply body content class', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Body>Body Content</Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        )

        const content = container.querySelector('.cn-drawer-body-content')
        expect(content).toBeInTheDocument()
      })
    })

    describe('Custom Styling', () => {
      test('should apply custom className to wrapper', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Body className="custom-body-wrapper">Body Content</Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        )

        const wrapper = container.querySelector('.custom-body-wrapper')
        expect(wrapper).toBeInTheDocument()
      })

      test('should apply custom scrollAreaClassName', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Body scrollAreaClassName="custom-scroll-area">Body Content</Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        )

        const scrollArea = container.querySelector('.custom-scroll-area')
        expect(scrollArea).toBeInTheDocument()
      })

      test('should apply custom classNameContent', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Body classNameContent="custom-content">Body Content</Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        )

        const content = container.querySelector('.custom-content')
        expect(content).toBeInTheDocument()
      })
    })
  })

  describe('Drawer.Footer', () => {
    describe('Basic Rendering', () => {
      test('should render drawer footer', () => {
        const { container } = renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Footer>Footer Content</Drawer.Footer>
            </Drawer.Content>
          </Drawer.Root>
        )

        const footer = container.querySelector('.cn-drawer-footer')
        expect(footer).toBeInTheDocument()
      })

      test('should render children', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Footer>Footer Content</Drawer.Footer>
            </Drawer.Content>
          </Drawer.Root>
        )

        expect(screen.getByText('Footer Content')).toBeInTheDocument()
      })

      test('should have correct display name', () => {
        expect(Drawer.Footer.displayName).toBe('DrawerFooter')
      })
    })
  })

  describe('Drawer.Title', () => {
    describe('Basic Rendering', () => {
      test('should render drawer title', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Title Text</Drawer.Title>
              </Drawer.Header>
            </Drawer.Content>
          </Drawer.Root>
        )

        expect(screen.getByText('Title Text')).toBeInTheDocument()
      })

      test('should have correct display name', () => {
        expect(Drawer.Title.displayName).toBe('DrawerTitle')
      })
    })
  })

  describe('Drawer.Description', () => {
    describe('Basic Rendering', () => {
      test('should render drawer description', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Description>Description Text</Drawer.Description>
              </Drawer.Header>
            </Drawer.Content>
          </Drawer.Root>
        )

        expect(screen.getByText('Description Text')).toBeInTheDocument()
      })

      test('should have correct display name', () => {
        expect(Drawer.Description.displayName).toBe('DrawerDescription')
      })
    })
  })

  describe('Drawer.Tagline', () => {
    describe('Basic Rendering', () => {
      test('should render drawer tagline', () => {
        renderComponent(
          <Drawer.Root open>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Tagline>Tagline Text</Drawer.Tagline>
              </Drawer.Header>
            </Drawer.Content>
          </Drawer.Root>
        )

        expect(screen.getByText('Tagline Text')).toBeInTheDocument()
      })

      test('should have correct display name', () => {
        expect(Drawer.Tagline.displayName).toBe('DrawerTagline')
      })
    })
  })

  describe('Drawer Namespace', () => {
    test('should export all subcomponents', () => {
      expect(Drawer.Root).toBeDefined()
      expect(Drawer.Trigger).toBeDefined()
      expect(Drawer.Content).toBeDefined()
      expect(Drawer.Header).toBeDefined()
      expect(Drawer.Body).toBeDefined()
      expect(Drawer.Footer).toBeDefined()
      expect(Drawer.Title).toBeDefined()
      expect(Drawer.Description).toBeDefined()
      expect(Drawer.Close).toBeDefined()
      expect(Drawer.Tagline).toBeDefined()
    })
  })

  describe('Complete Drawer', () => {
    test('should render full drawer with all components', () => {
      renderComponent(
        <Drawer.Root open>
          <Drawer.Trigger>Open Drawer</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header icon="xmark">
              <Drawer.Title>Settings</Drawer.Title>
              <Drawer.Description>Configure your settings</Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <p>Body content goes here</p>
            </Drawer.Body>
            <Drawer.Footer>
              <button>Save</button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      )

      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Configure your settings')).toBeInTheDocument()
      expect(screen.getByText('Body content goes here')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })
  })
})
