import { RbacSplitButtonProps, Resource, SplitButton, Tooltip } from '@harnessio/ui/components'

import { useMFEContext } from '../hooks/useMFEContext'

export const RbacSplitButton = <T extends string>({ rbac, variant, tooltip, ...rest }: RbacSplitButtonProps<T>) => {
  const { hooks } = useMFEContext()

  /**
   *  Enable the button only if the user has at least one required permission; otherwise, disable it.
   */
  const hasPermission =
    hooks
      .usePermission?.({
        resource: rbac?.resource ?? ({} as Resource),
        permissions: rbac?.permissions ?? []
      })
      ?.some(Boolean) ?? true

  const button = (
    <SplitButton<T> {...rest} variant={variant === 'outline' ? 'outline' : undefined} disabled={!hasPermission} />
  )

  return !hasPermission ? (
    <Tooltip title={tooltip?.title ?? 'You are missing the permission for this action.'} content={tooltip?.content}>
      {button}
    </Tooltip>
  ) : (
    button
  )
}
