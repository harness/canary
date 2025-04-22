import { Badge, Button, Icon } from '@/components'

interface BranchBadgeProps {
  branchName: string
  onClick?: () => void
  className?: string
}

const PullRequestBranchBadge: React.FC<BranchBadgeProps> = ({ branchName, onClick, className = '' }) => {
  return (
    <Button variant="soft" size="sm" theme="muted" onClick={onClick} className={`cursor-pointer ${className}`}>
      <Icon name="branch" size={12} className="mr-1" /> {branchName}
    </Button>
  )
}

export default PullRequestBranchBadge
