import { Button as BT } from '@harnessio/ui/components'

import './globalStyle.css'

export default function Button({ ...props }) {
  console.log('renderUrl', props)

  return <BT>test</BT>
}
