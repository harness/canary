import { Button, IconV2 } from '@/components'

interface BranchBadgeProps {
  branchName: string
  onClick?: () => void
  className?: string
}

const PullRequestBranchBadge: React.FC<BranchBadgeProps> = ({ branchName, onClick, className = '' }) => {
  return (
    <Button variant="secondary" size="sm" onClick={onClick} className={`cursor-pointer ${className}`}>
      <IconV2 name="git-branch" size="2xs" className="mr-1" /> {branchName}
    </Button>
  )
}

export default PullRequestBranchBadge
