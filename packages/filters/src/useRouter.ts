import { useMemo } from 'react'

// @ts-ignore
import { useHistory, useLocation as useLocationV5 } from 'react-router-dom'

// remove ts-ignore once the package is created.
// @ts-ignore
import { useNavigate, useLocation as useLocationV6, createSearchParams } from 'react-router-dom'

interface UseRouterReturnType {
  searchParams: URLSearchParams
  push: (path: string, searchParams?: Record<string, string>) => void
  replace: (path: string, searchParams?: Record<string, string>) => void
  updateURL: (params: URLSearchParams, replace?: boolean) => void
}

const isReactRouterV6 = true

export default function useRouter(): UseRouterReturnType {
  const navigate = useNavigate() // v6
  const locationV6 = useLocationV6() // v6
  const history = {} // v5
  const locationV5 = {} // v5

  const searchParams = useMemo(
    () => new URLSearchParams(isReactRouterV6 ? locationV6?.search : locationV5?.search),
    [locationV6?.search, locationV5?.search]
  )

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
    const path = isReactRouterV6 ? locationV6?.pathname : locationV5?.pathname

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
