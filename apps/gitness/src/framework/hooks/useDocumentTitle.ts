import { useEffect } from 'react'
import { useMatches } from 'react-router-dom'

import { CustomHandle } from '../routing/types'

const useDocumentTitle = () => {
  const matches = useMatches()

  useEffect(() => {
    const handle = matches[matches.length - 1]?.handle as CustomHandle | undefined // Find the current route's handle
    document.title = handle?.documentTitle?.(matches[matches.length - 1]?.params) ?? 'Harness Open Source'
  }, [matches])
}

export default useDocumentTitle
