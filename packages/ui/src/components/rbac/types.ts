import { RefAttributes } from 'react'

import { ActionData, MoreActionsTooltipProps } from '@/components'
import { ButtonProps } from '@components/button'
import { SplitButtonProps } from '@components/split-button'
import { TooltipProps } from '@components/tooltip'

/**
 * @todo Replace with types from @harness/microfrontends once its accessible in the monorepo
 */
export interface Resource {
  resourceType: ResourceType
  resourceIdentifier?: string
}

export enum ResourceType {
  CODE_REPOSITORY = 'CODE_REPOSITORY',
  SECRET = 'SECRET'
}

export enum PermissionIdentifier {
  CODE_REPO_CREATE = 'code_repo_create',
  CODE_REPO_DELETE = 'code_repo_delete',
  UPDATE_SECRET = 'core_secret_edit',
  DELETE_SECRET = 'core_secret_delete'
}

export interface PermissionsRequest {
  resource: Resource
  permissions: PermissionIdentifier[]
}

export interface RBACProps {
  rbac?: PermissionsRequest
}

/**
 * Types for RBAC-enabled components.
 * These components will automatically handle RBAC checks based on the provided `rbac` prop.
 */
export interface RbacButtonProps extends Omit<ButtonProps, 'resource' | 'tooltipProps'>, RBACProps {
  tooltip?: Pick<TooltipProps, 'title' | 'content'>
}

export type RbacSplitButtonProps<T extends string> = SplitButtonProps<T> &
  RBACProps & { tooltip?: Pick<TooltipProps, 'title' | 'content'> }

export interface RbacMoreActionsTooltipActionData extends ActionData, RBACProps {}

export interface RbacMoreActionsTooltipProps
  extends Omit<MoreActionsTooltipProps, 'actions'>,
    RefAttributes<HTMLButtonElement> {
  actions: RbacMoreActionsTooltipActionData[]
}

export const rbacTooltip = 'You are missing the permission for this action.'
