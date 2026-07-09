import { useState } from 'react'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { CheckboxTree } from '../checkbox-tree'

// Mock IconV2 so the rendered icon name is queryable in the DOM.
vi.mock('../icon-v2', async importOriginal => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    IconV2: ({ name }: { name: string }) => <svg data-icon={name} />
  }
})

/**
 * Controlled wrapper mirroring how consumers drive the tree. Exposes the latest
 * selection through `onChange` so tests can assert on emitted ids.
 */
const Harness = ({
  onChange,
  initialSelected = [],
  ...rootProps
}: {
  onChange?: (ids: string[]) => void
  initialSelected?: string[]
} & Partial<React.ComponentProps<typeof CheckboxTree.Root>>) => {
  const [selected, setSelected] = useState<string[]>(initialSelected)

  return (
    <CheckboxTree.Root
      selectedIds={selected}
      onSelectionChange={ids => {
        setSelected(ids)
        onChange?.(ids)
      }}
      defaultExpandedIds={['resources', 'pipelines']}
      showSelectAll
      {...rootProps}
    >
      <CheckboxTree.Group id="resources" label="Resources">
        <CheckboxTree.Group id="pipelines" label="Pipelines">
          <CheckboxTree.Item id="audit" label="Audit logs" />
          <CheckboxTree.Item id="roles" label="Roles" />
        </CheckboxTree.Group>
      </CheckboxTree.Group>
    </CheckboxTree.Root>
  )
}

const getCheckbox = (name: string) => screen.getByRole('checkbox', { name })

describe('CheckboxTree', () => {
  describe('Rendering', () => {
    test('renders Select All, groups (with count) and leaf items', () => {
      render(<Harness />)

      expect(getCheckbox('Select All')).toBeInTheDocument()
      expect(screen.getByText('Resources')).toBeInTheDocument()
      expect(screen.getByText('Audit logs')).toBeInTheDocument()
      expect(screen.getByText('Roles')).toBeInTheDocument()
    })

    test('derives group count from leaf descendants when showCount is set', () => {
      render(
        <CheckboxTree.Root selectedIds={[]} onSelectionChange={() => {}} defaultExpandedIds={['resources']} showCount>
          <CheckboxTree.Group id="resources" label="Resources">
            <CheckboxTree.Item id="a" label="A" />
            <CheckboxTree.Item id="b" label="B" />
            <CheckboxTree.Item id="c" label="C" />
          </CheckboxTree.Group>
        </CheckboxTree.Root>
      )

      // 3 leaves beneath Resources -> "(3)" rendered automatically.
      expect(screen.getByText('(3)')).toBeInTheDocument()
    })

    test('does not render count by default (showCount off)', () => {
      render(
        <CheckboxTree.Root selectedIds={[]} onSelectionChange={() => {}} defaultExpandedIds={['resources']}>
          <CheckboxTree.Group id="resources" label="Resources">
            <CheckboxTree.Item id="a" label="A" />
            <CheckboxTree.Item id="b" label="B" />
          </CheckboxTree.Group>
        </CheckboxTree.Root>
      )

      expect(screen.queryByText('(2)')).not.toBeInTheDocument()
    })

    test('renders the folder icon on groups by default', () => {
      render(
        <CheckboxTree.Root selectedIds={[]} onSelectionChange={() => {}} defaultExpandedIds={['resources']}>
          <CheckboxTree.Group id="resources" label="Resources">
            <CheckboxTree.Item id="a" label="A" />
          </CheckboxTree.Group>
        </CheckboxTree.Root>
      )

      expect(document.querySelector('[data-icon="folder"]')).toBeInTheDocument()
    })

    test('renders a custom group icon when the icon prop is set', () => {
      render(
        <CheckboxTree.Root selectedIds={[]} onSelectionChange={() => {}} defaultExpandedIds={['infra']}>
          <CheckboxTree.Group id="infra" label="Infrastructure" icon="cloud">
            <CheckboxTree.Item id="a" label="A" />
          </CheckboxTree.Group>
        </CheckboxTree.Root>
      )

      expect(document.querySelector('[data-icon="cloud"]')).toBeInTheDocument()
      expect(document.querySelector('[data-icon="folder"]')).not.toBeInTheDocument()
    })

    test('Root throws when Group is used outside of it', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => render(<CheckboxTree.Group id="x" label="X" />)).toThrow()
      consoleError.mockRestore()
    })
  })

  describe('Leaf selection', () => {
    test('checking one leaf selects only itself and marks ancestors indeterminate', async () => {
      const onChange = vi.fn()
      render(<Harness onChange={onChange} />)

      await userEvent.click(getCheckbox('Audit logs'))

      expect(onChange).toHaveBeenLastCalledWith(['audit'])
      expect(getCheckbox('Audit logs')).toBeChecked()
      expect(getCheckbox('Roles')).not.toBeChecked()
      // Ancestors reflect partial selection
      expect(getCheckbox('Pipelines')).toHaveAttribute('data-state', 'indeterminate')
      expect(getCheckbox('Resources')).toHaveAttribute('data-state', 'indeterminate')
      expect(getCheckbox('Select All')).toHaveAttribute('data-state', 'indeterminate')
    })

    test('checking all leaves under a group marks the group checked', async () => {
      render(<Harness />)

      await userEvent.click(getCheckbox('Audit logs'))
      await userEvent.click(getCheckbox('Roles'))

      expect(getCheckbox('Pipelines')).toBeChecked()
      expect(getCheckbox('Resources')).toBeChecked()
      expect(getCheckbox('Select All')).toBeChecked()
    })
  })

  describe('Cascade', () => {
    test('checking a group selects all descendant leaves', async () => {
      const onChange = vi.fn()
      render(<Harness onChange={onChange} />)

      await userEvent.click(getCheckbox('Resources'))

      expect(onChange).toHaveBeenLastCalledWith(['audit', 'roles'])
      expect(getCheckbox('Audit logs')).toBeChecked()
      expect(getCheckbox('Roles')).toBeChecked()
    })

    test('unchecking a group clears all descendant leaves', async () => {
      const onChange = vi.fn()
      render(<Harness onChange={onChange} initialSelected={['audit', 'roles']} />)

      await userEvent.click(getCheckbox('Pipelines'))

      expect(onChange).toHaveBeenLastCalledWith([])
      expect(getCheckbox('Audit logs')).not.toBeChecked()
    })
  })

  describe('Select All', () => {
    test('checks every leaf when clicked', async () => {
      const onChange = vi.fn()
      render(<Harness onChange={onChange} />)

      await userEvent.click(getCheckbox('Select All'))

      expect(onChange).toHaveBeenLastCalledWith(['audit', 'roles'])
    })

    test('clears every leaf when all are selected', async () => {
      const onChange = vi.fn()
      render(<Harness onChange={onChange} initialSelected={['audit', 'roles']} />)

      expect(getCheckbox('Select All')).toBeChecked()
      await userEvent.click(getCheckbox('Select All'))

      expect(onChange).toHaveBeenLastCalledWith([])
    })
  })

  describe('Expand / collapse', () => {
    test('toggles visibility of nested content', async () => {
      const { container } = render(
        <CheckboxTree.Root selectedIds={[]} onSelectionChange={() => {}}>
          <CheckboxTree.Group id="resources" label="Resources">
            <CheckboxTree.Item id="audit" label="Audit logs" />
          </CheckboxTree.Group>
        </CheckboxTree.Root>
      )

      // Content stays mounted (forceMount) but is marked closed while collapsed.
      const content = container.querySelector('.cn-checkbox-tree-content')
      expect(content).toHaveAttribute('data-state', 'closed')

      await userEvent.click(screen.getByText('Resources'))
      expect(content).toHaveAttribute('data-state', 'open')
    })

    test('group keeps its checked state after being collapsed', async () => {
      render(<Harness initialSelected={['audit', 'roles']} />)

      // Fully selected -> group checked.
      expect(getCheckbox('Pipelines')).toBeChecked()

      // Collapse the Pipelines group; its descendants remain registered.
      await userEvent.click(screen.getByText('Pipelines'))

      // Regression: the group must still reflect the selection while collapsed.
      expect(getCheckbox('Pipelines')).toBeChecked()
      expect(getCheckbox('Resources')).toBeChecked()
      expect(getCheckbox('Select All')).toBeChecked()
    })
  })

  describe('Disabled', () => {
    test('disabled leaf cannot be toggled', async () => {
      const onChange = vi.fn()
      render(
        <CheckboxTree.Root selectedIds={[]} onSelectionChange={onChange} defaultExpandedIds={['resources']}>
          <CheckboxTree.Group id="resources" label="Resources">
            <CheckboxTree.Item id="audit" label="Audit logs" disabled />
          </CheckboxTree.Group>
        </CheckboxTree.Root>
      )

      await userEvent.click(getCheckbox('Audit logs'))
      expect(onChange).not.toHaveBeenCalled()
    })

    test('disabled root disables the whole tree', () => {
      render(
        <CheckboxTree.Root selectedIds={[]} onSelectionChange={() => {}} showSelectAll disabled>
          <CheckboxTree.Group id="resources" label="Resources">
            <CheckboxTree.Item id="audit" label="Audit logs" />
          </CheckboxTree.Group>
        </CheckboxTree.Root>
      )

      expect(getCheckbox('Select All')).toBeDisabled()
      expect(getCheckbox('Resources')).toBeDisabled()
    })

    test('disabled group trigger carries the disabled class hook so it renders a disabled cue', () => {
      const { container } = render(
        <CheckboxTree.Root selectedIds={[]} onSelectionChange={() => {}} defaultExpandedIds={['resources']}>
          <CheckboxTree.Group id="resources" label="Resources" disabled>
            <CheckboxTree.Item id="audit" label="Audit logs" />
          </CheckboxTree.Group>
        </CheckboxTree.Root>
      )

      const trigger = container.querySelector('.cn-checkbox-tree-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toBeDisabled()
    })

    test('disabled leaf mutes its label', () => {
      render(
        <CheckboxTree.Root selectedIds={[]} onSelectionChange={() => {}} defaultExpandedIds={['resources']}>
          <CheckboxTree.Group id="resources" label="Resources">
            <CheckboxTree.Item id="audit" label="Audit logs" disabled />
          </CheckboxTree.Group>
        </CheckboxTree.Root>
      )

      expect(screen.getByText('Audit logs')).toHaveClass('text-cn-disabled')
    })
  })

  describe('Accessibility', () => {
    test('exposes tree/treeitem/group roles and aria-expanded', async () => {
      const { container } = render(<Harness />)

      expect(container.querySelector('[role="tree"]')).toBeInTheDocument()
      const resourcesRow = getCheckbox('Resources').closest('[role="treeitem"]')
      expect(resourcesRow).toHaveAttribute('aria-expanded', 'true')
      expect(within(container).getAllByRole('group').length).toBeGreaterThan(0)
    })
  })
})
