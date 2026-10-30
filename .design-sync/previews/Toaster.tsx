import * as React from 'react'
import { Toaster, toast } from '@harnessio/ui'

function Fire({ kind }: { kind: 'success' | 'danger' | 'info' }) {
  React.useEffect(() => {
    const id = setTimeout(() => {
    if (kind === 'success') toast.success({ title: 'Pipeline succeeded', description: 'build-and-deploy #1284 finished in 4m 32s.', options: { duration: 600000 } })
    if (kind === 'danger') toast.danger({ title: 'Deployment failed', description: 'prod-us-east rejected release v2.14.0.', options: { duration: 600000 } })
    if (kind === 'info') toast.info({ title: 'Pull request merged', description: '#482 was merged into main.', options: { duration: 600000 } })
    }, 100)
    return () => clearTimeout(id)
  }, [kind])
  return (
    <div style={{ width: 480, height: 220, padding: 16, transform: "translateZ(0)", position: "relative" }}>
      <Toaster duration={600000} />
    </div>
  )
}

export function Success() {
  return <Fire kind="success" />
}
export function Danger() {
  return <Fire kind="danger" />
}
export function Info() {
  return <Fire kind="info" />
}
