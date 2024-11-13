import { useEffect, useState } from 'react'
import { parse } from 'yaml'
import { omit } from 'lodash-es'
import { inputComponentFactory, InputType } from '@harnessio/views'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Spacer,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Alert,
  AlertDescription
} from '@harnessio/canary'
import {
  IInputDefinition,
  RenderForm,
  RootForm,
  getTransformers,
  outputTransformValues,
  useZodValidationResolver
} from '@harnessio/forms'
import {
  findPipeline,
  getContent,
  useCreateExecutionMutation,
  useListBranchesQuery,
  UsererrorError
} from '@harnessio/code-service-client'
import { PipelineParams } from '../pipeline-edit/context/PipelineStudioDataProvider'
import { decodeGitContent, normalizeGitRef } from '../../utils/git-utils'
import { createFormFromPipelineInputs } from './utils/utils'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { Inputs } from '../../types/pipeline-schema'

const ADDITIONAL_INPUTS_PREFIX = '_'

export interface RunPipelineFormProps {
  pipelineId?: string
  branch?: string
  toExecutions: string
}

export default function RunPipelineForm({
  pipelineId,
  branch,
  toExecutions,
  requestClose
}: RunPipelineFormProps & { requestClose: () => void }) {
  const { pipelineId: pipelineIdFromParams = '' } = useParams<PipelineParams>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [pipeline, setPipeline] = useState<Record<string, unknown>>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const repoRef = useGetRepoRef()
  const { data: branches, isLoading: listBranchesLoading } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: {}
  })

  useEffect(() => {
    findPipeline({ pipeline_identifier: pipelineId ?? pipelineIdFromParams, repo_ref: repoRef })
      .then(
        ({ body: pipelineData }) => {
          getContent({
            path: pipelineData?.config_path ?? '',
            repo_ref: repoRef,
            queryParams: {
              git_ref: normalizeGitRef(branch ?? pipelineData?.default_branch) ?? '',
              include_commit: true
            }
          })
            .then(
              ({ body: pipelineFileContent }) => {
                try {
                  const pipelineObj = parse(decodeGitContent(pipelineFileContent?.content?.data))
                  setPipeline(pipelineObj)
                } catch (ex: unknown) {
                  setErrorMessage((ex as UsererrorError)?.message || null)
                }
              },
              ex => {
                setErrorMessage(ex.message)
              }
            )
            .finally(() => {
              setLoading(false)
            })
        },
        ex => {
          setErrorMessage(ex.message)
        }
      )
      .finally(() => {
        setLoading(false)
      })
  }, [pipelineId, repoRef])

  const formDefinition = createFormFromPipelineInputs(pipeline)
  const autoFocusPath = formDefinition.inputs?.[0]?.path

  const additionalInput: IInputDefinition[] = [
    {
      label: 'Branch',
      inputType: InputType.select,
      path: `${ADDITIONAL_INPUTS_PREFIX}.branch`,
      inputConfig: {
        options: branches?.body?.map(branchItem => ({ label: branchItem?.name, value: branchItem?.name }))
      }
    },
    ...(formDefinition.inputs.length > 0 ? [{ inputType: InputType.separator, path: '' }] : [])
  ]
  formDefinition.inputs = [...additionalInput, ...formDefinition.inputs]

  const resolver = useZodValidationResolver(formDefinition)

  const { mutateAsync: createExecutionAsync, isLoading: isLoadingCreateExecution } = useCreateExecutionMutation({})

  const runPipeline = ({ branch, inputsValues }: { branch: string; inputsValues: Inputs }) => {
    createExecutionAsync({
      pipeline_identifier: pipelineId ?? '',
      repo_ref: repoRef,
      queryParams: { branch: branch },
      body: inputsValues
    })
      .then(
        response => {
          requestClose()
          const executionId = response.body.number
          navigate(`${toExecutions}/${executionId}`)
        },
        ex => {
          setErrorMessage(ex.message)
        }
      )
      .finally(() => {
        setLoading(false)
      })
  }

  if (errorMessage) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    )
  }

  if (loading || listBranchesLoading) {
    // TODO
    return 'Loading...'
  }

  return (
    <RootForm
      defaultValues={{ _: { branch } }}
      resolver={resolver}
      mode="onSubmit"
      autoFocusPath={autoFocusPath}
      onSubmit={values => {
        const transformers = getTransformers(formDefinition)
        const transformedValues = outputTransformValues(values, transformers)

        const branch = transformedValues._.branch
        const inputsValues = omit(transformedValues, '_')

        runPipeline({ branch, inputsValues })
      }}
      validateAfterFirstSubmit={true}>
      {rootForm => (
        <>
          <DialogHeader>
            <DialogTitle>Run Pipeline</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Spacer size={6} />
            <RenderForm className="space-y-4" factory={inputComponentFactory} inputs={formDefinition} />
          </DialogDescription>
          <DialogFooter>
            <Button onClick={requestClose} className="text-primary" variant="outline">
              Cancel
            </Button>
            <Button loading={isLoadingCreateExecution} onClick={() => rootForm.submitForm()}>
              Run pipeline
            </Button>
          </DialogFooter>
        </>
      )}
    </RootForm>
  )
}
