import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useCodeEditorSelectionState() {
  const { hash } = useLocation()
  const navigate = useNavigate()
  const [selectedLine, setSelectedLineLocal] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!hash) {
      setSelectedLineLocal(undefined)
    } else if (hash.startsWith('#L')) {
      const lineStr = hash.replace('#L', '')
      const lineInt = parseInt(lineStr)
      setSelectedLineLocal(isNaN(lineInt) ? undefined : lineInt)
    }
  }, [hash, setSelectedLineLocal])

  const setSelectedLine = useCallback(
    (line: number | undefined) => {
      if (selectedLine !== line) {
        navigate({ hash: line ? `L${line}` : undefined }, { replace: true })
        setSelectedLineLocal(line)
      }
    },
    [navigate, selectedLine]
  )

  return { selectedLine, setSelectedLine }
}
