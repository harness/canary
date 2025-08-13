import { ButtonProps } from '@components/button'
import { SplitButtonProps } from '@components/split-button'

/**
 * @todo Replace with types from @harness/microfrontends once its accessible in the monorepo
 */
export interface Resource {
  resourceType: ResourceType
  resourceIdentifier?: string
}

export enum ResourceType {
  CODE_REPOSITORY = 'CODE_REPOSITORY'
}

export enum PermissionIdentifier {
  CODE_REPO_CREATE = 'code_repo_create',
  CODE_REPO_DELETE = 'code_repo_delete'
}

export interface PermissionsRequest {
  resource: Resource
  permissions: PermissionIdentifier[]
}

interface RBACProps {
  rbac?: PermissionsRequest
}

/**
 * Types for RBAC-enabled components.
 * These components will automatically handle RBAC checks based on the provided `rbac` prop.
 */
export interface RbacButtonProps extends Omit<ButtonProps, 'resource'>, RBACProps {}

export type RbacSplitButtonProps<T extends string> = SplitButtonProps<T> & RBACProps
