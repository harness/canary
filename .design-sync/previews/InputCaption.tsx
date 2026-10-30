import * as React from 'react'
import { InputCaption } from '@harnessio/ui'

const box = { display: 'flex', flexDirection: 'column', gap: 14, padding: 16 } as React.CSSProperties

export function Caption() { return <div style={box}><InputCaption caption="Lowercase letters, numbers and hyphens only." /></div> }
export function Error() { return <div style={box}><InputCaption error="A pipeline named build-and-test already exists." /></div> }
