import { editor } from 'monaco-editor'
import { OpenapiGetContentOutput, TypesPipeline, TypesPlugin, TypesSignature } from '@harnessio/code-service-client'
import { Problem } from '@harnessio/playground'
import { YamlRevision } from '../PipelineStudioDataProvider'
import { InlineActionArgsType } from '../../utils/inline-actions'
import { YamlProblemSeverity } from '../../types/types'

export interface DataReducerState {
  /** isDirty is true if current pipeline in the editor is different from source pipeline loaded from api */
  isDirty: boolean
  /** isExistingPipeline is true if pipeline exist in the repo  */
  isExistingPipeline: boolean
  /** pipeline content API response */
  pipelineFileContent: OpenapiGetContentOutput | null
  /** pipeline content API fetching state*/
  fetchingPipelineFileContent: boolean
  /** decoded pipeline form API response */
  decodedPipeline?: string
  /** pipeline metadata API response */
  pipelineData?: TypesPipeline | null
  /** pipeline metadata API fetching state*/
  fetchingPipelineData: boolean
  /** isYamlValid is tru if there is no syntax or schema errors in the yaml */
  isYamlValid: boolean
  /** current yaml */
  yamlRevision: YamlRevision
  /** Add step intention */
  addStepIntention: AddStepIntentionActionPayload
  /** Edit step intention */
  editStepIntention: { path: string } | null
  /** Current definition from API (or created in ui for built in steps) */
  currentStepFormDefinition: TypesPlugin | null
  //
  latestCommitAuthor: TypesSignature | null
  //
  problems: Problem<editor.IMarker>[]
  problemsCount: Record<YamlProblemSeverity | 'all', number>
}

export enum DataActionName {
  UpdateState = 'Update state',
  SetYamlRevision = 'Set yaml revision',
  SetAddStepIntention = 'Set add step intention'
}

// yaml revision
export interface YamlRevisionAction {
  type: DataActionName.SetYamlRevision
  payload: YamlRevision
}

//  add step intention
export type AddStepIntentionActionPayload = {
  path: string
  position: InlineActionArgsType['position']
} | null

//  edit step intention
export type EditStepIntentionActionPayload = {
  path: string
} | null

export interface AddStepIntentionAction {
  type: DataActionName.SetAddStepIntention
  payload: AddStepIntentionActionPayload
}

export interface UpdateStateAction {
  type: DataActionName.UpdateState
  payload: Partial<DataReducerState>
}

export type DataActions = YamlRevisionAction | AddStepIntentionAction | UpdateStateAction
