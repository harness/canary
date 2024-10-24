import * as React from 'react'
import ChevronDown from '../icons/chevron-down.svg'
import Archive from '../icons/repositories-icon.svg'
import Harness from '../icons/harness.svg'
import Pipelines from '../icons/pipelines-icon.svg'
import FeaturedFlags from '../icons/featured-flags-icon.svg'
import Ellipsis from '../icons/more-dots-icon.svg'
import Repositories from '../icons/repositories-icon.svg'
import ChaosEngineering from '../icons/chaos-engineering-icon.svg'
import Environment from '../icons/environment-icon.svg'
import Secrets from '../icons/secrets-icon.svg'
import Connectors from '../icons/connectors-icon.svg'
import Star from '../icons/star-icon.svg'
import Pull from '../icons/pull-icon.svg'
import Search from '../icons/search.svg'
import ArrowLong from '../icons/arrow-long.svg'
import Success from '../icons/success.svg'
import Fail from '../icons/fail.svg'
import TubeSign from '../icons/tube-sign.svg'
import Signpost from '../icons/signpost.svg'
import Merged from '../icons/merged.svg'
import Unmerged from '../icons/unmerged.svg'
import Comments from '../icons/comments.svg'
import Tasks from '../icons/tasks.svg'
import Tick from '../icons/tick.svg'
import NoDataFolder from '../icons/no-data-folder.svg'
import NoDataMerge from '../icons/no-data-merge.svg'
import NoDataCog from '../icons/no-data-cog.svg'
import NoDataBranches from '../icons/no-data-branches.svg'
import NoSearchMagnifyingGlass from '../icons/no-search-magnifying-glass.svg'
import NoDataMembers from '../icons/no-data-members.svg'
import Changes from '../icons/changes.svg'
import Checks from '../icons/checks.svg'
import VerticalEllipsis from '../icons/vertical-ellipsis.svg'
import Clone from '../icons/clone.svg'
import TriangleWarning from '../icons/triangle-warning.svg'
import PendingClock from '../icons/pending-clock.svg'
import Circle from '../icons/circle.svg'
import AppleShortcut from '../icons/apple-shortcut.svg'
import Edit from '../icons/edit.svg'
import GitnessLogo from '../icons/gitness-logo.svg'
import Folder from '../icons/folder.svg'
import File from '../icons/file.svg'
import Tag from '../icons/tag.svg'
import Branch from '../icons/branch.svg'
import OpenPR from '../icons/open-pr.svg'
import Plus from '../icons/plus.svg'
import Running from '../icons/running.svg'
import CircleArrowTopRight from '../icons/circle-arrow-top-right.svg'
import BoxLightning from '../icons/box-lightning.svg'
import BoxCloning from '../icons/box-cloning.svg'
import BoxPullRequests from '../icons/box-pull-requests.svg'
import BoxGuide from '../icons/box-guide.svg'
import NodeLogo from '../icons/node-logo.svg'
import PythonLogo from '../icons/python-logo.svg'
import PythonAndNodeLogo from '../icons/python-and-node-logo.svg'
import AISparks from '../icons/ai-sparks.svg'
import PrOpen from '../icons/pr-open.svg'
import PrReview from '../icons/pr-review.svg'
import PrClosed from '../icons/pr-closed.svg'
import PrMerge from '../icons/pr-merge.svg'
import GitBranch from '../icons/git-branch.svg'
import GithubActions from '../icons/github-actions.svg'
import PrComment from '../icons/pr-comment.svg'
import CreateWorkspace from '../icons/create-workspace.svg'
import NoDataWebhooks from '../icons/no-data-webhooks.svg'
import AddFile from '../icons/add-file.svg'
import AddFolder from '../icons/add-folder.svg'
import Lightning from '../icons/lightning.svg'
import HarnessPlugin from '../icons/harness-plugin.svg'
import BitrisePlugin from '../icons/bitrise-plugin.svg'
import Trash from '../icons/trash.svg'
import XMark from '../icons/x-mark.svg'
import Cog6 from '../icons/cog-6.svg'
import Pin from '../icons/pin.svg'
import Unpin from '../icons/unpin.svg'
import Rocket from '../icons/rocket.svg'
import Plug from '../icons/plug.svg'
import Flag from '../icons/flag.svg'
import FilterOrganization from '../icons/filter-organization.svg'
import ShieldLock from '../icons/shield-lock.svg'
import MoreFolder from '../icons/more-folder.svg'
import Bookmark from '../icons/bookmark.svg'
import SearchContent from '../icons/search-content.svg'
import Chain from '../icons/chain.svg'
import ShieldTick from '../icons/shield-tick.svg'
import CloudMining from '../icons/cloud-mining.svg'
import PRMerged from '../icons/pr-merged.svg'
import Run from '../icons/run.svg'
import RunTest from '../icons/run-test.svg'
import SshKey from '../icons/ssh-key.svg'
import GreenCircle from '../icons/green-circle.svg'
import GreenTick from '../icons/green-tick-nobg.svg'
import CancelGrey from '../icons/cancel-grey.svg'
import HarnessLogoText from '../icons/harness-logo-text.svg'
// import Fork from '../icons/fork.svg'

const IconNameMap = {
  'chevron-down': ChevronDown,
  archive: Archive,
  harness: Harness,
  pipelines: Pipelines,
  'featured-flags': FeaturedFlags,
  ellipsis: Ellipsis,
  repositories: Repositories,
  'chaos-engineering': ChaosEngineering,
  environment: Environment,
  secrets: Secrets,
  connectors: Connectors,
  star: Star,
  pull: Pull,
  search: Search,
  'arrow-long': ArrowLong,
  success: Success,
  fail: Fail,
  'tube-sign': TubeSign,
  signpost: Signpost,
  merged: Merged,
  'pr-draft': Unmerged,
  comments: Comments,
  tasks: Tasks,
  tick: Tick,
  'no-data-folder': NoDataFolder,
  'no-data-merge': NoDataMerge,
  'no-data-cog': NoDataCog,
  'no-data-branches': NoDataBranches,
  'no-search-magnifying-glass': NoSearchMagnifyingGlass,
  'no-data-members': NoDataMembers,
  changes: Changes,
  checks: Checks,
  'vertical-ellipsis': VerticalEllipsis,
  clone: Clone,
  'triangle-warning': TriangleWarning,
  'pending-clock': PendingClock,
  circle: Circle,
  'apple-shortcut': AppleShortcut,
  'edit-pen': Edit,
  'gitness-logo': GitnessLogo,
  'github-actions': GithubActions,
  folder: Folder,
  file: File,
  tag: Tag,
  branch: Branch,
  'open-pr': OpenPR,
  plus: Plus,
  running: Running,
  'circle-arrow-top-right': CircleArrowTopRight,
  'box-lightning': BoxLightning,
  'box-cloning': BoxCloning,
  'box-pull-requests': BoxPullRequests,
  'box-guide': BoxGuide,
  'node-logo': NodeLogo,
  'python-logo': PythonLogo,
  'python-and-node-logo': PythonAndNodeLogo,
  'ai-sparks': AISparks,
  'pr-open': PrOpen,
  'pr-review': PrReview,
  'pr-closed': PrClosed,
  'pr-merge': PrMerge,
  'git-branch': GitBranch,
  'pr-comment': PrComment,
  'create-workspace': CreateWorkspace,
  'no-data-webhooks': NoDataWebhooks,
  'add-folder': AddFolder,
  'add-file': AddFile,
  lightning: Lightning,
  'harness-plugin': HarnessPlugin,
  'bitrise-plugin': BitrisePlugin,
  trash: Trash,
  'x-mark': XMark,
  'cog-6': Cog6,
  pin: Pin,
  unpin: Unpin,
  rocket: Rocket,
  plug: Plug,
  flag: Flag,
  'filter-organization': FilterOrganization,
  'shield-lock': ShieldLock,
  'more-folder': MoreFolder,
  bookmark: Bookmark,
  'search-content': SearchContent,
  chain: Chain,
  'shield-tick': ShieldTick,
  'cloud-mining': CloudMining,
  'pr-merged': PRMerged,
  run: Run,
  'run-test': RunTest,
  'ssh-key': SshKey,
  'green-dot': GreenCircle,
  'green-tick': GreenTick,
  'cancel-grey': CancelGrey,
  'harness-logo-text': HarnessLogoText
  // fork: Fork
} satisfies Record<string, React.FunctionComponent<React.SVGProps<SVGSVGElement>>>

export interface IconProps {
  name: keyof typeof IconNameMap
  size?: number
  height?: number
  width?: number
  className?: string
}

const Icon: React.FC<IconProps> = ({ name, size = 16, height, width, className }) => {
  const Component = IconNameMap[name]
  return <Component width={width || size} height={height || size} className={className} />
}

export { Icon }
