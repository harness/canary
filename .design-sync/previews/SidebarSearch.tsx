import * as React from 'react'
import { SearchProvider, SidebarSearch } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ width: 240, padding: 16 }}>
      <SearchProvider>
        <SidebarSearch />
      </SearchProvider>
    </div>
  )
}
