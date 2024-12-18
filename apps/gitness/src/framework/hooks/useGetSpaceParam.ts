import { useContext } from 'react'

// import { useParams } from 'react-router-dom'

import type { PathParams } from '../../RouteDefinitions'
import { MFEContext } from '../context/MFEContext'

export function useGetSpaceURLParam(): string | undefined {
  const {
    scope: { accountId, orgIdentifier, projectIdentifier },
    useParams
  } = useContext(MFEContext)

  const { spaceId } = useParams<PathParams>()

  // return spaceId || [accountId, orgIdentifier, projectIdentifier].filter(Boolean).join('/')
  return [accountId, orgIdentifier, projectIdentifier].filter(Boolean).join('/')
}
