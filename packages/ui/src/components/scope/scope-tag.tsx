import { ScopeType } from '@views/common'

import { Tag } from '../tag'

interface ScopeTagProps {
  scopeType: ScopeType
  scopedPath?: string
}

const ScopeTag: React.FC<ScopeTagProps> = ({ scopeType, scopedPath }) => {
  switch (scopeType) {
    case ScopeType.Account:
      return <Tag value={scopeType} theme="lime" size="sm" />

    case ScopeType.Organization:
      return <Tag label={scopeType} value={scopedPath || ''} variant="secondary" theme="pink" size="sm" />

    case ScopeType.Project:
      return <Tag label={scopeType} value={scopedPath || ''} variant="secondary" theme="blue" size="sm" />
    default:
      return <></>
  }
}

export { ScopeTag }
