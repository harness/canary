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
  forkData?: {
    branchName: string
    path: string
    repoId: string
  }
  toUpstreamRepo?: (path: string, subPath?: string) => string
}

interface ForkTagProps {
  repoIdentifier: string
  repoPath: string
  branchName: string
  toUpstreamRepo?: (path: string, subPath?: string) => string
  theme?: TagProps['theme']
  variant?: TagProps['variant']
  size?: TagProps['size']
  hideCopyButton?: boolean
}

export const ForkTag: React.FC<ForkTagProps> = ({
  repoIdentifier,
  repoPath,
  branchName,
  toUpstreamRepo,
  theme = 'gray',
  variant = 'secondary',
  size = 'md',
  hideCopyButton = false
}) => {
  const displayValue = `${repoIdentifier}:${branchName}`
  const TagComponent = hideCopyButton ? Tag : CopyTag
  if (!toUpstreamRepo) {
    return <TagComponent variant={variant} theme={theme} size={size} icon="git-fork" value={displayValue} />
  }

  return (
    <Link
      noHoverUnderline
      external
      href={toUpstreamRepo(repoPath, `files/${branchName}`)}
      onClick={e => e.stopPropagation()}
    >
      <TagComponent variant={variant} theme={theme} size={size} icon="git-fork" value={displayValue} />
    </Link>
  )
}

const BranchTag: React.FC<BranchTagProps> = ({
  branchName,
  forkData,
  spaceId,
  repoId,
  hideBranchIcon,
  hideCopyButton,
  theme = 'gray',
  variant = 'secondary',
  size = 'md',
  toUpstreamRepo
}) => {
  const TagComponent = hideCopyButton ? Tag : CopyTag

  // Render ForkTag when forkData indicates this is a fork
  if (forkData) {
    return (
      <ForkTag
        repoIdentifier={forkData.repoId}
        repoPath={forkData.path}
        branchName={forkData.branchName}
        toUpstreamRepo={toUpstreamRepo}
        theme={theme}
        variant={variant}
        size={size}
        hideCopyButton={hideCopyButton}
      />
    )
  }

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
