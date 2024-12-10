import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { membershipSpaces, TypesSpace } from '@harnessio/code-service-client'
import { LandingPageView } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'
import { useTranslationStore } from '../i18n/stores/i18n-store'

export const LandingPage = () => {
  const navigate = useNavigate()
  const { spaces, setSpaces } = useAppContext()

  useEffect(() => {
    if (spaces.length === 0) {
      membershipSpaces({
        queryParams: { page: 1, limit: 10, sort: 'identifier', order: 'asc' }
      })
        .then(({ body: memberships }) => {
          const spaceList = memberships.filter(item => item?.space).map(item => item.space as TypesSpace)
          setSpaces(spaceList)
        })
        .catch(_e => {
          // Ignore/toast error
          navigate('/signin')
        })
    }
  }, [])

  return <LandingPageView spaces={spaces} useTranslationStore={useTranslationStore} />
}
