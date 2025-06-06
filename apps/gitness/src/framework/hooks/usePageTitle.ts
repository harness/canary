import { useEffect } from 'react'
import { useMatches } from 'react-router-dom'

import { useTranslation } from '@harnessio/ui/context'

import { CustomHandle } from '../routing/types'

const usePageTitle = () => {
  const { t } = useTranslation()
  const matches = useMatches()

  useEffect(() => {
    const fullPageTitle = matches
      .reduce<string[]>((titles, match) => {
        const { pageTitle } = (match.handle || {}) as CustomHandle
        if (typeof pageTitle === 'string') {
          titles.push(pageTitle)
        } else if (typeof pageTitle === 'function') {
          titles.push(pageTitle(match.params))
        }
        return titles
      }, [])
      .join(' | ')

    document.title = fullPageTitle || t('views:app.harnessOpenSource', 'Harness Open Source')
  }, [matches, t])
}

export default usePageTitle
