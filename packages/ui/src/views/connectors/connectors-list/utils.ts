import { LogoName } from '@components/logo'

import { ConnectorConfigType } from '../types'

export const ConnectorTypeToLogoNameMap: Map<ConnectorConfigType, LogoName> = new Map([
  ['Github', 'github'],
  ['Gitlab', 'gitlab'],
  ['Bitbucket', 'bitbucket'],
  ['Jira', 'jira'],
  ['K8sCluster', 'kubernetes']
])
