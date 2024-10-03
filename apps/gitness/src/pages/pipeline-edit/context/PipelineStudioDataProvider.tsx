import React, { createContext, useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Skeleton } from '@harnessio/canary'
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
  setEditStepIntention: (props: { path: string }) => void
  clearEditStepIntention: () => void
  setCurrentStepFormDefinition: (data: TypesPlugin | null) => void
  fetchPipelineFileContent?: () => void
  requestYamlModifications: {
    injectInArray: (props: { path: string; position: 'last' | 'after' | 'before' | undefined; item: unknown }) => void
    updateInArray: (props: { path: string; item: unknown }) => void
    deleteInArray: (props: { path: string }) => void
  }
}

const PipelineStudioDataContext = createContext<PipelineStudioDataContextProps>({
  state: initialState,
  setYamlRevision: (_yamlRevision: YamlRevision) => undefined,
  setAddStepIntention: (_props: { path: string; position: InlineActionArgsType['position'] } | null) => undefined,
  clearAddStepIntention: () => undefined,
  setEditStepIntention: (_props: { path: string } | null) => undefined,
  clearEditStepIntention: () => undefined,
  setCurrentStepFormDefinition: (_data: TypesPlugin | null) => undefined,
  requestYamlModifications: {
    injectInArray: (_props: {
      path: string
      position: 'last' | 'after' | 'after' | 'before' | undefined
      item: unknown
    }) => undefined,
    updateInArray: (_props: { path: string; item: unknown }) => undefined,
    deleteInArray: (_props: { path: string }) => undefined
  }
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
    () => dispatch(loadPipelineAction({ pipelineId, repoRef })),
    [pipelineId, repoRef]
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

  if (state.fetchingPipelineData || state.fetchingPipelineFileContent) {
    // TODO: improve loading indicator
    return (
      <div className="flex flex-col flex-1 gap-2 px-4 py-3 h-full items-center justify-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-28" />
      </div>
    )
  }

  return (
    <PipelineStudioDataContext.Provider
      value={{
        state,
        setYamlRevision,
        setAddStepIntention,
        clearAddStepIntention,
        setEditStepIntention,
        clearEditStepIntention,
        setCurrentStepFormDefinition,
        fetchPipelineFileContent,
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
