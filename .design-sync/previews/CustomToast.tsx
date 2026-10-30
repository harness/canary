import * as React from 'react'
import { CustomToast } from '@harnessio/ui'

const wrap = { display: 'flex', flexDirection: 'column' as const, gap: 12, padding: 16, width: 420 }

export function Variants() {
  return (
    <div style={wrap}>
      <CustomToast toastId="1" variant="success" title="Pipeline succeeded" description="build-and-deploy finished in 4m 12s." />
      <CustomToast toastId="2" variant="danger" title="Deployment failed" description="Health check timed out on staging." />
      <CustomToast toastId="3" variant="info" title="Delegate updated" description="Version 25.10.1 is now running." />
    </div>
  )
}

export function WithActions() {
  return (
    <div style={wrap}>
      <CustomToast
        toastId="4"
        variant="danger"
        title="Execution #482 failed"
        description="Stage 'Deploy' exited with code 1."
        action={{ label: 'View logs', onClick: () => {} }}
        secondaryAction={{ label: 'Retry', onClick: () => {} }}
        closeButton
      />
    </div>
  )
}

export function Loading() {
  return (
    <div style={wrap}>
      <CustomToast toastId="5" variant="loading" title="Rolling out release" description="Deploying to 5 clusters..." />
    </div>
  )
}
