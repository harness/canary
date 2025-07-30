import { Tag } from '@/components'
import { useRouterContext } from '@/context'

interface BranchBadgeProps {
  branchName: string
  spaceId?: string
  repoId?: string
}
const PullRequestBranchBadge: React.FC<BranchBadgeProps> = ({ branchName, spaceId, repoId }) => {
  const { Link } = useRouterContext()
  return (
    <Link to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/code/${branchName}`}>
      <Tag variant="secondary" theme="blue" icon="git-branch" value={branchName || ''} showIcon />
    </Link>
  )
}

export default PullRequestBranchBadge
