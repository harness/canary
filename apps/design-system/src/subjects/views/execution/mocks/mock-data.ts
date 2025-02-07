import { ExecutionState, ExecutionTreeProps, LivelogLine, StageProps } from '@harnessio/ui/views'

export const logs: LivelogLine[] = [
  { out: 'Starting dependency installation...', pos: 1, time: 1700000001, duration: 2 },
  { out: 'Fetching npm registry metadata...', pos: 2, time: 1700000003, duration: 1 },
  { out: 'Downloading packages...', pos: 3, time: 1700000004, duration: 2 },
  { out: 'Extracting packages...', pos: 4, time: 1700000006, duration: 1 },
  { out: 'Resolving dependencies...', pos: 5, time: 1700000007, duration: 2 },
  { out: 'npm WARN deprecated package@1.0.0: Use package@2.0.0 instead', pos: 6, time: 1700000009, duration: 1 },
  { out: 'Dependencies installed successfully.', pos: 7, time: 1700000010, duration: 1 },
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
  { out: 'Initializing Go build...', pos: 18, time: 1700000023, duration: 2 },
  { out: 'Compiling main.go...', pos: 19, time: 1700000025, duration: 3 },
  { out: 'Linking dependencies...', pos: 20, time: 1700000028, duration: 2 },
  { out: 'Build successful: bin/app created.', pos: 21, time: 1700000030, duration: 1 },
  { out: 'Running Go tests with coverage analysis...', pos: 22, time: 1700000031, duration: 2 },
  { out: '✔ auth_test.go passed (coverage: 88%)', pos: 23, time: 1700000033, duration: 1 },
  { out: '✔ db_test.go passed (coverage: 92%)', pos: 24, time: 1700000034, duration: 1 },
  { out: '✔ api_test.go passed (coverage: 85%)', pos: 25, time: 1700000035, duration: 1 },
  { out: 'ok   project/module  0.123s  coverage: 85.7%', pos: 26, time: 1700000036, duration: 1 }
]

export const stages: StageProps[] = [
  {
    name: 'Parallel Stage 1',
    steps: [
      {
        name: 'Install dependencies',
        status: ExecutionState.PENDING,
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
    status: ExecutionState.PENDING,
    duration: '--:--',
    isSelectable: true,
    children: [
      {
        id: 'fetch-repo',
        name: 'Fetch Repository',
        status: ExecutionState.PENDING,
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
