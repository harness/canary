import * as React from 'react'

import ChatAvatarLight from './images/chat-avatar-light.svg'
import ChatAvatar from './images/chat-avatar.svg'
// Import light theme variants
import CreateWorkspaceLight from './images/create-workspace-light.svg'
// Import standard images
import CreateWorkspace from './images/create-workspace.svg'
import HarnessLogoText from './images/harness-logo-text.svg'
import NoDataBranchesLight from './images/no-data-branches-light.svg'
import NoDataBranches from './images/no-data-branches.svg'
import NoDataCogLight from './images/no-data-cog-light.svg'
import NoDataCog from './images/no-data-cog.svg'
import NoDataCommitsLight from './images/no-data-commits-light.svg'
import NoDataCommits from './images/no-data-commits.svg'
import NoDataErrorLight from './images/no-data-error-light.svg'
import NoDataError from './images/no-data-error.svg'
import NoDataFolderLight from './images/no-data-folder-light.svg'
import NoDataFolder from './images/no-data-folder.svg'
import NoDataLabelsLight from './images/no-data-labels-light.svg'
import NoDataLabels from './images/no-data-labels.svg'
import NoDataMembersLight from './images/no-data-members-light.svg'
import NoDataMembers from './images/no-data-members.svg'
import NoDataMergeLight from './images/no-data-merge-light.svg'
import NoDataMerge from './images/no-data-merge.svg'
import NoDataPRLight from './images/no-data-pr-light.svg'
import NoDataPR from './images/no-data-pr.svg'
import NoRepositoryLight from './images/no-data-repository-light.svg'
import NoRepository from './images/no-data-repository.svg'
import NoDataTagsLight from './images/no-data-tags-light.svg'
import NoDataTags from './images/no-data-tags.svg'
import NoDataWebhooksLight from './images/no-data-webhooks-light.svg'
import NoDataWebhooks from './images/no-data-webhooks.svg'
import NoSearchMagnifyingGlassLight from './images/no-search-magnifying-glass-light.svg'
import NoSearchMagnifyingGlass from './images/no-search-magnifying-glass.svg'
import SubMenuEllipse from './images/sub-menu-ellipse.svg'
import TooltipArrow from './images/tooltip-arrow.svg'
import NoDataDelegate from './images/no-data-delegate.svg'
import NoDataDelegateLight from './images/no-data-delegate-light.svg'

export const IllustrationsNameMap = {
  'create-workspace': CreateWorkspace,
  'no-data-branches': NoDataBranches,
  'no-data-cog': NoDataCog,
  'no-data-commits': NoDataCommits,
  'no-data-error': NoDataError,
  'no-data-folder': NoDataFolder,
  'no-data-members': NoDataMembers,
  'no-data-merge': NoDataMerge,
  'no-data-pr': NoDataPR,
  'no-repository': NoRepository,
  'no-data-tags': NoDataTags,
  'no-data-labels': NoDataLabels,
  'no-data-webhooks': NoDataWebhooks,
  'no-search-magnifying-glass': NoSearchMagnifyingGlass,
  'no-delegates': NoDataDelegate,
  'harness-logo-text': HarnessLogoText,
  'sub-menu-ellipse': SubMenuEllipse,
  'chat-avatar': ChatAvatar,
  'tooltip-arrow': TooltipArrow,

  // Light theme variants
  'chat-avatar-light': ChatAvatarLight,
  'create-workspace-light': CreateWorkspaceLight,
  'no-data-branches-light': NoDataBranchesLight,
  'no-data-cog-light': NoDataCogLight,
  'no-data-commits-light': NoDataCommitsLight,
  'no-data-error-light': NoDataErrorLight,
  'no-data-folder-light': NoDataFolderLight,
  'no-data-members-light': NoDataMembersLight,
  'no-data-merge-light': NoDataMergeLight,
  'no-data-pr-light': NoDataPRLight,
  'no-repository-light': NoRepositoryLight,
  'no-data-tags-light': NoDataTagsLight,
  'no-data-labels-light': NoDataLabelsLight,
  'no-data-webhooks-light': NoDataWebhooksLight,
  'no-delegates-light': NoDataDelegateLight,
  'no-search-magnifying-glass-light': NoSearchMagnifyingGlassLight
} as const satisfies Record<string, React.FunctionComponent<React.SVGProps<SVGSVGElement>>>
