import React from 'react'
import { Link } from 'react-router-dom'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Icon
} from '@/components'

import { MoreActionsTooltipProps } from '../types'

export const MoreActionsTooltip: React.FC<MoreActionsTooltipProps> = ({
  branchInfo,
  defaultBranch,
  spaceId,
  repoId,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="xs">
          <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-primary-background w-[180px] rounded-[10px] border border-gray-800 py-2 shadow-sm">
        <DropdownMenuGroup>
          <Link
            replace
            to={`/spaces/${spaceId}/repos/${repoId}/pull-requests/compare/${defaultBranch}...${branchInfo.name}`}
          >
            <DropdownMenuItem className="cursor-pointer">
              <DropdownMenuShortcut className="ml-0">
                <Icon name="pr-open" className="mr-2" />
              </DropdownMenuShortcut>
              {t('views:repos.newPullReq', 'New pull request')}
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="cursor-pointer">
            <DropdownMenuShortcut className="ml-0">
              <Icon name="cog-6" className="mr-2" />
            </DropdownMenuShortcut>
            {t('views:repos.viewRules', 'View Rules')}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <DropdownMenuShortcut className="ml-0">
              <Icon name="edit-pen" className="mr-2" />
            </DropdownMenuShortcut>
            {t('views:repos.renameBranch', 'Rename Branch')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
