import { Badge, Icon } from '@components/index'

interface BranchBadgeProps {
  branchName: string
  onClick?: () => void
  className?: string
}

const PullRequestBranchBadge: React.FC<BranchBadgeProps> = ({ branchName, onClick, className = '' }) => {
  return (
    <Badge className={`cursor-pointer ${className}`} onClick={onClick} variant="tertiary" size="md" borderRadius="base">
      <Icon name="branch" size={12} className="mr-1 text-icons-9" /> {branchName}
    </Badge>
  )
}

export default PullRequestBranchBadge
