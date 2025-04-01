import { InputReference } from '@views/platform'
import { InputReferenceProps } from '@views/platform/input-reference-component'

import { ConnectorItem } from '../types'

export const ConnectorInput = ({ ...props }: Omit<InputReferenceProps<ConnectorItem>, 'icon'>) => {
  return <InputReference<ConnectorItem> icon="connectors" {...props} />
}
