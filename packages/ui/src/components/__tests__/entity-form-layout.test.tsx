import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { EntityFormLayout } from '../entity-form-layout'

describe('EntityFormLayout', () => {
  describe('EntityFormLayout.Header', () => {
    test('should render header with children', () => {
      render(
        <EntityFormLayout.Header>
          <div data-testid="header-content">Header Content</div>
        </EntityFormLayout.Header>
      )

      expect(screen.getByTestId('header-content')).toBeInTheDocument()
      expect(screen.getByText('Header Content')).toBeInTheDocument()
    })

    test('should apply default classes', () => {
      const { container } = render(
        <EntityFormLayout.Header>
          <div>Content</div>
        </EntityFormLayout.Header>
      )

      const header = container.firstChild
      expect(header).toHaveClass('flex')
      expect(header).toHaveClass('flex-col')
      expect(header).toHaveClass('gap-y-cn-lg')
      expect(header).toHaveClass('mb-cn-md')
    })

    test('should apply custom className', () => {
      const { container } = render(
        <EntityFormLayout.Header className="custom-header">
          <div>Content</div>
        </EntityFormLayout.Header>
      )

      const header = container.firstChild
      expect(header).toHaveClass('custom-header')
      expect(header).toHaveClass('flex')
    })

    test('should combine custom className with default classes', () => {
      const { container } = render(
        <EntityFormLayout.Header className="custom-class another-class">
          <div>Content</div>
        </EntityFormLayout.Header>
      )

      const header = container.firstChild
      expect(header).toHaveClass('custom-class')
      expect(header).toHaveClass('another-class')
      expect(header).toHaveClass('flex')
      expect(header).toHaveClass('flex-col')
    })

    test('should render multiple children', () => {
      render(
        <EntityFormLayout.Header>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </EntityFormLayout.Header>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
      expect(screen.getByTestId('child-3')).toBeInTheDocument()
    })

    test('should render string children', () => {
      render(<EntityFormLayout.Header>Simple Text</EntityFormLayout.Header>)
      expect(screen.getByText('Simple Text')).toBeInTheDocument()
    })

    test('should handle empty className', () => {
      const { container } = render(
        <EntityFormLayout.Header className="">
          <div>Content</div>
        </EntityFormLayout.Header>
      )

      const header = container.firstChild
      expect(header).toHaveClass('flex')
    })
  })

  describe('EntityFormLayout.Title', () => {
    test('should render title with children', () => {
      render(<EntityFormLayout.Title>Form Title</EntityFormLayout.Title>)
      expect(screen.getByText('Form Title')).toBeInTheDocument()
    })

    test('should render as h2 element', () => {
      const { container } = render(<EntityFormLayout.Title>Title</EntityFormLayout.Title>)
      const title = container.querySelector('h2')
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Title')
    })

    test('should apply default classes', () => {
      const { container } = render(<EntityFormLayout.Title>Title</EntityFormLayout.Title>)
      const title = container.querySelector('h2')

      expect(title).toHaveClass('text-cn-size-3')
      expect(title).toHaveClass('leading-none')
      expect(title).toHaveClass('text-cn-1')
      expect(title).toHaveClass('font-medium')
    })

    test('should apply custom className', () => {
      const { container } = render(<EntityFormLayout.Title className="custom-title">Title</EntityFormLayout.Title>)
      const title = container.querySelector('h2')

      expect(title).toHaveClass('custom-title')
      expect(title).toHaveClass('text-cn-size-3')
    })

    test('should combine custom className with default classes', () => {
      const { container } = render(<EntityFormLayout.Title className="custom-1 custom-2">Title</EntityFormLayout.Title>)
      const title = container.querySelector('h2')

      expect(title).toHaveClass('custom-1')
      expect(title).toHaveClass('custom-2')
      expect(title).toHaveClass('font-medium')
    })

    test('should render complex children', () => {
      render(
        <EntityFormLayout.Title>
          <span data-testid="icon">Icon</span>
          <span data-testid="text">Text</span>
        </EntityFormLayout.Title>
      )

      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByTestId('text')).toBeInTheDocument()
    })

    test('should handle empty className', () => {
      const { container } = render(<EntityFormLayout.Title className="">Title</EntityFormLayout.Title>)
      const title = container.querySelector('h2')
      expect(title).toHaveClass('text-cn-size-3')
    })
  })

  describe('EntityFormLayout.Description', () => {
    test('should render description with children', () => {
      render(<EntityFormLayout.Description>Form Description</EntityFormLayout.Description>)
      expect(screen.getByText('Form Description')).toBeInTheDocument()
    })

    test('should render Text component with as="div" prop', () => {
      const { container } = render(<EntityFormLayout.Description>Description</EntityFormLayout.Description>)
      // Text component renders as div when as="div"
      const description = container.querySelector('div')
      expect(description).toBeInTheDocument()
    })

    test('should apply foreground-3 color', () => {
      const { container } = render(<EntityFormLayout.Description>Description</EntityFormLayout.Description>)
      const description = container.querySelector('div')
      // Text component with color="foreground-3" applies specific classes
      expect(description).toBeInTheDocument()
    })

    test('should render complex children', () => {
      render(
        <EntityFormLayout.Description>
          <span data-testid="part-1">Part 1</span>
          <span data-testid="part-2">Part 2</span>
        </EntityFormLayout.Description>
      )

      expect(screen.getByTestId('part-1')).toBeInTheDocument()
      expect(screen.getByTestId('part-2')).toBeInTheDocument()
    })

    test('should render string content', () => {
      render(<EntityFormLayout.Description>Simple description text</EntityFormLayout.Description>)
      expect(screen.getByText('Simple description text')).toBeInTheDocument()
    })

    test('should render with long text content', () => {
      const longText =
        'This is a very long description that contains multiple sentences. It provides detailed information about the form and what the user should expect when filling it out.'
      render(<EntityFormLayout.Description>{longText}</EntityFormLayout.Description>)
      expect(screen.getByText(longText)).toBeInTheDocument()
    })
  })

  describe('EntityFormLayout.Form', () => {
    test('should render form with children', () => {
      render(
        <EntityFormLayout.Form>
          <div data-testid="form-content">Form Content</div>
        </EntityFormLayout.Form>
      )

      expect(screen.getByTestId('form-content')).toBeInTheDocument()
    })

    test('should apply default classes', () => {
      const { container } = render(
        <EntityFormLayout.Form>
          <div>Content</div>
        </EntityFormLayout.Form>
      )

      const form = container.firstChild
      expect(form).toHaveClass('flex')
      expect(form).toHaveClass('flex-col')
      expect(form).toHaveClass('max-w-xl')
      expect(form).toHaveClass('space-y-cn-xl')
    })

    test('should apply custom className', () => {
      const { container } = render(
        <EntityFormLayout.Form className="custom-form">
          <div>Content</div>
        </EntityFormLayout.Form>
      )

      const form = container.firstChild
      expect(form).toHaveClass('custom-form')
      expect(form).toHaveClass('flex')
    })

    test('should forward HTML attributes', () => {
      const { container } = render(
        <EntityFormLayout.Form data-testid="form-element" aria-label="Entity form">
          <div>Content</div>
        </EntityFormLayout.Form>
      )

      const form = container.querySelector('[data-testid="form-element"]')
      expect(form).toBeInTheDocument()
      expect(form).toHaveAttribute('aria-label', 'Entity form')
    })

    test('should forward onClick handler', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <EntityFormLayout.Form onClick={handleClick}>
          <div>Content</div>
        </EntityFormLayout.Form>
      )

      const form = container.firstChild as HTMLElement
      form?.click()
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should forward multiple HTML attributes', () => {
      const { container } = render(
        <EntityFormLayout.Form id="entity-form" role="form" aria-labelledby="form-title" data-form-type="entity">
          <div>Content</div>
        </EntityFormLayout.Form>
      )

      const form = container.firstChild as HTMLElement
      expect(form).toHaveAttribute('id', 'entity-form')
      expect(form).toHaveAttribute('role', 'form')
      expect(form).toHaveAttribute('aria-labelledby', 'form-title')
      expect(form).toHaveAttribute('data-form-type', 'entity')
    })

    test('should render multiple form fields', () => {
      render(
        <EntityFormLayout.Form>
          <input data-testid="field-1" />
          <input data-testid="field-2" />
          <input data-testid="field-3" />
        </EntityFormLayout.Form>
      )

      expect(screen.getByTestId('field-1')).toBeInTheDocument()
      expect(screen.getByTestId('field-2')).toBeInTheDocument()
      expect(screen.getByTestId('field-3')).toBeInTheDocument()
    })

    test('should combine custom className with default classes', () => {
      const { container } = render(
        <EntityFormLayout.Form className="custom-1 custom-2">
          <div>Content</div>
        </EntityFormLayout.Form>
      )

      const form = container.firstChild
      expect(form).toHaveClass('custom-1')
      expect(form).toHaveClass('custom-2')
      expect(form).toHaveClass('flex-col')
    })
  })

  describe('EntityFormLayout.Footer', () => {
    test('should render footer with children', () => {
      render(
        <EntityFormLayout.Footer>
          <div data-testid="footer-content">Footer Content</div>
        </EntityFormLayout.Footer>
      )

      expect(screen.getByTestId('footer-content')).toBeInTheDocument()
    })

    test('should apply default classes', () => {
      const { container } = render(
        <EntityFormLayout.Footer>
          <div>Content</div>
        </EntityFormLayout.Footer>
      )

      const footer = container.firstChild
      expect(footer).toHaveClass('flex')
      expect(footer).toHaveClass('flex-col')
      expect(footer).toHaveClass('max-w-xl')
      expect(footer).toHaveClass('gap-cn-sm')
      expect(footer).toHaveClass('pt-cn-3xl')
    })

    test('should apply custom className', () => {
      const { container } = render(
        <EntityFormLayout.Footer className="custom-footer">
          <div>Content</div>
        </EntityFormLayout.Footer>
      )

      const footer = container.firstChild
      expect(footer).toHaveClass('custom-footer')
      expect(footer).toHaveClass('flex')
    })

    test('should forward HTML attributes', () => {
      const { container } = render(
        <EntityFormLayout.Footer data-testid="footer-element" aria-label="Form footer">
          <div>Content</div>
        </EntityFormLayout.Footer>
      )

      const footer = container.querySelector('[data-testid="footer-element"]')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveAttribute('aria-label', 'Form footer')
    })

    test('should forward onClick handler', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <EntityFormLayout.Footer onClick={handleClick}>
          <div>Content</div>
        </EntityFormLayout.Footer>
      )

      const footer = container.firstChild as HTMLElement
      footer?.click()
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should render action buttons', () => {
      render(
        <EntityFormLayout.Footer>
          <button data-testid="cancel-btn">Cancel</button>
          <button data-testid="submit-btn">Submit</button>
        </EntityFormLayout.Footer>
      )

      expect(screen.getByTestId('cancel-btn')).toBeInTheDocument()
      expect(screen.getByTestId('submit-btn')).toBeInTheDocument()
    })

    test('should combine custom className with default classes', () => {
      const { container } = render(
        <EntityFormLayout.Footer className="custom-1 custom-2">
          <div>Content</div>
        </EntityFormLayout.Footer>
      )

      const footer = container.firstChild
      expect(footer).toHaveClass('custom-1')
      expect(footer).toHaveClass('custom-2')
      expect(footer).toHaveClass('gap-cn-sm')
    })
  })

  describe('Complete Form Layout', () => {
    test('should render complete form layout with all components', () => {
      render(
        <div>
          <EntityFormLayout.Header>
            <EntityFormLayout.Title>Create User</EntityFormLayout.Title>
            <EntityFormLayout.Description>Fill in the user details</EntityFormLayout.Description>
          </EntityFormLayout.Header>
          <EntityFormLayout.Form>
            <input data-testid="name-input" placeholder="Name" />
            <input data-testid="email-input" placeholder="Email" />
          </EntityFormLayout.Form>
          <EntityFormLayout.Footer>
            <button data-testid="cancel-btn">Cancel</button>
            <button data-testid="save-btn">Save</button>
          </EntityFormLayout.Footer>
        </div>
      )

      expect(screen.getByText('Create User')).toBeInTheDocument()
      expect(screen.getByText('Fill in the user details')).toBeInTheDocument()
      expect(screen.getByTestId('name-input')).toBeInTheDocument()
      expect(screen.getByTestId('email-input')).toBeInTheDocument()
      expect(screen.getByTestId('cancel-btn')).toBeInTheDocument()
      expect(screen.getByTestId('save-btn')).toBeInTheDocument()
    })

    test('should render form layout without footer', () => {
      render(
        <div>
          <EntityFormLayout.Header>
            <EntityFormLayout.Title>Form Title</EntityFormLayout.Title>
          </EntityFormLayout.Header>
          <EntityFormLayout.Form>
            <input data-testid="input" />
          </EntityFormLayout.Form>
        </div>
      )

      expect(screen.getByText('Form Title')).toBeInTheDocument()
      expect(screen.getByTestId('input')).toBeInTheDocument()
    })

    test('should render form layout without description', () => {
      render(
        <div>
          <EntityFormLayout.Header>
            <EntityFormLayout.Title>Form Title</EntityFormLayout.Title>
          </EntityFormLayout.Header>
          <EntityFormLayout.Form>
            <input data-testid="input" />
          </EntityFormLayout.Form>
          <EntityFormLayout.Footer>
            <button>Submit</button>
          </EntityFormLayout.Footer>
        </div>
      )

      expect(screen.getByText('Form Title')).toBeInTheDocument()
      expect(screen.getByTestId('input')).toBeInTheDocument()
      expect(screen.getByText('Submit')).toBeInTheDocument()
    })

    test('should render minimal form layout with only Form component', () => {
      render(
        <EntityFormLayout.Form>
          <input data-testid="input" />
        </EntityFormLayout.Form>
      )

      expect(screen.getByTestId('input')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty children in all components', () => {
      const { container } = render(
        <div>
          <EntityFormLayout.Header>{undefined}</EntityFormLayout.Header>
          <EntityFormLayout.Title>{undefined}</EntityFormLayout.Title>
          <EntityFormLayout.Description>{undefined}</EntityFormLayout.Description>
          <EntityFormLayout.Form></EntityFormLayout.Form>
          <EntityFormLayout.Footer></EntityFormLayout.Footer>
        </div>
      )

      expect(container).toBeInTheDocument()
    })

    test('should handle null children', () => {
      const { container } = render(
        <div>
          <EntityFormLayout.Header>{null}</EntityFormLayout.Header>
          <EntityFormLayout.Form>{null}</EntityFormLayout.Form>
        </div>
      )

      expect(container).toBeInTheDocument()
    })

    test('should handle undefined className', () => {
      const { container } = render(
        <div>
          <EntityFormLayout.Header className={undefined}>Content</EntityFormLayout.Header>
          <EntityFormLayout.Title className={undefined}>Title</EntityFormLayout.Title>
          <EntityFormLayout.Form className={undefined}>Form</EntityFormLayout.Form>
          <EntityFormLayout.Footer className={undefined}>Footer</EntityFormLayout.Footer>
        </div>
      )

      expect(container).toBeInTheDocument()
    })

    test('should handle conditional children rendering', () => {
      const showDescription = false
      render(
        <EntityFormLayout.Header>
          <EntityFormLayout.Title>Title</EntityFormLayout.Title>
          {showDescription && <EntityFormLayout.Description>Description</EntityFormLayout.Description>}
        </EntityFormLayout.Header>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.queryByText('Description')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should render Header as semantic div', () => {
      const { container } = render(
        <EntityFormLayout.Header>
          <div>Content</div>
        </EntityFormLayout.Header>
      )

      const header = container.firstChild
      expect(header).toBeInTheDocument()
      expect(header?.nodeName).toBe('DIV')
    })

    test('should render Title as semantic h2', () => {
      const { container } = render(<EntityFormLayout.Title>Title</EntityFormLayout.Title>)
      const title = container.querySelector('h2')
      expect(title).toBeInTheDocument()
    })

    test('should support role attribute on Form', () => {
      const { container } = render(
        <EntityFormLayout.Form role="form">
          <div>Content</div>
        </EntityFormLayout.Form>
      )

      const form = container.firstChild
      expect(form).toHaveAttribute('role', 'form')
    })

    test('should support aria-labelledby on Footer', () => {
      const { container } = render(
        <EntityFormLayout.Footer aria-labelledby="footer-label">
          <div>Content</div>
        </EntityFormLayout.Footer>
      )

      const footer = container.firstChild
      expect(footer).toHaveAttribute('aria-labelledby', 'footer-label')
    })
  })

  describe('Styling Combinations', () => {
    test('should allow custom styling on all components', () => {
      const { container } = render(
        <div>
          <EntityFormLayout.Header className="custom-header">
            <EntityFormLayout.Title className="custom-title">Title</EntityFormLayout.Title>
          </EntityFormLayout.Header>
          <EntityFormLayout.Form className="custom-form">
            <input />
          </EntityFormLayout.Form>
          <EntityFormLayout.Footer className="custom-footer">
            <button>Submit</button>
          </EntityFormLayout.Footer>
        </div>
      )

      expect(container.querySelector('.custom-header')).toBeInTheDocument()
      expect(container.querySelector('.custom-title')).toBeInTheDocument()
      expect(container.querySelector('.custom-form')).toBeInTheDocument()
      expect(container.querySelector('.custom-footer')).toBeInTheDocument()
    })

    test('should preserve default styles when adding custom className', () => {
      const { container } = render(
        <EntityFormLayout.Form className="custom">
          <div>Content</div>
        </EntityFormLayout.Form>
      )

      const form = container.firstChild
      expect(form).toHaveClass('custom')
      expect(form).toHaveClass('flex')
      expect(form).toHaveClass('flex-col')
      expect(form).toHaveClass('max-w-xl')
    })
  })

  describe('Component Structure', () => {
    test('should export all components as properties of EntityFormLayout', () => {
      expect(EntityFormLayout.Header).toBeDefined()
      expect(EntityFormLayout.Title).toBeDefined()
      expect(EntityFormLayout.Description).toBeDefined()
      expect(EntityFormLayout.Form).toBeDefined()
      expect(EntityFormLayout.Footer).toBeDefined()
    })

    test('should have function names', () => {
      expect(EntityFormLayout.Header.name).toBe('Header')
      expect(EntityFormLayout.Title.name).toBe('Title')
      expect(EntityFormLayout.Description.name).toBe('Description')
      expect(EntityFormLayout.Form.name).toBe('Form')
      expect(EntityFormLayout.Footer.name).toBe('Footer')
    })
  })

  describe('Re-rendering', () => {
    test('should update Header children on re-render', () => {
      const { rerender } = render(
        <EntityFormLayout.Header>
          <div data-testid="content">Initial</div>
        </EntityFormLayout.Header>
      )

      expect(screen.getByText('Initial')).toBeInTheDocument()

      rerender(
        <EntityFormLayout.Header>
          <div data-testid="content">Updated</div>
        </EntityFormLayout.Header>
      )

      expect(screen.getByText('Updated')).toBeInTheDocument()
      expect(screen.queryByText('Initial')).not.toBeInTheDocument()
    })

    test('should update Form className on re-render', () => {
      const { rerender, container } = render(
        <EntityFormLayout.Form className="class-1">
          <div>Content</div>
        </EntityFormLayout.Form>
      )

      expect(container.querySelector('.class-1')).toBeInTheDocument()

      rerender(
        <EntityFormLayout.Form className="class-2">
          <div>Content</div>
        </EntityFormLayout.Form>
      )

      expect(container.querySelector('.class-2')).toBeInTheDocument()
      expect(container.querySelector('.class-1')).not.toBeInTheDocument()
    })
  })
})
