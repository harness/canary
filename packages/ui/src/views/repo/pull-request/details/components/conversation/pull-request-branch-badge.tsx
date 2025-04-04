import { Badge, Button, Icon } from '@/components'

interface BranchBadgeProps {
  branchName: string
  onClick?: () => void
  className?: string
}

// TODO: CDS fix this

const PullRequestBranchBadge: React.FC<BranchBadgeProps> = ({ branchName, onClick, className = '' }) => {
  return (
    <Button asChild onClick={onClick} className={`cursor-pointer ${className}`}>
      <Badge variant="soft" size="sm">
        <Icon name="branch" size={12} className="mr-1 text-icons-9" /> {branchName}
      </Badge>
    </Button>
  )
}

export default PullRequestBranchBadge
