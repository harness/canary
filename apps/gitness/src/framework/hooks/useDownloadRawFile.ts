import { useCallback } from 'react'

import { useMutation } from '@tanstack/react-query'

import { useIsMFE } from './useIsMFE'

interface UseDownloadRawFileParams {
  repoRef: string
  resourcePath: string
  gitRef: string
  filename?: string
}

export function useDownloadRawFile() {
  const isMFE = useIsMFE()
  const mutation = useMutation(async ({ repoRef, resourcePath, gitRef }: UseDownloadRawFileParams) => {
    const url = `${isMFE ? '/code' : ''}/api/v1/repos/${repoRef}/raw/${resourcePath}?git_ref=${gitRef ?? ''}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error fetching file: ${response.statusText}`)
    }
    return response.blob()
  })

  const downloadFile = useCallback(
    async ({ repoRef, resourcePath, gitRef, filename = 'download' }: UseDownloadRawFileParams) => {
      try {
        const blob = await mutation.mutateAsync({ repoRef, resourcePath, gitRef })
        const downloadUrl = URL.createObjectURL(blob)

        const anchor = document.createElement('a')
        anchor.href = downloadUrl
        anchor.download = filename

        document.body.appendChild(anchor)
        anchor.click()
        setTimeout(() => {
          document.body.removeChild(anchor)
          URL.revokeObjectURL(downloadUrl)
        }, 100)
      } catch (error) {
        console.log(error)
      }
    },
    [mutation]
  )

  return downloadFile
}
