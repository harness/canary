import { useEffect } from 'react'

import { useAppContext } from '../context/AppContext'
import useLocalStorage from './useLocalStorage'

export function useSelectedSpaceId(value?: string) {
  const { spaces } = useAppContext()
  const [spaceId, setSpaceId] = useLocalStorage('spaceId', value)

  useEffect(() => {
    if (value) {
      setSpaceId(value)
    }
  }, [value])

  const isSpaceIdValid = spaces.map(space => space.identifier).includes(spaceId)
  const selectedSpaceId = isSpaceIdValid ? spaceId : spaces[0]?.path

  return selectedSpaceId
}
