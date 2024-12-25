import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '@harnessio/canary'
import { OpenapiCommitFilesRequest, useCommitFilesMutation } from '@harnessio/code-service-client'

import RunPipelineDialog from '../../../../pages/run-pipeline-dialog/run-pipeline-dialog'
import { PipelineParams, usePipelineDataContext } from '../context/PipelineStudioDataProvider'

const PipelineStudioHeaderActions = (): JSX.Element => {
  const {
    state: {
      pipelineData,
      pipelineFileContent,
      fetchingPipelineFileContent,
      isInitialized,
      yamlRevision,
      isExistingPipeline,
      isDirty,
      currentBranch
    },
    fetchPipelineFileContent
  } = usePipelineDataContext()

  const [openRunPipeline, setOpenRunPipeline] = useState(false)

  const { repoId, spaceId } = useParams<PipelineParams>()
  const repoRef = `${spaceId}/${repoId}/+`

  const { mutateAsync: commitAsync } = useCommitFilesMutation({})

  const handleSave = (execute = false): void => {
    const data: OpenapiCommitFilesRequest = {
      actions: [
        {
          action: isExistingPipeline ? 'UPDATE' : 'CREATE',
          path: pipelineData?.config_path,
          payload: yamlRevision.yaml,
          sha: isExistingPipeline ? pipelineFileContent?.sha : ''
        }
      ],
      branch: currentBranch,
      title: `${isExistingPipeline ? 'Updated' : 'Created'} pipeline ${pipelineData?.identifier}`, // TODO: check if pl is saved before edit
      message: ''
    }

    commitAsync({ repo_ref: repoRef, body: data })
      .then(() => {
        fetchPipelineFileContent(currentBranch)

        if (execute) {
          setOpenRunPipeline(true)
        }
        // TODO: toast
      })
      .catch(error => {
        console.error(error)
        // TODO: error
      })
  }

  const handleRun = (): void => {
    setOpenRunPipeline(true)
  }

  const renderActionButton = ({ disabled = false }: { disabled?: boolean }) => {
    return !isDirty ? (
      <Button size="sm" onClick={handleRun} disabled={disabled}>
        Run
      </Button>
    ) : (
      <>
        <Button size="sm" onClick={() => handleSave(false)} disabled={disabled}>
          Save
        </Button>
        <Button size="sm" onClick={() => handleSave(true)} disabled={disabled}>
          Save and Run
        </Button>
      </>
    )
  }

  return (
    <>
      <div className="absolute right-0 top-0 z-50 flex h-[55px] w-fit items-center">
        <div className="flex h-14 items-center gap-x-3 px-4">
          {/* <Button variant="ghost" size="sm" disabled={!isInitialized || fetchingPipelineFileContent}>
            Settings
          </Button> */}
          {renderActionButton({ disabled: !isInitialized || fetchingPipelineFileContent })}
        </div>
      </div>
      <RunPipelineDialog
        open={openRunPipeline}
        onClose={() => {
          setOpenRunPipeline(false)
        }}
        pipelineId={pipelineData?.identifier}
        branch={currentBranch}
        toExecutions={'../executions'}
      />
    </>
  )
}

export default PipelineStudioHeaderActions
