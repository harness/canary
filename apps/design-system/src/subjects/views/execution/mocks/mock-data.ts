import { ExecutionState, ExecutionTreeProps, LivelogLine, LivelogLineType, StageProps } from '@harnessio/ui/views'

export const logs: LivelogLine[] = [
  { out: 'Starting dependency installation...', pos: 1, time: 1700000001 },
  { out: 'Fetching npm registry metadata...', pos: 2, time: 1700000003 },
  { out: 'Downloading packages...', pos: 3, time: 1700000004 },
  { out: 'Extracting packages...', pos: 4, time: 1700000006 },
  { out: 'Resolving dependencies...', pos: 5, time: 1700000007 },
  {
    out: 'npm WARN deprecated package@1.0.0: Use package@2.0.0 instead',
    pos: 6,
    time: 1700000009,
    type: LivelogLineType.WARNING
  },
  { out: 'Dependencies installed successfully.', pos: 7, time: 1700000010 },
  { out: 'Starting test execution...', pos: 8, time: 1700000011 },
  { out: 'Running test suite: user authentication tests...', pos: 9, time: 1700000012 },
  { out: '✔ Login test passed', pos: 10, time: 1700000014 },
  { out: '✔ Signup test passed', pos: 11, time: 1700000015 },
  { out: '✔ Logout test passed', pos: 12, time: 1700000016 },
  { out: 'Running test suite: API response tests...', pos: 13, time: 1700000017 },
  { out: '✔ GET /users returned 200 OK', pos: 14, time: 1700000019 },
  { out: '', pos: 15, time: 1700000019 },
  { out: '✔ POST /users created new user', pos: 16, time: 1700000020 },
  { out: '', pos: 17, time: 1700000020 },
  { out: 'Failed to compile.', pos: 18, time: 1700000021, type: LivelogLineType.ERROR },
  { out: '', pos: 19, time: 1700000021, type: LivelogLineType.ERROR }
]

export const stages: StageProps[] = [
  {
    name: 'Parallel Stage 1',
    steps: [
      {
        name: 'Install dependencies',
        status: ExecutionState.RUNNING,
        started: Date.now()
      },
      {
        name: 'Run tests',
        status: ExecutionState.PENDING,
        started: Date.now()
      }
    ]
  },
  {
    name: 'Parallel Stage 2',
    steps: [
      {
        name: 'Build Golang project',
        status: ExecutionState.PENDING,
        started: Date.now()
      },
      {
        name: 'Run Golang tests',
        status: ExecutionState.PENDING,
        started: Date.now()
      }
    ]
  },
  {
    name: 'Docker Template Stage',
    steps: [
      {
        name: 'Pull Docker image',
        status: ExecutionState.PENDING,
        started: Date.now()
      }
    ]
  },
  {
    name: 'Slack Notification Stage',
    steps: [
      {
        name: 'Send Slack notification',
        status: ExecutionState.PENDING,
        started: Date.now()
      }
    ]
  }
]

export const elements: ExecutionTreeProps['elements'] = [
  {
    id: 'initialize',
    name: 'Initialize',
    status: ExecutionState.RUNNING,
    duration: '--:--',
    isSelectable: true,
    children: [
      {
        id: 'fetch-repo',
        name: 'Fetch Repository',
        status: ExecutionState.RUNNING,
        duration: '--:--',
        isSelectable: true
      },
      {
        id: 'checkout-code',
        name: 'Checkout Code',
        status: ExecutionState.PENDING,
        duration: '--:--',
        isSelectable: true
      }
    ]
  },
  {
    id: 'parallel-stage-1',
    name: 'Parallel Stage 1',
    status: ExecutionState.PENDING,
    duration: '--:--',
    isSelectable: true,
    children: [
      {
        id: 'install-dependencies',
        name: 'Install dependencies',
        status: ExecutionState.PENDING,
        duration: '--:--',
        isSelectable: true
      },
      {
        id: 'run-tests',
        name: 'Run tests',
        status: ExecutionState.PENDING,
        duration: '--:--',
        isSelectable: true
      }
    ]
  },
  {
    id: 'parallel-stage-2',
    name: 'Parallel Stage 2',
    status: ExecutionState.PENDING,
    duration: '--:--',
    isSelectable: true,
    children: [
      {
        id: 'build-golang-project',
        name: 'Build Golang project',
        status: ExecutionState.PENDING,
        duration: '--:--',
        isSelectable: true
      },
      {
        id: 'run-golang-tests',
        name: 'Run Golang tests',
        status: ExecutionState.PENDING,
        duration: '--:--',
        isSelectable: true
      }
    ]
  },
  {
    id: 'docker-template-stage',
    name: 'Docker Template Stage',
    status: ExecutionState.PENDING,
    duration: '--:--',
    isSelectable: true,
    children: [
      {
        id: 'pull-docker-image',
        name: 'Pull Docker image',
        status: ExecutionState.PENDING,
        duration: '--:--',
        isSelectable: true
      }
    ]
  },
  {
    id: 'slack-notification-stage',
    name: 'Slack Notification Stage',
    status: ExecutionState.PENDING,
    duration: '--:--',
    isSelectable: true,
    children: [
      {
        id: 'send-slack-notification',
        name: 'Send Slack notification',
        status: ExecutionState.PENDING,
        duration: '--:--',
        isSelectable: true
      }
    ]
  }
]

export const stages_old: StageProps[] = [
  {
    name: 'Initialize',
    group: 'Setup',
    steps: [
      {
        name: 'Fetch Repository',
        status: ExecutionState.RUNNING,
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

export const elements_old: ExecutionTreeProps['elements'] = [
  {
    id: 'initialize',
    name: 'Initialize',
    status: ExecutionState.RUNNING,
    duration: '00:05',
    isSelectable: true,
    children: [
      {
        id: 'fetch-repo',
        name: 'Fetch Repository',
        status: ExecutionState.RUNNING,
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
