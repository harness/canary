import type { Execution } from '../../../components/execution-list'
import { ExecutionState } from '../../../components/execution/types'

export const mockExecutions: Execution[] = [
  {
    id: '1',
    status: ExecutionState.RUNNING,
    name: 'removing duplicated metrics for servers and swapping to pattern math…',
    sha: '93dbd09a',
    description: 'fix(deps): update module github.com/aws/aws-sdk-go to',
    version: 'v1.5.4.20',
    timestamp: '7 days ago',
    lastTimestamp: '11:24'
  },
  {
    id: '2',
    status: ExecutionState.SUCCESS,
    name: '(fix) CI-9642 update go version, remove cli warning messages',
    sha: '366177a6',
    description: 'Update module github.com/aws/aws-sdk-go to',
    version: 'v1.54.19',
    timestamp: '4 months ago',
    lastTimestamp: '11:20'
  },
  {
    id: '3',
    status: ExecutionState.FAILURE,
    name: 'Bump github.com/containerd/containerd from 1.6.8 to 1.6.18',
    sha: 'da7c1c67',
    description: 'feat: [CDE-119]: Add task handling to spawn and cleanup VM for CDE/gitspaces on bare metalo',
    version: 'v1.5.4.20',
    timestamp: '7 months ago',
    lastTimestamp: '10:50'
  },
  {
    id: '4',
    status: ExecutionState.WAITING_ON_DEPENDENCIES,
    name: '(fix) setup dependencies in drone build',
    sha: '93dbd09a',
    description: 'fix: [CI-13371]: Fix log closers in case of step timeouts',
    version: 'v1.5.4.20',
    timestamp: '7 months ago',
    lastTimestamp: '04:12'
  },

  {
    id: '5',
    status: ExecutionState.ERROR,
    name: 'Add support for jpath in jsonnet (#224) * Add support for jpath in jsonnet Co-a',
    sha: 'fe54f9b1',
    description: 'Update go-jsonnet version to',
    version: 'v0.20.0',
    timestamp: '7 months ago',
    lastTimestamp: '05:36'
  },
  {
    id: '6',
    status: ExecutionState.KILLED,
    name: 'fix: use right parameter name for secrets-file',
    sha: 'b7765ad1',
    description: 'update google/go-jsonnet version to',
    version: 'v0.20.0',
    timestamp: '10 months ago',
    lastTimestamp: '04:06'
  }
]
