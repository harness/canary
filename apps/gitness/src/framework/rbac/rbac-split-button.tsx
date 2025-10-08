import { isUndefined } from 'lodash-es'

import { RbacSplitButtonProps, rbacTooltip, Resource, SplitButton, Tooltip } from '@harnessio/ui/components'

import { useMFEContext } from '../hooks/useMFEContext'

export const RbacSplitButton = <T extends string>({
  rbac,
  buttonRbac,
  dropdownRbac,
  variant,
  tooltip,
  ...rest
}: RbacSplitButtonProps<T>) => {
  const { hooks } = useMFEContext()

  /**
   *  Enable the button only if the user has at least one required permission; otherwise, disable it.
   */
  const hasPermission = isUndefined(rbac)
    ? true
    : (hooks
        .usePermission?.({
          resource: rbac.resource ?? ({} as Resource),
          permissions: rbac.permissions ?? []
        })
        ?.some(Boolean) ?? true)

  const hasButtonPermission = isUndefined(buttonRbac)
    ? true
    : (hooks
        .usePermission?.({
          resource: buttonRbac.resource ?? ({} as Resource),
          permissions: buttonRbac.permissions ?? []
        })
        ?.some(Boolean) ?? true)

  const hasDropdownPermission = isUndefined(dropdownRbac)
    ? true
    : (hooks
        .usePermission?.({
          resource: dropdownRbac.resource ?? ({} as Resource),
          permissions: dropdownRbac.permissions ?? []
        })
        ?.some(Boolean) ?? true)

  const button = (
    <SplitButton<T>
      {...rest}
      variant={variant === 'outline' ? 'outline' : undefined}
      disabled={!hasPermission}
      disableButton={!hasButtonPermission}
      disableDropdown={!hasDropdownPermission}
    />
  )

  return !hasPermission ? (
    <Tooltip title={tooltip?.title ?? rbacTooltip} content={tooltip?.content}>
      {button}
    </Tooltip>
  ) : (
    /*
     * TODO: When a user provides separate RBAC for the button vs dropdown, we want to add separate tooltips in
     *       SplitButton, however that component does not support separate tooltips yet.
     */
    button
  )
}
