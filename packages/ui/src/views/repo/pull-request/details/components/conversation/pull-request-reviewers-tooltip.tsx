import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Icon
} from '@components/index'

import { ReviewerItemProps } from '../../pull-request-details-types'

interface TooltipProps {
  reviewer?: ReviewerItemProps['reviewer']
  handleDelete: (id: number) => void
}

const PullRequestReviewersTooltip: React.FC<TooltipProps> = ({ reviewer, handleDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="xs">
          <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[180px] rounded-[10px]">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer text-red-400 hover:text-red-400 focus:text-red-400"
            onSelect={() => {
              handleDelete?.(reviewer?.id ?? 0)
              // TODO: handle error if can't delete reviewers
            }}
          >
            <DropdownMenuShortcut className="ml-0">
              <Icon name="trash" className="mr-2 text-red-400" />
            </DropdownMenuShortcut>
            Delete Reviewer
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { PullRequestReviewersTooltip }
