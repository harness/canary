import { CopyTag } from '@/components'
import { useRouterContext } from '@/context'

import type { TagProps } from './tag'

interface BranchTagProps {
  branchName: string
  spaceId?: string
  repoId?: string
  hideBranchIcon?: boolean
  theme?: TagProps['theme']
  variant?: TagProps['variant']
  size?: TagProps['size']
}

const BranchTag: React.FC<BranchTagProps> = ({
  branchName,
  spaceId,
  repoId,
  hideBranchIcon,
  theme = 'gray',
  variant = 'secondary',
  size = 'md'
}) => {
  const { Link } = useRouterContext()

  return (
    <Link to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/files/${branchName}`}>
      <CopyTag
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
