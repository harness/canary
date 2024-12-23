import { stringify } from 'yaml'

import { findPipeline, getContent, OpenapiGetContentOutput, TypesPipeline } from '@harnessio/code-service-client'

import { DispatchFunc } from '../../../../../hooks/useThunkReducer'
import { decodeGitContent, normalizeGitRef } from '../../../../../utils/git-utils'
import { starterPipelineV1 } from '../../utils/pipelines'
import { deleteItemInArray, injectItemInArray, updateItemInArray } from '../../utils/yaml-utils'
import { YamlRevision } from '../PipelineStudioDataProvider'
import { AddStepIntentionActionPayload, DataActionName, DataActions, DataReducerState } from './types'

export const updateState = (payload: Partial<DataReducerState>): DataActions => {
  return { type: DataActionName.UpdateState, payload }
}

export const setYamlRevisionAction = ({
  yamlRevision
}: {
  yamlRevision: YamlRevision
}): ((dispatch: DispatchFunc<DataReducerState, DataActions>, getState: () => DataReducerState) => Promise<void>) => {
  return async (dispatch, getState) => {
    dispatch({ type: DataActionName.SetYamlRevision, payload: yamlRevision })
    dispatch(updateState({ isDirty: getState().decodedPipeline !== yamlRevision.yaml }))
  }
}

export const injectInArrayAction = ({
  injectData
}: {
  injectData: { path: string; position: 'after' | 'before' | 'in' | undefined; item: unknown }
}): ((dispatch: DispatchFunc<DataReducerState, DataActions>, getState: () => DataReducerState) => Promise<void>) => {
  return async (dispatch, getState) => {
    const yaml = injectItemInArray(getState().yamlRevision.yaml, injectData)
    dispatch(setYamlRevisionAction({ yamlRevision: { yaml: yaml } }))
  }
}

export const updateInArrayAction = ({
  injectData
}: {
  injectData: { path: string; item: unknown }
}): ((dispatch: DispatchFunc<DataReducerState, DataActions>, getState: () => DataReducerState) => Promise<void>) => {
  return async (dispatch, getState) => {
    const yaml = updateItemInArray(getState().yamlRevision.yaml, injectData)
    dispatch(setYamlRevisionAction({ yamlRevision: { yaml: yaml } }))
  }
}

export const deleteInArrayAction = ({
  deleteData
}: {
  deleteData: { path: string }
}): ((dispatch: DispatchFunc<DataReducerState, DataActions>, getState: () => DataReducerState) => Promise<void>) => {
  return async (dispatch, getState) => {
    const yaml = deleteItemInArray(getState().yamlRevision.yaml, deleteData)
    dispatch(setYamlRevisionAction({ yamlRevision: { yaml: yaml } }))
  }
}

export const setAddStepIntentionAction = ({
  addStepIntention
}: {
  addStepIntention: AddStepIntentionActionPayload
}): DataActions => {
  return { type: DataActionName.SetAddStepIntention, payload: addStepIntention }
}

export const loadPipelineAction = ({
  pipelineId,
  repoRef
}: {
  pipelineId: string
  repoRef: string
}): ((dispatch: DispatchFunc<DataReducerState, DataActions>, getState: () => DataReducerState) => Promise<void>) => {
  return async (dispatch, _getState) => {
    dispatch(updateState({ fetchingPipelineData: true }))
    let pipelineData: TypesPipeline | null = null
    try {
      const { body } = await findPipeline({ pipeline_identifier: pipelineId, repo_ref: repoRef })
      pipelineData = body
      dispatch(updateState({ pipelineData, currentBranch: pipelineData.default_branch }))
    } catch (_ex) {
      // TODO: process error
      return
    } finally {
      dispatch(updateState({ fetchingPipelineData: false }))
    }

    if (pipelineData.config_path && pipelineData.default_branch) {
      await dispatch(
        loadPipelineContentAction({
          branch: pipelineData.default_branch,
          repoRef
        })
      )
    }
  }
}

export const loadPipelineContentAction = ({
  repoRef,
  branch
}: {
  repoRef: string
  branch: string
}): ((dispatch: DispatchFunc<DataReducerState, DataActions>, getState: () => DataReducerState) => Promise<void>) => {
  return async (dispatch, getState) => {
    dispatch(updateState({ fetchingPipelineFileContent: true }))

    const path = getState().pipelineData?.config_path

    let pipelineFileContent: OpenapiGetContentOutput | null = null
    if (branch && path) {
      try {
        const { body } = await getContent({
          path,
          repo_ref: repoRef,
          queryParams: { git_ref: normalizeGitRef(branch), include_commit: true }
        })
        pipelineFileContent = body
      } catch (_ex) {
        // NOTE: if there is no file we threat as new pipeline
        dispatch(setYamlRevisionAction({ yamlRevision: { yaml: stringify(starterPipelineV1) } }))
        dispatch(updateState({ isExistingPipeline: false, isInitialized: true }))

        return
      } finally {
        dispatch(updateState({ fetchingPipelineFileContent: false }))
      }
    }

    const decodedPipelineYaml = decodeGitContent(pipelineFileContent?.content?.data)

    dispatch(setYamlRevisionAction({ yamlRevision: { yaml: decodedPipelineYaml } }))
    dispatch(
      updateState({
        decodedPipeline: decodedPipelineYaml,
        pipelineFileContent,
        isDirty: false,
        isExistingPipeline: true,
        isInitialized: true
      })
    )
  }
}
