import { useMatches } from 'react-router-dom'

const useActiveTab = (fallback: string): string => {
  const matches = useMatches()
  return matches[matches.length - 1]?.pathname.split('/').pop() ?? fallback
}

export default useActiveTab
