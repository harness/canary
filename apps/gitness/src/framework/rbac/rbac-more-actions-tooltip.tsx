import { forwardRef } from 'react'

import { isUndefined } from 'lodash-es'

import {
  ActionData,
  MoreActionsTooltip,
  RbacMoreActionsTooltipActionData,
  RbacMoreActionsTooltipProps,
  rbacTooltip
} from '@harnessio/ui/components'

import { useMFEContext } from '../hooks/useMFEContext.ts'

export const RbacMoreActionsTooltip = forwardRef<HTMLButtonElement, RbacMoreActionsTooltipProps>(
  ({ ...props }: RbacMoreActionsTooltipProps, ref) => {
    const { hooks } = useMFEContext()

    const rbacActions: ActionData[] = props.actions.map(action => {
      const rbac = action.rbac

      const [hasPermission] =
        isUndefined(hooks?.usePermission) || isUndefined(rbac)
          ? [true]
          : hooks.usePermission({
              resource: rbac.resource,
              permissions: rbac.permissions
            })

      return {
        ...action,
        disabled: hasPermission ? action.disabled : true,
        tooltip: hasPermission ? action.tooltip : { content: rbacTooltip }
      } satisfies RbacMoreActionsTooltipActionData
    })

    return <MoreActionsTooltip ref={ref} {...props} actions={rbacActions} />
  }
)

RbacMoreActionsTooltip.displayName = 'RbacMoreActionsTooltip'
