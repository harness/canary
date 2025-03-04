import { useRouterContext } from '@/context'

const useActiveTab = (fallback: string): string => {
  const { useMatches } = useRouterContext()
  const matches = useMatches()
  return matches[matches.length - 1]?.pathname.split('/').pop() ?? fallback
}

export default useActiveTab
