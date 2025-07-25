import { Scope } from '@views/common'

import { Tag } from '../tag'
import { determineScope } from './utils'

interface ScopeTagProps extends Scope {
  repoIdentifier: string
  repoPath: string
}

const ScopeTag: React.FC<ScopeTagProps> = props => {
  const scope = determineScope(props)

  return scope ? <Tag value={scope} size="sm" /> : null
}

export { ScopeTag }
