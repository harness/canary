import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button, DropdownMenuItem, SplitButton } from '@harnessio/canary'
import { OpenapiCommitFilesRequest, useCommitFilesMutation } from '@harnessio/code-service-client'

import RunPipelineDialog from '../../run-pipeline-dialog/run-pipeline-dialog'
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
      <SplitButton
        disabled={disabled}
        size="sm"
        onClick={() => handleSave(true)}
        dropdown={<>&gt;</>}
        menu={
          <>
            <DropdownMenuItem onClick={() => handleSave(false)} disabled={disabled}>
              Save
            </DropdownMenuItem>
          </>
        }
      >
        Save and Run
      </SplitButton>
    )
  }

  return (
    <>
      <div className="absolute right-0 top-0 z-50 w-fit">
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
