import { useEffect } from 'react'

import { NavbarItemType } from '@/components'
import { useRouterContext } from '@/context'

export const useLocationChange = ({
  items,
  onRouteChange
}: {
  items: NavbarItemType[]
  onRouteChange: (item: NavbarItemType) => void
}) => {
  const { location } = useRouterContext()
  useEffect(() => {
    const matchedItem = items.find(item => item.to === location.pathname)
    if (matchedItem) {
      onRouteChange(matchedItem)
    }
  }, [location])
}
