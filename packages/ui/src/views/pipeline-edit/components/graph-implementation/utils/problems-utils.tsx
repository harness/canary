import type { Problem, ProblemSeverity } from '@components/problems'
import { MarkerSeverity as MarkerSeverityEnum, type editor, type MarkerSeverity } from 'monaco-editor'

const markerSeverity2ProblemSeverity = (severity: MarkerSeverity): ProblemSeverity => {
  switch (severity) {
    case MarkerSeverityEnum.Error:
      return 'error'
    case MarkerSeverityEnum.Warning:
      return 'warning'
    case MarkerSeverityEnum.Hint:
    case MarkerSeverityEnum.Info:
      return 'info'
  }
}

export function monacoMarkers2Problems(markers: editor.IMarker[]): Problem<editor.IMarker>[] {
  const problems: Problem<editor.IMarker>[] = markers.map(marker => {
    return {
      message: marker.message,
      position: {
        row: marker.startLineNumber,
        column: marker.startColumn
      },
      severity: markerSeverity2ProblemSeverity(marker.severity),
      data: marker
    }
  })

  return problems
}

export function countProblems(problems: Problem[]): Record<ProblemSeverity | 'all', number> {
  const counter: Record<ProblemSeverity | 'all', number> = {
    error: 0,
    warning: 0,
    info: 0,
    all: 0
  }

  problems.forEach(problem => {
    counter[problem.severity]++
    counter['all']++
  })

  return counter
}
