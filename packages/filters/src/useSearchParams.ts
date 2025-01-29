import { useEffect, useState } from 'react'

export default function useSearchParams() {
  const [searchParams, setSearchParams] = useState(() => {
    if (typeof location === 'undefined') {
      return new URLSearchParams()
    }
    return new URLSearchParams(location.search)
  })

  useEffect(() => {
    const onPopState = () => {
      setSearchParams(new URLSearchParams(location.search))
    }

    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  return {
    searchParams
  }
}
