export interface StepInputDefinitionType {
  type: string
  description?: string
  required: string
}

export interface StepDefinitionType {
  template: {
    inputs: Record<string, StepInputDefinitionType>
    step: unknown
  }
}
