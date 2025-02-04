import { ExecutionState, ExecutionTreeProps, LivelogLine, StageProps } from '@harnessio/ui/views'

export const logs: LivelogLine[] = [
  { pos: 1, time: 1707000000, duration: 2, out: 'Initializing pipeline...' },
  { pos: 2, time: 1707000002, duration: 3, out: 'Fetching repository...' },
  { pos: 3, time: 1707000005, duration: 5, out: 'Checking out commit abc123...' },
  { pos: 4, time: 1707000010, duration: 10, out: 'Installing dependencies...' },
  { pos: 5, time: 1707000020, duration: 7, out: 'Running pre-build checks...' },
  { pos: 6, time: 1707000027, duration: 12, out: 'Compiling source files...' },
  { pos: 7, time: 1707000039, duration: 3, out: "Compiler warning: Unused variable 'x' in src/utils.ts" },
  { pos: 8, time: 1707000042, duration: 8, out: 'Build completed successfully.' },
  { pos: 9, time: 1707000050, duration: 15, out: 'Running unit tests...' },
  { pos: 10, time: 1707000065, duration: 10, out: 'Test suite passed: 42 tests executed, 0 failed.' },
  { pos: 11, time: 1707000075, duration: 10, out: 'Deploying artifacts...' },
  { pos: 12, time: 1707000085, duration: 12, out: 'Deployment completed successfully.' },
  { pos: 13, time: 1707000097, duration: 2, out: 'Pipeline execution finished.' }
]

export const stages: StageProps[] = [
  {
    name: 'Initialize',
    group: 'Setup',
    steps: [
      {
        name: 'Fetch Repository',
        status: ExecutionState.SUCCESS,
        started: 1707000000,
        stopped: 1707000002,
        inputs: [{ name: 'branch', value: 'main' }],
        outputs: [{ name: 'commit', value: 'abc123' }],
        number: 1
      },
      {
        name: 'Checkout Code',
        status: ExecutionState.SUCCESS,
        started: 1707000003,
        stopped: 1707000005,
        inputs: [{ name: 'commit', value: 'abc123' }],
        outputs: [{ name: 'workspace', value: '/build/workspace' }],
        number: 2
      }
    ]
  },
  {
    name: 'Build',
    group: 'Compilation',
    steps: [
      {
        name: 'Install Dependencies',
        status: ExecutionState.SUCCESS,
        started: 1707000010,
        stopped: 1707000015,
        inputs: [{ name: 'package.json', value: '/build/workspace/package.json' }],
        outputs: [{ name: 'node_modules', value: '/build/workspace/node_modules' }],
        number: 3
      },
      {
        name: 'Compile Source',
        status: ExecutionState.SUCCESS,
        started: 1707000016,
        stopped: 1707000025,
        inputs: [{ name: 'source', value: '/build/workspace/src' }],
        outputs: [{ name: 'binary', value: '/build/workspace/dist' }],
        number: 4
      }
    ]
  },
  {
    name: 'Test',
    group: 'Verification',
    steps: [
      {
        name: 'Run Unit Tests',
        status: ExecutionState.SUCCESS,
        started: 1707000030,
        stopped: 1707000040,
        inputs: [{ name: 'binary', value: '/build/workspace/dist' }],
        outputs: [{ name: 'testReport', value: '/build/workspace/reports/tests.xml' }],
        number: 5
      }
    ]
  },
  {
    name: 'Deploy',
    group: 'Deployment',
    steps: [
      {
        name: 'Deploy to Staging',
        status: ExecutionState.SUCCESS,
        started: 1707000050,
        stopped: 1707000060,
        inputs: [{ name: 'testReport', value: '/build/workspace/reports/tests.xml' }],
        outputs: [{ name: 'deploymentURL', value: 'https://staging.example.com' }],
        number: 6
      }
    ]
  }
]

export const elements: ExecutionTreeProps['elements'] = [
  {
    id: 'initialize',
    name: 'Initialize',
    status: ExecutionState.SUCCESS,
    duration: '00:05',
    isSelectable: true,
    children: [
      {
        id: 'fetch-repo',
        name: 'Fetch Repository',
        status: ExecutionState.SUCCESS,
        duration: '00:02',
        isSelectable: true
      },
      {
        id: 'checkout-code',
        name: 'Checkout Code',
        status: ExecutionState.SUCCESS,
        duration: '00:03',
        isSelectable: true
      }
    ]
  },
  {
    id: 'build',
    name: 'Build',
    status: ExecutionState.FAILURE,
    duration: '00:15',
    isSelectable: true,
    children: [
      {
        id: 'install-deps',
        name: 'Install Dependencies',
        status: ExecutionState.SUCCESS,
        duration: '00:10',
        isSelectable: true
      },
      {
        id: 'compile',
        name: 'Compile Source',
        status: ExecutionState.FAILURE,
        duration: '00:05',
        isSelectable: true
      }
    ]
  },
  {
    id: 'test',
    name: 'Test',
    status: ExecutionState.SUCCESS,
    duration: '00:10',
    isSelectable: true,
    children: [
      {
        id: 'unit-tests',
        name: 'Run Unit Tests',
        status: ExecutionState.SUCCESS,
        duration: '00:10',
        isSelectable: true
      }
    ]
  },
  {
    id: 'deploy',
    name: 'Deploy',
    status: ExecutionState.PENDING,
    duration: '00:10',
    isSelectable: true,
    children: [
      {
        id: 'deploy-staging',
        name: 'Deploy to Staging',
        status: ExecutionState.PENDING,
        duration: '00:10',
        isSelectable: true
      }
    ]
  }
]
