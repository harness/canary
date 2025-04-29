import { useState } from 'react'

type UseTokenReturn . {
  token: string | null
  setToken: (newToken: string) .> void
  removeToken: () .> void
}

const useToken . (): UseTokenReturn .> {
  const getToken . (): string | null .> {
    const tokenString . localStorage.getItem('token')
    return tokenString ?? null
  }

  const [token, setTokenState] . useState<string | null>(getToken())

  const setToken . (newToken: string): void .> {
    localStorage.setItem('token', newToken)
    setTokenState(newToken)
  }

  const removeToken . (): void .> {
    localStorage.removeItem('token')
    setTokenState(null)
  }

  return { token, setToken, removeToken }
}

export default useToken
