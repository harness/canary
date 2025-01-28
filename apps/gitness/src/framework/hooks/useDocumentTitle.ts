import { useEffect } from 'react'
import { useMatches } from 'react-router-dom'

import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { CustomHandle } from '../routing/types'

const useDocumentTitle = () => {
  const { t } = useTranslationStore()
  const matches = useMatches()

  useEffect(() => {
    const fullPageTitle = matches
      .map(match => {
        const handle = (match.handle || {}) as CustomHandle
        return handle?.pageTitle?.(match.params)
      })
      .filter(Boolean)
      .join(' | ')

    document.title = fullPageTitle || t('views:app.harnessOpenSource', 'Harness Open Source')
  }, [matches, t])
}

export default useDocumentTitle
