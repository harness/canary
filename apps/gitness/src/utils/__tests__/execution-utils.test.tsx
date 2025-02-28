import { EnumCiStatus, TypesExecution } from '@harnessio/code-service-client'
import { MeterState } from '@harnessio/ui/components'
import { PipelineExecutionStatus } from '@harnessio/ui/views'

import { getExecutionStatus, getLabel, getMeterState } from '../execution-utils'

describe('getLabel', () => {
  it('should return empty string for missing author_name or event', () => {
    const baseExecution: TypesExecution = {
      number: 1,
      status: 'success' as EnumCiStatus,
      created: 0,
      updated: 0,
      started: 0,
      finished: 0
    }

    expect(getLabel({ ...baseExecution, author_name: '', event: undefined })).toBe('')
    expect(getLabel({ ...baseExecution, author_name: 'test', event: undefined })).toBe('')
    expect(getLabel({ ...baseExecution, author_name: '', event: 'manual' })).toBe('')
  })

  it('should handle manual event', () => {
    const execution: TypesExecution = {
      author_name: 'John Doe',
      event: 'manual',
      number: 1,
      status: 'success' as EnumCiStatus,
      created: 0,
      updated: 0,
      started: 0,
      finished: 0
    }
    expect(getLabel(execution)).toBe('John Doe triggered manually')
  })

  it('should handle pull_request event with source and target', () => {
    const execution: TypesExecution = {
      author_name: 'John Doe',
      event: 'pull_request',
      source: 'feature',
      target: 'main',
      number: 1,
      status: 'success' as EnumCiStatus,
      created: 0,
      updated: 0,
      started: 0,
      finished: 0
    }
    const result = getLabel(execution)
    expect(result).toBeTruthy() // Since it returns a React element, we just verify it's not null
  })
})
describe('getExecutionStatus', () => {
  it('should map running status correctly', () => {
    expect(getExecutionStatus('running')).toBe(PipelineExecutionStatus.RUNNING)
  })

  it('should map success status correctly', () => {
    expect(getExecutionStatus('success')).toBe(PipelineExecutionStatus.SUCCESS)
  })

  it('should map failure status correctly', () => {
    expect(getExecutionStatus('failure')).toBe(PipelineExecutionStatus.FAILURE)
  })

  it('should map error status correctly', () => {
    expect(getExecutionStatus('error')).toBe(PipelineExecutionStatus.ERROR)
  })

  it('should map killed status correctly', () => {
    expect(getExecutionStatus('killed')).toBe(PipelineExecutionStatus.KILLED)
  })

  it('should return UNKNOWN for undefined status', () => {
    expect(getExecutionStatus(undefined)).toBe(PipelineExecutionStatus.UNKNOWN)
  })

  it('should return UNKNOWN for invalid status', () => {
    const invalidStatus = 'invalid' as EnumCiStatus
    expect(getExecutionStatus(invalidStatus)).toBe(PipelineExecutionStatus.UNKNOWN)
  })
})

describe('getMeterState', () => {
  it('should return Error state for failure status', () => {
    expect(getMeterState(PipelineExecutionStatus.FAILURE)).toBe(MeterState.Error)
  })

  it('should return Error state for killed status', () => {
    expect(getMeterState(PipelineExecutionStatus.KILLED)).toBe(MeterState.Error)
  })

  it('should return Error state for error status', () => {
    expect(getMeterState(PipelineExecutionStatus.ERROR)).toBe(MeterState.Error)
  })

  it('should return Success state for success status', () => {
    expect(getMeterState(PipelineExecutionStatus.SUCCESS)).toBe(MeterState.Success)
  })

  it('should return Warning state for skipped status', () => {
    expect(getMeterState(PipelineExecutionStatus.SKIPPED)).toBe(MeterState.Warning)
  })

  it('should return Warning state for blocked status', () => {
    expect(getMeterState(PipelineExecutionStatus.BLOCKED)).toBe(MeterState.Warning)
  })

  it('should return Empty state for pending status', () => {
    expect(getMeterState(PipelineExecutionStatus.PENDING)).toBe(MeterState.Empty)
  })

  it('should return Empty state for waiting on dependencies status', () => {
    expect(getMeterState(PipelineExecutionStatus.WAITING_ON_DEPENDENCIES)).toBe(MeterState.Empty)
  })

  it('should return Empty state for undefined status', () => {
    expect(getMeterState(undefined)).toBe(MeterState.Empty)
  })
})
