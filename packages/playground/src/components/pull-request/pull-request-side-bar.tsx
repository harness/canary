import { useState } from 'react'

import cx from 'classnames'

import {
  Avatar,
  AvatarFallback,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text
} from '@harnessio/canary'

import { getInitials } from '../../utils/utils'
import { EnumPullReqReviewDecision, PullReqReviewDecision } from './interfaces'

interface PullRequestSideBarProps {
  reviewers?: {
    reviewer?: { display_name?: string; id?: number }
    review_decision?: EnumPullReqReviewDecision
    sha?: string
  }[]
  processReviewDecision: (
    review_decision: EnumPullReqReviewDecision,
    reviewedSHA?: string,
    sourceSHA?: string
  ) => EnumPullReqReviewDecision | PullReqReviewDecision.outdated
  pullRequestMetadata?: { source_sha: string }
  refetchReviewers: () => void
  handleDelete: (id: number) => void
  addReviewers?: (id?: number) => void
  usersList?: { display_name?: string; id?: number; uid?: string }[]
}

const PullRequestSideBar = (props: PullRequestSideBarProps) => {
  const {
    usersList,
    reviewers = [],
    pullRequestMetadata,
    processReviewDecision,
    refetchReviewers,
    handleDelete,
    addReviewers
  } = props

  const ReviewerItem = ({
    reviewer,
    reviewDecision,
    sha,
    sourceSHA
  }: {
    reviewer?: { display_name?: string; id?: number }
    reviewDecision?: EnumPullReqReviewDecision
    sha?: string
    sourceSHA?: string
  }) => {
    const updatedReviewDecision = reviewDecision && processReviewDecision(reviewDecision, sha, sourceSHA)
    const moreActionsTooltip = (
      reviewer:
        | {
            display_name?: string
            id?: number
          }
        | undefined
    ) => {
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
    return (
      <div key={reviewer?.id} className="mr-1 flex items-center space-x-2">
        <Avatar
          className={cx('h-7 w-7 rounded-full', {
            'p-0': updatedReviewDecision !== PullReqReviewDecision.changeReq
          })}
        >
          <AvatarFallback>
            <Text size={1} color="tertiaryBackground">
              {getInitials(reviewer?.display_name || '')}
            </Text>
          </AvatarFallback>
        </Avatar>
        <div className="reviewerName truncate">{reviewer?.display_name}</div>
        <div className="grow"></div>

        {updatedReviewDecision === PullReqReviewDecision.outdated ? (
          <Icon name="x-mark" className="text-warning" />
        ) : updatedReviewDecision === PullReqReviewDecision.approved ? (
          <Icon name="x-mark" className="text-success" />
        ) : updatedReviewDecision === PullReqReviewDecision.changeReq ? (
          <Icon name="x-mark" className="text-destructive" />
        ) : updatedReviewDecision === PullReqReviewDecision.pending ? (
          <Icon name="x-mark" />
        ) : null}
        {moreActionsTooltip(reviewer)}
      </div>
    )
  }

  const ReviewersList = () => (
    <div className="flex flex-col gap-3">
      {reviewers.length ? (
        reviewers.map(({ reviewer, review_decision, sha }) => (
          <ReviewerItem
            key={reviewer?.id}
            reviewer={reviewer}
            reviewDecision={review_decision}
            sha={sha}
            sourceSHA={pullRequestMetadata?.source_sha}
          />
        ))
      ) : (
        <Text size={2} weight="medium" color="tertiaryBackground">
          No reviewers
        </Text>
      )}
    </div>
  )

  const ReviewersHeader = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="flex items-center justify-between">
        <Text size={2} weight="medium">
          Reviewers
        </Text>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="ghost" className="px-2 py-1 text-tertiary-background">
              <Icon name="vertical-ellipsis" size={12} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search users..." className="h-9" />
              <CommandList>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup>
                  {usersList?.map(({ display_name, id }, idx: number) => (
                    <CommandItem
                      key={idx}
                      value={display_name}
                      onSelect={() => {
                        if (display_name) {
                          addReviewers?.(id)
                          setIsOpen(false)
                          refetchReviewers?.()
                        }
                      }}
                    >
                      {display_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        <ReviewersHeader />
        <ReviewersList />
      </div>
    </div>
  )
}

export { PullRequestSideBar }
