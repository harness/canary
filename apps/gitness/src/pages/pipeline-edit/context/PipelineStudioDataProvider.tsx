import React, { createContext, useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useYamlEditorContext } from '@harnessio/yaml-editor'
import { countProblems, monacoMarkers2Problems } from '../utils/problems-utils'
import type { InlineActionArgsType } from '../utils/inline-actions'
import { TypesPlugin } from '../types/api-types'
import useThunkReducer from '../../../hooks/useThunkReducer'
import { DataReducer, initialState } from './data-store/reducer'
import {
  deleteInArrayAction,
  injectInArrayAction,
  loadPipelineAction,
  loadPipelineContentAction,
  setYamlRevisionAction,
  updateInArrayAction,
  updateState
} from './data-store/actions'
import { AddStepIntentionActionPayload, DataReducerState, EditStepIntentionActionPayload } from './data-store/types'

// TODO: temp interface for params
export interface PipelineParams extends Record<string, string> {
  spaceId: string
  repoId: string
  pipelineId: string
}

export const NEW_PIPELINE_IDENTIFIER = '-1'

export interface YamlRevision {
  yaml: string
  revisionId?: number
}

interface PipelineStudioDataContextProps {
  state: DataReducerState
  setYamlRevision: (yamlRevision: YamlRevision) => void
  setAddStepIntention: (props: { path: string; position: InlineActionArgsType['position'] }) => void
  clearAddStepIntention: () => void
  // editStepIntention?: EditStepIntentionActionPayload
  setEditStepIntention: (props: { path: string }) => void
  clearEditStepIntention: () => void
  setCurrentStepFormDefinition: (data: TypesPlugin | null) => void
  fetchPipelineFileContent: (branch: string) => void
  requestYamlModifications: {
    injectInArray: (props: { path: string; position: 'last' | 'after' | 'before' | undefined; item: unknown }) => void
    updateInArray: (props: { path: string; item: unknown }) => void
    deleteInArray: (props: { path: string }) => void
  }
  setCurrentBranch: (branch: string) => void
}

const PipelineStudioDataContext = createContext<PipelineStudioDataContextProps>({
  state: initialState,
  setYamlRevision: (_yamlRevision: YamlRevision) => undefined,
  setAddStepIntention: (_props: { path: string; position: InlineActionArgsType['position'] } | null) => undefined,
  clearAddStepIntention: () => undefined,
  // editStepIntention: null,
  setEditStepIntention: (_props: { path: string } | null) => undefined,
  clearEditStepIntention: () => undefined,
  setCurrentStepFormDefinition: (_data: TypesPlugin | null) => undefined,
  fetchPipelineFileContent: (_branch: string) => undefined,
  requestYamlModifications: {
    injectInArray: (_props: {
      path: string
      position: 'last' | 'after' | 'after' | 'before' | undefined
      item: unknown
    }) => undefined,
    updateInArray: (_props: { path: string; item: unknown }) => undefined,
    deleteInArray: (_props: { path: string }) => undefined
  },
  setCurrentBranch: (_branch: string) => undefined
})

const PipelineStudioDataProvider = ({ children }: React.PropsWithChildren) => {
  // TODO: PipelineParams is used temporary
  const { pipelineId = '', repoId, spaceId } = useParams<PipelineParams>()
  const repoRef = useMemo(() => `${spaceId}/${repoId}/+`, [spaceId, repoId])

  const [state, dispatch] = useThunkReducer(DataReducer, initialState)

  const { markers } = useYamlEditorContext()

  useEffect(() => {
    dispatch(loadPipelineAction({ pipelineId, repoRef }))
  }, [pipelineId, repoRef])

  useEffect(() => {
    const problems = monacoMarkers2Problems(markers)
    const problemsCount = countProblems(problems)
    const isYamlValid = problemsCount.error === 0

    dispatch(updateState({ problems, problemsCount, isYamlValid }))
  }, [markers])

  const setYamlRevision = useCallback(
    (yamlRevision: YamlRevision) => dispatch(setYamlRevisionAction({ yamlRevision })),
    []
  )

  const fetchPipelineFileContent = useCallback(
    (branch: string) => dispatch(loadPipelineContentAction({ branch, repoRef })),
    [repoRef]
  )

  const setAddStepIntention = useCallback(
    (addStepIntention: AddStepIntentionActionPayload) => dispatch(updateState({ addStepIntention })),
    []
  )
  const clearAddStepIntention = useCallback(() => dispatch(updateState({ addStepIntention: undefined })), [])

  const setEditStepIntention = useCallback(
    (editStepIntention: EditStepIntentionActionPayload) => dispatch(updateState({ editStepIntention })),
    []
  )
  const clearEditStepIntention = useCallback(() => dispatch(updateState({ editStepIntention: undefined })), [])

  const setCurrentStepFormDefinition = useCallback(
    (currentStepFormDefinition: TypesPlugin | null) => dispatch(updateState({ currentStepFormDefinition })),
    []
  )

  const injectInArray = useCallback(
    (injectData: { path: string; position: 'after' | 'before' | 'last' | undefined; item: unknown }) => {
      dispatch(injectInArrayAction({ injectData }))
    },
    []
  )

  const updateInArray = useCallback((injectData: { path: string; item: unknown }) => {
    dispatch(updateInArrayAction({ injectData }))
  }, [])

  const deleteInArray = useCallback((deleteData: { path: string }) => {
    dispatch(deleteInArrayAction({ deleteData }))
  }, [])

  const requestYamlModifications = useMemo(
    () => ({
      injectInArray,
      deleteInArray,
      updateInArray
    }),
    [injectInArray, deleteInArray, updateInArray]
  )

  const setCurrentBranch = (branch: string) => {
    dispatch(updateState({ currentBranch: branch }))
    dispatch(loadPipelineContentAction({ branch, repoRef }))
  }

  return (
    <PipelineStudioDataContext.Provider
      value={{
        state,
        setYamlRevision,
        setAddStepIntention,
        clearAddStepIntention,
        // editStepIntention: state.editStepIntention,
        setEditStepIntention,
        clearEditStepIntention,
        setCurrentStepFormDefinition,
        fetchPipelineFileContent,
        setCurrentBranch,
        //
        requestYamlModifications
      }}>
      {children}
    </PipelineStudioDataContext.Provider>
  )
}

export default PipelineStudioDataProvider

export const usePipelineDataContext = () => {
  return React.useContext(PipelineStudioDataContext)
}
