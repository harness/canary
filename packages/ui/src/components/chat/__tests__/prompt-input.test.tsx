import { type CSSProperties } from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import promptInputStyles from '../../../../tailwind-utils-config/components/prompt-input'
import { PromptInput } from '../prompt-input'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
)

const LONG_PROMPT = Array.from({ length: 40 }, (_, i) => `Line ${i + 1}: ${'prompt '.repeat(8)}`).join('\n')

const composerStyles = promptInputStyles['.cn-prompt-input'] as {
  minHeight: string
  maxHeight: string
  display: string
  flexDirection: string
  '.cn-control-group': CSSProperties & { minHeight: string; overflow: string; flex: string }
  '.cn-control-group-input': CSSProperties & { minHeight: string; overflow: string }
  '.cn-textarea': CSSProperties & { maxHeight: string; overflowY: string; minHeight: string }
}

const renderComposer = ({
  value = '',
  tags,
  onSubmit,
  onRemoveTag,
  streaming
}: {
  value?: string
  tags?: Array<{ id: string; displayName: string }>
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  onRemoveTag?: (id: string) => void
  streaming?: boolean
} = {}) => {
  const handleSubmit = onSubmit ?? ((e: React.FormEvent<HTMLFormElement>) => e.preventDefault())

  return render(
    <TestWrapper>
      <PromptInput.Root onSubmit={handleSubmit}>
        {tags ? <PromptInput.Tags tags={tags} onRemove={onRemoveTag} /> : null}
        <PromptInput.Textarea value={value} onChange={vi.fn()} />
        <PromptInput.Toolbar>
          <PromptInput.Tools>
            <PromptInput.Button prefixIcon="plus" tooltipProps={{ content: 'Add' }} />
          </PromptInput.Tools>
          <PromptInput.Submit status={streaming ? 'streaming' : undefined} />
        </PromptInput.Toolbar>
      </PromptInput.Root>
    </TestWrapper>
  )
}

describe('PromptInput styles (AIPLAT-1268 regression)', () => {
  test('composer is a capped column so it cannot grow past the design-token max height', () => {
    expect(composerStyles.display).toBe('flex')
    expect(composerStyles.flexDirection).toBe('column')
    expect(composerStyles.minHeight).toBe('var(--cn-input-ai-min-height)')
    expect(composerStyles.maxHeight).toBe('var(--cn-input-ai-max-height)')
  })

  test('textarea itself is height-capped and scrolls — not the form clipping the toolbar', () => {
    expect(composerStyles['.cn-textarea'].maxHeight).toBe('var(--cn-size-64)')
    expect(composerStyles['.cn-textarea'].overflowY).toBe('auto')
    expect(composerStyles['.cn-textarea'].minHeight).toBe('var(--cn-size-10)')
  })

  test('textarea max-height is a definite token, not 100% of an auto-sized parent', () => {
    expect(composerStyles['.cn-textarea'].maxHeight).not.toMatch(/100%/)
    expect(composerStyles['.cn-textarea'].maxHeight).toBeTruthy()
  })

  test('control group shrinks inside the composer cap so tags and toolbar stay visible', () => {
    expect(composerStyles['.cn-control-group'].minHeight).toBe('0')
    expect(composerStyles['.cn-control-group'].overflow).toBe('hidden')
    expect(composerStyles['.cn-control-group'].flex).toBe('1 1 auto')

    expect(composerStyles['.cn-control-group-input'].minHeight).toBe('0')
    expect(composerStyles['.cn-control-group-input'].overflow).toBe('hidden')
  })
})

describe('PromptInput', () => {
  describe('layout contract — long prompt must not push actions off the composer', () => {
    test('root uses overflow-hidden with the prompt-input class', () => {
      const { container } = renderComposer()
      const form = container.querySelector('form')

      expect(form).toHaveClass('cn-prompt-input', 'w-full', 'overflow-hidden')
    })

    test('toolbar is a non-shrinking sibling after the textarea', () => {
      const { container } = renderComposer({ value: LONG_PROMPT })
      const form = container.querySelector('form')!
      const textarea = screen.getByRole('textbox')
      const toolbar = container.querySelector('.justify-between')

      expect(toolbar).toHaveClass('flex', 'shrink-0', 'items-center', 'justify-between')
      expect(form.contains(toolbar)).toBe(true)

      const position = textarea.compareDocumentPosition(toolbar as Node)
      expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    test('textarea wrapper shrinks instead of expanding the composer', () => {
      renderComposer({ value: LONG_PROMPT })

      const controlGroup = screen.getByRole('group', { name: 'Input control group' })
      expect(controlGroup).toHaveClass('min-h-0', 'flex-1', 'overflow-hidden')
    })

    test('auto-resize stays enabled so short prompts still grow, then cap via CSS max-height', () => {
      renderComposer({ value: LONG_PROMPT })

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('field-sizing-content')
      expect(textarea).toHaveValue(LONG_PROMPT)
    })

    test('tags stay shrink-0 so they cannot steal scroll from the field', () => {
      const { container } = renderComposer({
        value: LONG_PROMPT,
        tags: [
          { id: 'pipeline', displayName: 'pipeline.yaml' },
          { id: 'svc', displayName: 'checkout-service' }
        ]
      })

      expect(screen.getByText('pipeline.yaml')).toBeInTheDocument()
      expect(screen.getByText('checkout-service')).toBeInTheDocument()

      const tagsRow = container.querySelector('.flex-wrap')
      expect(tagsRow).toHaveClass('flex', 'shrink-0', 'flex-wrap')
    })

    test('send and plus stay in the toolbar with a long prompt', () => {
      renderComposer({ value: LONG_PROMPT })

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)

      const toolbar = buttons[0].closest('.justify-between')
      buttons.forEach(button => {
        expect(toolbar?.contains(button)).toBe(true)
      })
    })
  })

  describe('Root', () => {
    test('renders a form that forwards className and submit handler', async () => {
      const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault())
      const { container } = render(
        <TestWrapper>
          <PromptInput.Root className="custom-root" onSubmit={onSubmit}>
            <PromptInput.Textarea />
            <PromptInput.Toolbar>
              <PromptInput.Submit />
            </PromptInput.Toolbar>
          </PromptInput.Root>
        </TestWrapper>
      )

      expect(container.querySelector('form')).toHaveClass('cn-prompt-input', 'custom-root')

      await userEvent.click(screen.getByRole('button'))
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
  })

  describe('Textarea', () => {
    test('uses the default placeholder', () => {
      renderComposer()
      expect(screen.getByPlaceholderText('What would you like to know?')).toBeInTheDocument()
    })

    test('forwards name="message" for form serialization', () => {
      renderComposer({ value: 'hello' })
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'message')
    })

    test('submits on Enter without Shift', async () => {
      const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault())
      renderComposer({ onSubmit })

      const textarea = screen.getByRole('textbox')
      textarea.focus()
      await userEvent.keyboard('{Enter}')

      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    test('does not submit on Shift+Enter so newlines still work', async () => {
      const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault())
      renderComposer({ onSubmit })

      const textarea = screen.getByRole('textbox')
      textarea.focus()
      await userEvent.keyboard('{Shift>}{Enter}{/Shift}')

      expect(onSubmit).not.toHaveBeenCalled()
    })

    test('calls onChange when the user types', async () => {
      const onChange = vi.fn()
      render(
        <TestWrapper>
          <PromptInput.Root onSubmit={e => e.preventDefault()}>
            <PromptInput.Textarea onChange={onChange} />
          </PromptInput.Root>
        </TestWrapper>
      )

      await userEvent.type(screen.getByRole('textbox'), 'Hi')
      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('Tags', () => {
    test('renders nothing when the tag list is empty', () => {
      const { container } = render(
        <TestWrapper>
          <PromptInput.Tags tags={[]} />
        </TestWrapper>
      )

      expect(container).toBeEmptyDOMElement()
    })

    test('calls onRemove when a tag action is clicked', async () => {
      const onRemove = vi.fn()
      const { container } = renderComposer({
        tags: [{ id: 'ctx-1', displayName: 'My context' }],
        onRemoveTag: onRemove
      })

      const tagRemove = container.querySelector('.cn-tag-action-icon-button')
      expect(tagRemove).toBeTruthy()
      await userEvent.click(tagRemove!)
      expect(onRemove).toHaveBeenCalledWith('ctx-1')
    })
  })

  describe('Submit', () => {
    test('renders a rounded icon-only submit button', () => {
      renderComposer()

      const submit = screen.getAllByRole('button').at(-1)
      expect(submit).toHaveAttribute('type', 'submit')
      expect(submit).toHaveClass('cn-button')
    })

    test('shows stop icon while streaming and arrow icon when idle', () => {
      const { container, rerender } = render(
        <TestWrapper>
          <PromptInput.Submit />
        </TestWrapper>
      )
      const idleMarkup = container.innerHTML

      rerender(
        <TestWrapper>
          <PromptInput.Submit status="streaming" />
        </TestWrapper>
      )

      expect(container.innerHTML).not.toBe(idleMarkup)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })
  })

  describe('Tools and Button', () => {
    test('tools cluster action buttons with gap', () => {
      const { container } = renderComposer()
      const tools = container.querySelector('.flex.items-center.gap-cn-xs')
      expect(tools).toBeTruthy()
      expect(tools).toHaveClass('flex', 'items-center', 'gap-cn-xs')
      expect(tools?.querySelector('button')).toBeTruthy()
    })
  })
})
