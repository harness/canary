import { MarkerSeverity as MarkerSeverityEnum, type editor, type MarkerSeverity } from 'monaco-editor'

import { Problem } from '@harnessio/views'

import { YamlProblemSeverity } from '../types/types'

const markerSeverity2ProblemSeverity = (severity: MarkerSeverity) => {
  switch (severity) {
    case MarkerSeverityEnum.Error:
      return YamlProblemSeverity.ERROR
    case MarkerSeverityEnum.Warning:
      return YamlProblemSeverity.WARNING
    case MarkerSeverityEnum.Hint:
    case MarkerSeverityEnum.Info:
      return YamlProblemSeverity.INFO
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

export function countProblems(problems: Problem[]): Record<YamlProblemSeverity | 'all', number> {
  const counter: Record<YamlProblemSeverity | 'all', number> = {
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
