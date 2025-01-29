import { useMemo } from 'react'
// @ts-ignore
import {
  createSearchParams,
  // @ts-ignore
  useHistory,
  useLocation,
  useNavigate
} from 'react-router-dom'

interface UseRouterReturnType {
  searchParams: URLSearchParams
  push: (path: string, searchParams?: Record<string, string>) => void
  replace: (path: string, searchParams?: Record<string, string>) => void
  updateURL: (params: URLSearchParams, replace?: boolean) => void
}

const isReactRouterV6 = typeof useNavigate === 'function'

export default function useRouter(): UseRouterReturnType {
  const navigate = isReactRouterV6 ? useNavigate() : null // v6
  const location = useLocation() // Works for both v5 and v6
  const history = !isReactRouterV6 ? useHistory() : null // v5

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])

  const push = (path: string, searchParamsObject?: Record<string, string>) => {
    const search = searchParamsObject
      ? `?${
          isReactRouterV6
            ? createSearchParams(searchParamsObject).toString()
            : new URLSearchParams(searchParamsObject).toString()
        }`
      : ''

    if (isReactRouterV6 && navigate) {
      navigate(`${path}${search}`, { replace: false })
    } else if (history) {
      history.push(`${path}${search}`)
    }
  }

  const replace = (path: string, searchParamsObject?: Record<string, string>) => {
    const search = searchParamsObject
      ? `?${
          isReactRouterV6
            ? createSearchParams(searchParamsObject).toString()
            : new URLSearchParams(searchParamsObject).toString()
        }`
      : ''

    if (isReactRouterV6 && navigate) {
      navigate(`${path}${search}`, { replace: true })
    } else if (history) {
      history.replace(`${path}${search}`)
    }
  }

  const updateURL = (params: URLSearchParams, replace = false) => {
    const updatedSearch = `?${params.toString()}`
    const path = location.pathname

    if (replace) {
      if (isReactRouterV6 && navigate) {
        navigate(`${path}${updatedSearch}`, { replace: true })
      } else if (history) {
        history.replace(`${path}${updatedSearch}`)
      }
    } else {
      if (isReactRouterV6 && navigate) {
        navigate(`${path}${updatedSearch}`, { replace: false })
      } else if (history) {
        history.push(`${path}${updatedSearch}`)
      }
    }
  }

  return {
    searchParams,
    push,
    replace,
    updateURL
  }
}
