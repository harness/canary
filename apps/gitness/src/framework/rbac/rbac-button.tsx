import { Button, RbacButtonProps, rbacTooltip, Resource, Tooltip } from '@harnessio/ui/components'

import { useMFEContext } from '../hooks/useMFEContext'

export const RbacButton = ({ rbac, tooltip, ...rest }: RbacButtonProps) => {
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

  const button = <Button {...rest} ignoreIconOnlyTooltip disabled={!hasPermission} />

  return !hasPermission ? (
    <Tooltip title={tooltip?.title ?? rbacTooltip} content={tooltip?.content}>
      {button}
    </Tooltip>
  ) : (
    button
  )
}
