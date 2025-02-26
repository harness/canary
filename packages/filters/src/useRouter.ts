import { useMemo } from 'react'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'

interface UseRouterReturnType {
  searchParams: URLSearchParams
  push: (path: string, searchParams?: Record<string, string>) => void
  replace: (path: string, searchParams?: Record<string, string>) => void
  updateURL: (params: URLSearchParams, replace?: boolean) => void
}

export default function useRouter(): UseRouterReturnType {
  const navigate = useNavigate() // v6
  const location = useLocation() // Works for both v5 and v6

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])

  const push = (path: string, searchParamsObject?: Record<string, string>) => {
    const search = searchParamsObject ? `?${createSearchParams(searchParamsObject).toString()}` : ''

    navigate(`${path}${search}`, { replace: false })
  }

  const replace = (path: string, searchParamsObject?: Record<string, string>) => {
    const search = searchParamsObject ? `?${createSearchParams(searchParamsObject).toString()}` : ''

    navigate(`${path}${search}`, { replace: true })
  }

  const updateURL = (params: URLSearchParams, replace = false) => {
    const updatedSearch = `?${params.toString()}`
    const path = location.pathname

    if (replace) {
      navigate(`${path}${updatedSearch}`, { replace: true })
    } else {
      navigate(`${path}${updatedSearch}`, { replace: false })
    }
  }

  return {
    searchParams,
    push,
    replace,
    updateURL
  }
}
