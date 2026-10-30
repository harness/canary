import * as React from 'react'
import { Illustration } from '@harnessio/ui'

const row = { display: 'flex', flexWrap: 'wrap', gap: 24, padding: 16 } as React.CSSProperties
const cell = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 120, fontSize: 11 } as React.CSSProperties

const empty = ['no-data-pipeline','no-data-pr','no-data-branches','no-data-commits','no-data-secrets','no-data-webhooks','no-data-members','no-data-error','no-data-tags','no-repository','no-data-metrics','no-search-magnifying-glass']

export function EmptyStates() {
  return (
    <div style={row}>
      {empty.map(n => (
        <div key={n} style={cell}>
          <Illustration name={n as any} size={96} />
          <span>{n}</span>
        </div>
      ))}
    </div>
  )
}

export function Vulnerability() {
  return (
    <div style={row}>
      {['info','low','medium','high','critical'].map(s => (
        <div key={s} style={cell}>
          <Illustration name={`vulnerability-${s}` as any} size={64} />
          <span>{s}</span>
        </div>
      ))}
    </div>
  )
}

export function Large() {
  return (
    <div style={row}>
      <Illustration name={'no-data-pipeline' as any} size={200} />
    </div>
  )
}
