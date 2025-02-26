import { updateItemInArray } from '../yaml-utils'
import { expectedPipeline1, pipeline1 } from './yaml-mocks/pipeline1'
import { expectedPipeline2, pipeline2 } from './yaml-mocks/pipeline2'
import { expectedPipeline3, pipeline3 } from './yaml-mocks/pipeline3'
import { expectedPipeline4, pipeline4 } from './yaml-mocks/pipeline4'
import { expectedPipeline5, pipeline5 } from './yaml-mocks/pipeline5'

describe('test updateItemInArray', () => {
  test('update string', () => {
    const result = updateItemInArray(pipeline1, { path: 'pipeline.stages.0.steps.0.name', item: 'Updated step name' })
    expect(result).toBe(expectedPipeline1)
  })

  test('update element in array with string', () => {
    const result = updateItemInArray(pipeline2, { path: 'pipeline.stages.0.steps.0', item: 'Step0' })
    expect(result).toBe(expectedPipeline2)
  })

  test('update array with string', () => {
    const result = updateItemInArray(pipeline3, { path: 'pipeline.stages', item: 'Stages' })
    expect(result).toBe(expectedPipeline3)
  })

  test('update array with array', () => {
    const arr = [
      { path: 'updatedPath1', type: 'updatedType1' },
      { path: 'updatedPath2', type: 'updatedType2' }
    ]
    const result = updateItemInArray(pipeline4, { path: 'pipeline.stages.0.steps.0.run.report', item: arr })
    expect(result).toBe(expectedPipeline4)
  })

  test('update object with object', () => {
    const obj = {
      shell: 'powershell 2',
      script: 'go build 2',
      report: [
        {
          path: 'path-1 2',
          type: 'junit 2'
        }
      ],
      container: {
        connector: 'connector1 2',
        credentials: {
          username: 'u 2',
          password: 'p 2'
        }
      }
    }

    const result = updateItemInArray(pipeline5, { path: 'pipeline.stages.0.steps.0.run', item: obj })
    expect(result).toBe(expectedPipeline5)
  })
})
