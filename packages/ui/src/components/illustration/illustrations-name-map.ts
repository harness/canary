import * as React from 'react'

import ChatAvatarLight from './images/chat-avatar-light.svg'
import ChatAvatar from './images/chat-avatar.svg'
// Import light theme variants
import CreateWorkspaceLight from './images/create-workspace-light.svg'
// Import standard images
import CreateWorkspace from './images/create-workspace.svg'
import HarnessLogoText from './images/harness-logo-text.svg'
import NoDataBranches from './images/no-data-branches.svg'
import NoDataCog from './images/no-data-cog.svg'
import NoDataCommits from './images/no-data-commits.svg'
import NoDataDelegate from './images/no-data-delegate.svg'
import NoDataError from './images/no-data-error.svg'
import NoDataFolder from './images/no-data-folder.svg'
import NoDataLabels from './images/no-data-labels.svg'
import NoDataMembers from './images/no-data-members.svg'
import NoDataMerge from './images/no-data-merge.svg'
import NoDataMetrics from './images/no-data-metrics.svg'
import NoDataNotifications from './images/no-data-notifications.svg'
import NoDataPipeline from './images/no-data-pipeline.svg'
import NoDataPR from './images/no-data-pr.svg'
import NoDataReference from './images/no-data-reference.svg'
import NoRepository from './images/no-data-repository.svg'
import NoDataSecrets from './images/no-data-secrets.svg'
import NoDataSecurity from './images/no-data-security.svg'
import NoDataTags from './images/no-data-tags.svg'
import NoDataWebhooks from './images/no-data-webhooks.svg'
import NoSearchMagnifyingGlass from './images/no-search-magnifying-glass.svg'
import SubMenuEllipse from './images/sub-menu-ellipse.svg'
import TiSavingsCardLight from './images/ti-savings-card-light.svg'
import TiSavingsCard from './images/ti-savings-card.svg'
import TiSparksSolid from './images/ti-sparks-solid.svg'
import TooltipArrow from './images/tooltip-arrow.svg'
import VulnerabilityActiveIssues from './images/vulnerabilty-active-issues.svg'
import VulnerabilityCritical from './images/vulnerabilty-critical.svg'
import VulnerabilityHigh from './images/vulnerabilty-high.svg'
import VulnerabilityInfo from './images/vulnerabilty-info.svg'
import VulnerabilityLow from './images/vulnerabilty-low.svg'
import VulnerabilityMedium from './images/vulnerabilty-medium.svg'
import Welcome from './images/welcome-dark.svg'
import WelcomeLight from './images/welcome-light.svg'

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
  'no-data-metrics': NoDataMetrics,
  'no-data-notifications': NoDataNotifications,
  'no-data-pipeline': NoDataPipeline,
  'no-data-reference': NoDataReference,
  'no-data-secrets': NoDataSecrets,
  'no-data-security': NoDataSecurity,
  'no-search-magnifying-glass': NoSearchMagnifyingGlass,
  'no-delegates': NoDataDelegate,
  'harness-logo-text': HarnessLogoText,
  'sub-menu-ellipse': SubMenuEllipse,
  'chat-avatar': ChatAvatar,
  'tooltip-arrow': TooltipArrow,
  'vulnerability-active-issues': VulnerabilityActiveIssues,
  'vulnerability-info': VulnerabilityInfo,
  'vulnerability-low': VulnerabilityLow,
  'vulnerability-medium': VulnerabilityMedium,
  'vulnerability-high': VulnerabilityHigh,
  'vulnerability-critical': VulnerabilityCritical,
  'ti-sparks': TiSparksSolid,
  'ti-savings-card': TiSavingsCard,
  welcome: Welcome,

  // Light theme variants
  'chat-avatar-light': ChatAvatarLight,
  'create-workspace-light': CreateWorkspaceLight,
  'ti-savings-card-light': TiSavingsCardLight,
  'welcome-light': WelcomeLight
} as const satisfies Record<string, React.FunctionComponent<React.SVGProps<SVGSVGElement>>>
