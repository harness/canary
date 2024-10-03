import { DataActionName, DataActions, DataReducerState } from './types'

export const initialState: DataReducerState = {
  isDirty: false,
  isExistingPipeline: false,
  //
  /** pipeline from API */
  pipelineFileContent: null,
  fetchingPipelineFileContent: false,
  /** pipeline content from API */
  pipelineData: null,
  fetchingPipelineData: false,
  //
  isYamlValid: true,
  yamlRevision: { yaml: '' },
  //
  addStepIntention: null,
  editStepIntention: null,
  //
  currentStepFormDefinition: null,
  //
  latestCommitAuthor: null,
  //
  problems: [],
  problemsCount: 0
}

export const DataReducer = (state = initialState, data: DataActions): DataReducerState => {
  const { type, payload } = data
  switch (type) {
    case DataActionName.UpdateState:
      return {
        ...state,
        ...payload
      }
    case DataActionName.SetYamlRevision:
      return {
        ...state,
        yamlRevision: payload
      }
    case DataActionName.SetAddStepIntention:
      return {
        ...state,
        addStepIntention: payload
      }
  }
  return state
}
