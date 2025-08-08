import { CopyTag } from '@/components'
import { useRouterContext } from '@/context'

interface BranchTagProps {
  branchName: string
  spaceId?: string
  repoId?: string
  hideBranchIcon?: boolean
}

const BranchTag: React.FC<BranchTagProps> = ({ branchName, spaceId, repoId, hideBranchIcon }) => {
  const { Link } = useRouterContext()

  return (
    <Link to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/files/${branchName}`}>
      <CopyTag
        variant="secondary"
        theme="gray"
        icon={hideBranchIcon ? undefined : 'git-branch'}
        value={branchName || ''}
      />
    </Link>
  )
}

BranchTag.displayName = 'BranchTag'
export { BranchTag }
