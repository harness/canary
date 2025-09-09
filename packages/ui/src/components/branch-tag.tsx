import { CopyTag, Link } from '@/components'

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
  return (
    <Link noHoverUnderline to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/files/${branchName}`}>
      <CopyTag
        variant={variant}
        theme={theme}
        size={size}
        icon={hideBranchIcon ? undefined : 'git-branch'}
        value={branchName || ''}
        hideCopyButton={hideCopyButton}
      />
    </Link>
  )
}

BranchTag.displayName = 'BranchTag'
export { BranchTag }
