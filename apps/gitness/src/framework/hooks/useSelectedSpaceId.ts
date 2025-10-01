import { useEffect } from 'react'

import { useLocalStorage, UserPreference } from '@harnessio/ui/hooks'

import { useAppContext } from '../context/AppContext'

export function useSelectedSpaceId(value?: string) {
  const { spaces } = useAppContext()
  const [spaceId, setSpaceId] = useLocalStorage(UserPreference.SPACE_ID, value)

  useEffect(() => {
    if (value) {
      setSpaceId(value)
    }
  }, [value])

  const isSpaceIdValid = spaces.map(space => space.identifier).includes(spaceId)
  const selectedSpaceId = isSpaceIdValid ? spaceId : spaces[0]?.path

  return selectedSpaceId
}
