import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { omit } from 'lodash-es'
import { parse } from 'yaml'

import {
  findPipeline,
  getContent,
  useCreateExecutionMutation,
  useListBranchesQuery,
  UsererrorError
} from '@harnessio/code-service-client'
import {
  getTransformers,
  IInputDefinition,
  outputTransformValues,
  RenderForm,
  RootForm,
  useZodValidationResolver
} from '@harnessio/forms'
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spacer
} from '@harnessio/ui/components'
import { inputComponentFactory, InputType } from '@harnessio/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { PipelineParams } from '../../pages-v2/pipeline/pipeline-edit/context/PipelineStudioDataProvider'
import { Inputs } from '../../types/pipeline-schema'
import { decodeGitContent, normalizeGitRef } from '../../utils/git-utils'
import { createFormFromPipelineInputs } from './utils/utils'

const ADDITIONAL_INPUTS_PREFIX = '_'

export interface RunPipelineFormProps {
  pipelineId?: string
  branch?: string
  open: boolean
  onClose: () => void
}

export default function RunPipelineForm({ pipelineId, branch, onClose, open }: RunPipelineFormProps) {
  const routes = useRoutes()
  const { spaceId, repoId, pipelineId: pipelineIdFromParams = '' } = useParams<PipelineParams>()
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
          onClose()
          navigate(
            routes.toPipelineExecution({
              spaceId,
              repoId,
              pipelineId: pipelineIdFromParams,
              executionId: response.body.number?.toString()
            })
          )
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
      <Alert.Container variant="destructive" className="my-8">
        <Alert.Description>{errorMessage}</Alert.Description>
      </Alert.Container>
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
      validateAfterFirstSubmit={true}
    >
      {rootForm => (
        <Dialog
          open={open}
          onOpenChange={open => {
            if (!open) onClose()
          }}
        >
          <DialogContent className="max-w-[500px] border-border bg-primary-background">
            <DialogHeader>
              <DialogTitle>Run Pipeline</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <Spacer size={6} />
              <RenderForm className="space-y-4" factory={inputComponentFactory} inputs={formDefinition} />
            </DialogDescription>
            <DialogFooter>
              <Button onClick={onClose} className="text-primary" variant="outline">
                Cancel
              </Button>
              <Button loading={isLoadingCreateExecution} onClick={() => rootForm.submitForm()}>
                Run pipeline
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </RootForm>
  )
}
