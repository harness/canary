import { ExecutionState, ExecutionTreeProps, LivelogLine, StageProps } from '@harnessio/ui/views'

export const logs: LivelogLine[] = [
  // Node.js install step
  { out: 'Starting dependency installation...', pos: 1, time: 1700000001, duration: 2 },
  { out: 'Fetching npm registry metadata...', pos: 2, time: 1700000003, duration: 1 },
  { out: 'Downloading packages...', pos: 3, time: 1700000004, duration: 2 },
  { out: 'Extracting packages...', pos: 4, time: 1700000006, duration: 1 },
  { out: 'Resolving dependencies...', pos: 5, time: 1700000007, duration: 2 },
  { out: 'npm WARN deprecated package@1.0.0: Use package@2.0.0 instead', pos: 6, time: 1700000009, duration: 1 },
  { out: 'Dependencies installed successfully.', pos: 7, time: 1700000010, duration: 1 },

  // Node.js test step
  { out: 'Starting test execution...', pos: 8, time: 1700000011, duration: 1 },
  { out: 'Running test suite: user authentication tests...', pos: 9, time: 1700000012, duration: 2 },
  { out: '✔ Login test passed', pos: 10, time: 1700000014, duration: 1 },
  { out: '✔ Signup test passed', pos: 11, time: 1700000015, duration: 1 },
  { out: '✔ Logout test passed', pos: 12, time: 1700000016, duration: 1 },
  { out: 'Running test suite: API response tests...', pos: 13, time: 1700000017, duration: 2 },
  { out: '✔ GET /users returned 200 OK', pos: 14, time: 1700000019, duration: 1 },
  { out: '✔ POST /users created new user', pos: 15, time: 1700000020, duration: 1 },
  { out: '✔ DELETE /users/:id removed user', pos: 16, time: 1700000021, duration: 1 },
  { out: 'Test suite completed. 10 tests executed.', pos: 17, time: 1700000022, duration: 1 },

  // Go build step
  { out: 'Initializing Go build...', pos: 18, time: 1700000023, duration: 2 },
  { out: 'Compiling main.go...', pos: 19, time: 1700000025, duration: 3 },
  { out: 'Linking dependencies...', pos: 20, time: 1700000028, duration: 2 },
  { out: 'Build successful: bin/app created.', pos: 21, time: 1700000030, duration: 1 },

  // Go test step
  { out: 'Running Go tests with coverage analysis...', pos: 22, time: 1700000031, duration: 2 },
  { out: '✔ auth_test.go passed (coverage: 88%)', pos: 23, time: 1700000033, duration: 1 },
  { out: '✔ db_test.go passed (coverage: 92%)', pos: 24, time: 1700000034, duration: 1 },
  { out: '✔ api_test.go passed (coverage: 85%)', pos: 25, time: 1700000035, duration: 1 },
  { out: 'ok   project/module  0.123s  coverage: 85.7%', pos: 26, time: 1700000036, duration: 1 },

  // Docker template step
  { out: 'Initializing Docker image build...', pos: 27, time: 1700000037, duration: 2 },
  { out: 'Fetching base image harness/petstore...', pos: 28, time: 1700000039, duration: 2 },
  { out: 'Adding application files...', pos: 29, time: 1700000041, duration: 3 },
  { out: 'Building image harness/petstore:latest...', pos: 30, time: 1700000044, duration: 5 },
  { out: 'Pushing image to registry...', pos: 31, time: 1700000049, duration: 4 },
  { out: 'Image pushed successfully.', pos: 32, time: 1700000053, duration: 1 },

  // Slack notification step
  { out: 'Preparing Slack notification payload...', pos: 33, time: 1700000054, duration: 1 },
  { out: 'Sending notification to #general...', pos: 34, time: 1700000055, duration: 1 },
  { out: 'Slack notification sent successfully.', pos: 35, time: 1700000056, duration: 1 }
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
    status: ExecutionState.RUNNING,
    duration: '00:10',
    isSelectable: true,
    children: [
      {
        id: 'deploy-staging',
        name: 'Deploy to Staging',
        status: ExecutionState.RUNNING,
        duration: '00:10',
        isSelectable: true
      }
    ]
  },
  {
    id: 'network-test',
    name: 'Check inbound traffic',
    status: ExecutionState.PENDING,
    duration: '--:--',
    isSelectable: true,
    children: [
      {
        id: 'health-check',
        name: 'Perform Health Check',
        status: ExecutionState.PENDING,
        duration: '--:--',
        isSelectable: true
      }
    ]
  }
]
