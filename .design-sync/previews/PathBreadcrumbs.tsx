import * as React from 'react'
import { PathBreadcrumbs } from '@harnessio/ui'

const items = [
  { path: 'src', parentPath: 'src' },
  { path: 'components', parentPath: 'src/components' },
  { path: 'button.tsx', parentPath: 'src/components/button.tsx' }
]

export function Default() {
  return <div style={{ width: 520, padding: 16 }}><PathBreadcrumbs items={items} isEdit={false} isNew={false} /></div>
}
export function Editing() {
  return <div style={{ width: 520, padding: 16 }}><PathBreadcrumbs items={items} isEdit isNew={false} fileName="button.tsx" gitRefName="main" parentPath="src/components" changeFileName={() => {}} handleOnBlur={() => {}} setParentPath={() => {}} /></div>
}
