import * as React from 'react'
import { IconV2 } from '@harnessio/ui'

const row = { display: 'flex', flexWrap: 'wrap', gap: 20, padding: 16 } as React.CSSProperties
const cell = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 96, fontSize: 11 } as React.CSSProperties

const names = ['git-branch','git-merge','git-pull-request','git-commit','pipeline','deploy','repository','settings','play','clock','check-circle','warning-triangle','xmark-circle','key','lock','terminal','database','cloud','bug','bell']

export function Gallery() {
  return (
    <div style={row}>
      {names.map(n => (
        <div key={n} style={cell}>
          <IconV2 name={n as any} size="lg" />
          <span>{n}</span>
        </div>
      ))}
    </div>
  )
}

export function Colors() {
  return (
    <div style={row}>
      {(['inherit','success','danger','warning','info','merged','neutral','risk'] as const).map(c => (
        <div key={c} style={cell}>
          <IconV2 name="git-merge" size="lg" color={c} />
          <span>{c}</span>
        </div>
      ))}
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{ ...row, alignItems: 'center' }}>
      {(['xs','sm','md','lg','xl'] as const).map(s => (
        <div key={s} style={cell}>
          <IconV2 name="pipeline" size={s} />
          <span>{s}</span>
        </div>
      ))}
    </div>
  )
}
