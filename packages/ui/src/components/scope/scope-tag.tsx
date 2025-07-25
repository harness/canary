import { Scope, ScopeType } from '@views/common'

import { Tag } from '../tag'
import { determineScope, getScopedPath } from './utils'

interface ScopeTagProps extends Scope {
  repoIdentifier: string
  repoPath: string
}

const ScopeTag: React.FC<ScopeTagProps> = props => {
  const scope = determineScope(props)
  switch (scope) {
    case ScopeType.Account:
      return <Tag value={scope} theme="lime" size="sm" />

    case ScopeType.Org:
      return <Tag label={scope} value={getScopedPath(props)} variant="secondary" theme="pink" size="sm" />

    case ScopeType.Project:
      return <Tag label={scope} value={getScopedPath(props)} variant="secondary" theme="blue" size="sm" />
    default:
      return <></>
  }
}

export { ScopeTag }
