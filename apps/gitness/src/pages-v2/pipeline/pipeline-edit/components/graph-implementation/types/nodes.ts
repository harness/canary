export enum YamlEntityType {
  Step = 'Step',
  Stage = 'Stage',
  ParallelGroup = 'ParallelGroup',
  SerialGroup = 'SerialGroup',
  StepSerialGroup = 'StepSerialGroup',
  StepParallelGroup = 'StepParallelGroup'
}

export interface CommonNodeDataType {
  yamlPath: string
  yamlChildrenPath?: string
  name: string
  yamlEntityType: YamlEntityType
}
