import { render, screen } from '@testing-library/react'

import { PermissionIdentifier, ResourceType } from '@harnessio/ui/components'

import { RbacSplitButton } from '../rbac-split-button'

const mockUsePermission = vi.fn()

vi.mock('../../hooks/useMFEContext', () => ({
  useMFEContext: () => ({ hooks: { usePermission: mockUsePermission } })
}))

vi.mock('@harnessio/ui/components', () => ({
  rbacTooltip: 'You are missing the permission for this action.',
  ResourceType: { CODE_REPOSITORY: 'CODE_REPOSITORY' },
  PermissionIdentifier: { CODE_REPO_REVIEW: 'code_repo_review' },
  SplitButton: ({ children, disabled }: { children?: React.ReactNode; disabled?: boolean }) => (
    <button type="button" data-testid="split-button" disabled={disabled}>
      {children}
    </button>
  ),
  Tooltip: ({
    title,
    content,
    children
  }: {
    title?: React.ReactNode
    content?: React.ReactNode
    children?: React.ReactNode
  }) => (
    <div data-testid="tooltip">
      <span data-testid="tooltip-title">{title}</span>
      <span data-testid="tooltip-content">{content}</span>
      {children}
    </div>
  )
}))

const rbac = {
  resource: { resourceType: ResourceType.CODE_REPOSITORY, resourceIdentifier: 'my-repo' },
  permissions: [PermissionIdentifier.CODE_REPO_REVIEW]
}

const splitButtonProps = {
  options: [],
  handleOptionChange: () => undefined,
  handleButtonClick: () => undefined
}

const getButton = () => screen.getByTestId('split-button') as HTMLButtonElement

describe('RbacSplitButton', () => {
  beforeEach(() => {
    mockUsePermission.mockReset()
  })

  test('disables the button and shows the default tooltip when permission is denied', () => {
    mockUsePermission.mockReturnValue([false])

    render(
      <RbacSplitButton rbac={rbac} {...splitButtonProps}>
        Approve
      </RbacSplitButton>
    )

    expect(getButton().disabled).toBe(true)
    expect(screen.getByTestId('tooltip-title').textContent).toBe('You are missing the permission for this action.')
  })

  test('renders a custom tooltip content when provided and permission is denied', () => {
    mockUsePermission.mockReturnValue([false])

    render(
      <RbacSplitButton
        rbac={rbac}
        tooltip={{ content: 'You need the Code Repository Review permission to approve' }}
        {...splitButtonProps}
      >
        Approve
      </RbacSplitButton>
    )

    expect(getButton().disabled).toBe(true)
    expect(screen.getByTestId('tooltip-content').textContent).toBe(
      'You need the Code Repository Review permission to approve'
    )
  })

  test('enables the button and renders no tooltip when permission is granted', () => {
    mockUsePermission.mockReturnValue([true])

    render(
      <RbacSplitButton rbac={rbac} {...splitButtonProps}>
        Approve
      </RbacSplitButton>
    )

    expect(getButton().disabled).toBe(false)
    expect(screen.queryByTestId('tooltip')).toBeNull()
  })

  test('falls back to enabled (no host hook) when usePermission is undefined', () => {
    mockUsePermission.mockReturnValue(undefined)

    render(
      <RbacSplitButton rbac={rbac} {...splitButtonProps}>
        Approve
      </RbacSplitButton>
    )

    expect(getButton().disabled).toBe(false)
    expect(screen.queryByTestId('tooltip')).toBeNull()
  })

  test('keeps the button disabled via the passed disabled prop even when permission is granted', () => {
    mockUsePermission.mockReturnValue([true])

    render(
      <RbacSplitButton rbac={rbac} disabled {...splitButtonProps}>
        Approve
      </RbacSplitButton>
    )

    expect(getButton().disabled).toBe(true)
  })
})
