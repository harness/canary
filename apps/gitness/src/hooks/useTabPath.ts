import { useState } from 'react'
import { useMatch } from 'react-router-dom'

export function useTabPath(basePath: string, getGitRefPath?: () => string) {
  const [path, setPath] = useState(getGitRefPath?.() || basePath)
  const isMatch = useMatch({ path: `${basePath}/*` })
  return [path, setPath, isMatch, getGitRefPath?.() || basePath] as const
}
