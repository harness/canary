import { useEffect } from 'react'
import { useMatches } from 'react-router-dom'

import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { CustomHandle } from '../routing/types'

const useDocumentTitle = () => {
  const { t } = useTranslationStore()
  const matches = useMatches()

  useEffect(() => {
    const currentMatch = matches.at(-1) // Get the last match
    if (currentMatch) {
      const { documentTitle } = (currentMatch?.handle || {}) as CustomHandle
      document.title = documentTitle?.(currentMatch.params) ?? t('views:app.harnessOpenSource', 'Harness Open Source')
    }
  }, [matches])
}

export default useDocumentTitle
