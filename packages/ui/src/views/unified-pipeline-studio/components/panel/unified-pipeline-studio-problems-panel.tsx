import { NoProblemsFound, Problems } from '@components/index'

import { useYamlEditorContext } from '@harnessio/yaml-editor'

export function UnifiedPipelineStudioProblemsPanel({ problems }: { problems: any }): JSX.Element {
  const { updateCursorPosition } = useYamlEditorContext()

  return problems.length === 0 ? (
    <NoProblemsFound />
  ) : (
    <Problems
      problems={problems}
      onClick={problem => {
        if (problem.position.row && problem.position.column) {
          updateCursorPosition({
            lineNumber: problem.position.row,
            column: problem.position.column
          })
        }
      }}
    />
  )
}
