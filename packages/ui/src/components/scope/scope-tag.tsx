import { ScopeType } from '@views/common'

import { Tag, TagProps } from '../tag'

interface ScopeTagProps extends Pick<TagProps, 'size'> {
  scopeType: ScopeType
  scopedPath?: string
}

const ScopeTag: React.FC<ScopeTagProps> = ({ scopeType, scopedPath, size }) => {
  const tagProps: TagProps = {
    variant: 'secondary',
    theme: 'gray',
    size,
    value: scopedPath || '',
    showIcon: true
  }

  switch (scopeType) {
    case ScopeType.Account:
      return <Tag {...tagProps} icon="account" value="Account" />
    case ScopeType.Organization:
      return <Tag {...tagProps} icon="organizations" />
    case ScopeType.Project:
      return <Tag {...tagProps} icon="project" />
    default:
      return null
  }
}

export { ScopeTag }
