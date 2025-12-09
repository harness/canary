import type { Message, MessageContent } from './message'

export type CapabilityStatus =
  | { type: 'queued' }
  | { type: 'running' }
  | { type: 'complete'; result?: any }
  | { type: 'error'; error: string }
  | { type: 'cancelled' }

export interface CapabilityExecutionContext {
  messageId: string
  capabilityId: string
}

export interface CapabilityExecution<TArgs = any, TResult = any> {
  id: string
  name: string
  args: TArgs
  status: CapabilityStatus
  result?: TResult
  error?: string
  timestamp: number
  messageId: string
}

export interface CapabilityHandler<TArgs = any, TResult = any> {
  execute: (args: TArgs, context: CapabilityExecutionContext) => Promise<TResult> | TResult
}

export interface CapabilityRendererProps<TArgs = any, TResult = any> {
  capabilityName: string
  capabilityId: string
  args: TArgs
  result?: TResult
  status: CapabilityStatus
  message: Message
}

export interface CapabilityRenderer<TArgs = any, TResult = any> {
  component: React.ComponentType<CapabilityRendererProps<TArgs, TResult>>
}

export interface CapabilityConfig<TArgs = any, TResult = any> {
  name: string
  execute?: (args: TArgs, context: CapabilityExecutionContext) => Promise<TResult> | TResult
  render?: React.ComponentType<CapabilityRendererProps<TArgs, TResult>>
}

export interface CapabilityContent extends MessageContent {
  type: 'capability'
  capabilityId: string
  capabilityName: string
  args: any
}
