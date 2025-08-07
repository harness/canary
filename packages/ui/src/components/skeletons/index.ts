import { SkeletonBase } from './components/skeleton'
import { SkeletonAvatar } from './skeleton-avatar'
import { SkeletonForm } from './skeleton-form'
import { SkeletonIcon } from './skeleton-icon'
import { SkeletonList } from './skeleton-list'
import { SkeletonLogo } from './skeleton-logo'
import { SkeletonTable } from './skeleton-table'
import { SkeletonTypography } from './skeleton-typography'
import { SkeletonFileExplorer } from './skeloton-file-explorer'

export type { SkeletonFormProps } from './skeleton-form'
export type { SkeletonIconProps } from './skeleton-icon'
export type { SkeletonListProps } from './skeleton-list'
export type { SkeletonLogoProps } from './skeleton-logo'
export type { SkeletonTableProps } from './skeleton-table'
export type { SkeletonTypographyProps } from './skeleton-typography'
export type { SkeletonAvatarProps } from './skeleton-avatar'

const Skeleton = {
  Box: SkeletonBase,
  Avatar: SkeletonAvatar,
  List: SkeletonList,
  Form: SkeletonForm,
  Table: SkeletonTable,
  Icon: SkeletonIcon,
  Logo: SkeletonLogo,
  Typography: SkeletonTypography
}

export { Skeleton, SkeletonFileExplorer }
