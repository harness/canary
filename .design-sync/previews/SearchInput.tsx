import * as React from 'react'
import { SearchInput } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ width: 360, padding: 16 }}>
      <SearchInput placeholder="Search pipelines" />
    </div>
  )
}

export function WithValue() {
  return (
    <div style={{ width: 360, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SearchInput searchValue="deploy-api" onChange={() => {}} />
      <SearchInput size="sm" searchValue="main" counter="3 of 12" showPrevNextButtons onChange={() => {}} />
    </div>
  )
}

export function Themes() {
  return (
    <div style={{ width: 360, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SearchInput theme="danger" searchValue="[invalid" onChange={() => {}} />
      <SearchInput theme="warning" searchValue="*" onChange={() => {}} />
      <SearchInput theme="success" searchValue="release/*" onChange={() => {}} />
    </div>
  )
}
