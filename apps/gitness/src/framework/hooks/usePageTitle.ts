import { useEffect } from 'react'
import { useMatches } from 'react-router-dom'

import { useTranslation } from '@harnessio/ui/context'

import { usePageTitleContext } from '../context/PageTitleContext'
import { CustomHandle } from '../routing/types'

const usePageTitle = () => {
  const { t } = useTranslation()
  const matches = useMatches()
  const { pageTitle: dynamicTitle } = usePageTitleContext()

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

    document.title = dynamicTitle || fullPageTitle || t('views:app.harnessOpenSource', 'Harness Open Source')
  }, [matches, t, dynamicTitle])
}

export default usePageTitle
