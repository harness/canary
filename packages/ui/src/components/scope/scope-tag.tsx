import { IconV2NamesType } from '@components/icon-v2'
import { ScopeType } from '@views/common'

import { Tag, TagProps } from '../tag'

interface ScopeTagProps extends Pick<TagProps, 'size' | 'className'> {
  scopeType: ScopeType
  scopedPath?: string
}

export const scopeTypeToIconMap: Record<ScopeType, IconV2NamesType> = {
  [ScopeType.Account]: 'account',
  [ScopeType.Organization]: 'organizations',
  [ScopeType.Project]: 'project',
  [ScopeType.Repository]: 'repository'
}

export const getScopeType = (scope: number): ScopeType => {
  switch (scope) {
    case 0:
      return ScopeType.Repository
    case 1:
      return ScopeType.Account
    case 2:
      return ScopeType.Organization
    case 3:
      return ScopeType.Project
    default:
      return ScopeType.Account
  }
}

const ScopeTag: React.FC<ScopeTagProps> = ({ scopeType, scopedPath, size, className }) => {
  const tagProps: TagProps = {
    variant: 'secondary',
    theme: 'gray',
    size,
    value: scopedPath || '',
    className
  }

  switch (scopeType) {
    case ScopeType.Account:
      return <Tag {...tagProps} icon={scopeTypeToIconMap[ScopeType.Account]} value="Account" />
    case ScopeType.Organization:
      return <Tag {...tagProps} icon={scopeTypeToIconMap[ScopeType.Organization]} />
    case ScopeType.Project:
      return <Tag {...tagProps} icon={scopeTypeToIconMap[ScopeType.Project]} />
    case ScopeType.Repository:
      return <Tag {...tagProps} icon={scopeTypeToIconMap[ScopeType.Repository]} />
    default:
      return <Tag {...tagProps} />
  }
}

export { ScopeTag }
