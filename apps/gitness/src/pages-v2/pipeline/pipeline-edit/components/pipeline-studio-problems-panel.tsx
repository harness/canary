import { NoProblemsFound, Problems } from '@harnessio/ui/components'
import { useYamlEditorContext } from '@harnessio/yaml-editor'

import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'

export function PipelineStudioProblemsPanel(): JSX.Element {
  const {
    state: { problems }
  } = usePipelineDataContext()
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
