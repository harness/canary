import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppContext } from '../framework/context/AppContext'
import { TypesSpace, membershipSpaces } from '@harnessio/code-service-client'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { setSpaces } = useAppContext()

  useEffect(() => {
    membershipSpaces({
      queryParams: { page: 1, limit: 10, sort: 'identifier', order: 'asc' }
    })
      .then(({ body: memberships }) => {
        const spaceList = memberships.filter(item => item?.space).map(item => item.space as TypesSpace)
        setSpaces(spaceList)
        if (spaceList.length === 0) navigate('/spaces/create-project')
        if (spaceList?.[0]?.path) navigate(`/spaces/${spaceList[0].path}/repos`)
      })
      .catch(_e => {
        // Ignore/toast error
      })
  }, [])

  return null
}
