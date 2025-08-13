import { Button, RbacButtonProps, Resource } from '@harnessio/ui/components'

import { useMFEContext } from '../hooks/useMFEContext'

export const RbacButton = ({ rbac, ...rest }: RbacButtonProps) => {
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

  return <Button {...rest} disabled={!hasPermission} />
}
