import { IconPropsV2, IconV2 } from '@components/icon-v2'
import { LogoPropsV2, LogoV2 } from '@components/logo-v2'

import { ConnectorTypeToIconNameMap, ConnectorTypeToLogoNameMap } from '../connectors-list/utils'
import { ConnectorConfigType } from '../types'

interface ConnectorsLogoProps {
  type: ConnectorConfigType
  iconSize?: IconPropsV2['size']
  logoSize?: LogoPropsV2['size']
}

export const ConnectorsLogo = (props: ConnectorsLogoProps) => {
  const { type, iconSize = 'lg', logoSize = 'sm' } = props

  const logoName = ConnectorTypeToLogoNameMap.get(type)
  const iconName = ConnectorTypeToIconNameMap.get(type) ?? 'connectors'

  return logoName ? <LogoV2 name={logoName} size={logoSize} /> : <IconV2 name={iconName} size={iconSize} />
}
