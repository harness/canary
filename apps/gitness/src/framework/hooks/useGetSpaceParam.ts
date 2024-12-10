import { useContext } from 'react'
import { useParams } from 'react-router-dom'

import type { PathParams } from '../../RouteDefinitions'
import { MFEContext } from '../context/MFEContext'

export function useGetSpaceURLParam(): string | undefined {
  const { spaceId } = useParams<PathParams>()
  const { scope: { accountId, orgIdentifier, projectIdentifier } = {} } = useContext(MFEContext)
  return spaceId || `${accountId}/${orgIdentifier}/${projectIdentifier}`
}
