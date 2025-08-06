import { ScopeType } from '@views/common'

import { Tag, TagProps } from '../tag'

interface ScopeTagProps extends Pick<TagProps, 'size' | 'className'> {
  scopeType: ScopeType
  scopedPath?: string
}

const ScopeTag: React.FC<ScopeTagProps> = ({ scopeType, scopedPath, size, className }) => {
  const tagProps: TagProps = {
    variant: 'secondary',
    theme: 'gray',
    size,
    value: scopedPath || '',
    showIcon: true,
    className
  }

  switch (scopeType) {
    case ScopeType.Account:
      return <Tag {...tagProps} icon="account" value="Account" />
    case ScopeType.Organization:
      return <Tag {...tagProps} icon="organizations" />
    case ScopeType.Project:
      return <Tag {...tagProps} icon="project" />
    case ScopeType.Repository:
      return <Tag {...tagProps} icon="repository" />
    default:
      return <Tag {...tagProps} />
  }
}

export { ScopeTag }
