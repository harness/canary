import * as React from 'react'
import { FileUpload } from '@harnessio/ui'

export function Empty() {
  const [file, setFile] = React.useState<File | undefined>()
  return (
    <div style={{ width: 460, padding: 16 }}>
      <FileUpload selectedFile={file} onFileChange={setFile} accept=".yaml,.yml" />
    </div>
  )
}

export function Selected() {
  const [file, setFile] = React.useState<File | undefined>(
    new File(['pipeline: {}\n'.repeat(120)], 'build-and-deploy.yaml', { type: 'text/yaml' })
  )
  return (
    <div style={{ width: 460, padding: 16 }}>
      <FileUpload selectedFile={file} onFileChange={setFile} accept=".yaml,.yml" />
    </div>
  )
}

export function WithError() {
  return (
    <div style={{ width: 460, padding: 16 }}>
      <FileUpload onFileChange={() => {}} error="File must be a YAML document under 1 MB." />
    </div>
  )
}
