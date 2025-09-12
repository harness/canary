import { CopyTag, Link, Tag } from '@/components'

import type { TagProps } from './tag'

interface BranchTagProps {
  branchName: string
  spaceId?: string
  repoId?: string
  hideBranchIcon?: boolean
  hideCopyButton?: boolean
  theme?: TagProps['theme']
  variant?: TagProps['variant']
  size?: TagProps['size']
}

const BranchTag: React.FC<BranchTagProps> = ({
  branchName,
  spaceId,
  repoId,
  hideBranchIcon,
  hideCopyButton,
  theme = 'gray',
  variant = 'secondary',
  size = 'md'
}) => {
  const TagComponent = hideCopyButton ? Tag : CopyTag

  return (
    <Link noHoverUnderline to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/files/${branchName}`}>
      <TagComponent
        variant={variant}
        theme={theme}
        size={size}
        icon={hideBranchIcon ? undefined : 'git-branch'}
        value={branchName || ''}
      />
    </Link>
  )
}

BranchTag.displayName = 'BranchTag'
export { BranchTag }
