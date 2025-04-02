import { Icon } from '@components/icon'
import { Logo } from '@components/logo/logo'
import { SimpleIcon } from 'simple-icons'

import { ConnectorConfigType } from './types'

export const mapConnectorTypeToLogoName = (type: ConnectorConfigType): string | undefined => {
  switch (type) {
    case 'Github':
      return 'github'
    case 'Gitlab':
      return 'gitlab'
    case 'Bitbucket':
      return 'bitbucket'
    case 'Jira':
      return 'jira'
    case 'K8sCluster':
      return 'kubernetes'
    default:
      return undefined
  }
}

export const getConnectorLogo = (connectorType: ConnectorConfigType): SimpleIcon | React.ReactNode => {
  const logoName = mapConnectorTypeToLogoName(connectorType)
  if (!logoName) return <Icon name="connectors" size={32} />
  return <Logo name={logoName} size={32} />
}
