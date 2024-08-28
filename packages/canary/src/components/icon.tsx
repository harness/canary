import * as React from 'react'
import ChevronDown from '../icons/chevron-down.svg'
import Archive from '../icons/repositories-icon.svg'
import Harness from '../icons/harness.svg'
import Pipelines from '../icons/pipelines-icon.svg'
import Executions from '../icons/executions-icon.svg'
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
import NoSearchMagnifyingGlass from '../icons/no-search-magnifying-glass.svg'
import Clone from '../icons/clone.svg'
// import Fork from '../icons/fork.svg'

const IconNameMap = {
  'chevron-down': ChevronDown,
  archive: Archive,
  harness: Harness,
  pipelines: Pipelines,
  executions: Executions,
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
  unmerged: Unmerged,
  comments: Comments,
  tasks: Tasks,
  tick: Tick,
  'no-data-folder': NoDataFolder,
  'no-data-merge': NoDataMerge,
  'no-data-cog': NoDataCog,
  'no-search-magnifying-glass': NoSearchMagnifyingGlass,
  clone: Clone
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
  console.log({ Component })
  return <Component width={width || size} height={height || size} className={className} />
}

export { Icon }
