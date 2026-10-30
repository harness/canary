import * as React from 'react'
import { LogoSymbol } from '@harnessio/ui'

const row = { display: 'flex', flexWrap: 'wrap', gap: 20, padding: 16 } as React.CSSProperties
const cell = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 96, fontSize: 11 } as React.CSSProperties

const names = ['github','gitlab','bitbucket','docker','kubernetes','terraform','helm','aws','azure','google','jenkins','circle-ci','slack','jira','data-dog','snyk','sonarqube','argo']

export function Gallery() {
  return (
    <div style={row}>
      {names.map(n => (
        <div key={n} style={cell}>
          <LogoSymbol name={n as any} size="lg" />
          <span>{n}</span>
        </div>
      ))}
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ ...row, alignItems: 'center' }}>
      {(['xs','sm','md','lg'] as const).map(s => (
        <div key={s} style={cell}>
          <LogoSymbol name="docker" size={s} />
          <span>{s}</span>
        </div>
      ))}
    </div>
  )
}
