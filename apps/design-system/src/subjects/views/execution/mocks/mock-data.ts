import { ExecutionState, ExecutionTreeProps, LivelogLine } from '@harnessio/ui/views'

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

export const logsBank: { [key: string]: LivelogLine[] } = {
  initialize: [
    { out: 'Initializing build...', pos: 1, time: 1700000001, duration: 1 },
    { out: 'Provisioning infra...', pos: 2, time: 1700000002, duration: 2 },
    { out: 'Creating secrets...', pos: 3, time: 1700000004, duration: 1 },
    { out: 'Pulling manifests...', pos: 4, time: 1700000005, duration: 1 },
    ...Array.from({ length: 46 }, (_, i) => ({
      out: `Setting up for build and deploy ${i + 5}`,
      pos: i + 5,
      time: 1700000006 + i,
      duration: 1
    }))
  ],
  'fetch-repo': [
    { out: 'Initializing repository fetch...', pos: 1, time: 1700000001, duration: 1 },
    { out: 'Cloning repository from GitHub...', pos: 2, time: 1700000002, duration: 2 },
    { out: "Checking out branch 'main'...", pos: 3, time: 1700000004, duration: 1 },
    { out: 'Repository fetch completed successfully.', pos: 4, time: 1700000005, duration: 1 },
    ...Array.from({ length: 46 }, (_, i) => ({
      out: `Fetch Repository log ${i + 5}`,
      pos: i + 5,
      time: 1700000006 + i,
      duration: 1
    }))
  ],
  'checkout-code': [
    { out: 'Starting code checkout process...', pos: 1, time: 1700000051, duration: 1 },
    { out: 'Fetching latest commit SHA...', pos: 2, time: 1700000052, duration: 1 },
    { out: "Checking out to commit 'abc123'...", pos: 3, time: 1700000053, duration: 2 },
    { out: 'Verifying code integrity...', pos: 4, time: 1700000055, duration: 1 },
    { out: 'Checkout process completed.', pos: 5, time: 1700000056, duration: 1 },
    ...Array.from({ length: 46 }, (_, i) => ({
      out: `Checkout Code log ${i + 5}`,
      pos: i + 5,
      time: 1700000057 + i,
      duration: 1
    }))
  ],
  'install-dependencies': [
    { out: 'Starting dependency installation...', pos: 1, time: 1700000101, duration: 1 },
    { out: 'Downloading required packages...', pos: 2, time: 1700000102, duration: 2 },
    { out: 'Resolving dependency tree...', pos: 3, time: 1700000104, duration: 1 },
    { out: 'Compiling dependencies...', pos: 4, time: 1700000105, duration: 3 },
    { out: 'Dependency installation complete.', pos: 5, time: 1700000108, duration: 1 },
    ...Array.from({ length: 46 }, (_, i) => ({
      out: `Install dependencies log ${i + 5}`,
      pos: i + 5,
      time: 1700000109 + i,
      duration: 1
    }))
  ],
  'run-tests': [
    { out: 'Initializing test suite...', pos: 1, time: 1700000151, duration: 1 },
    { out: 'Running unit tests...', pos: 2, time: 1700000152, duration: 1 },
    { out: '✔ Authentication tests passed', pos: 3, time: 1700000153, duration: 1 },
    { out: '✔ API response tests passed', pos: 4, time: 1700000154, duration: 1 },
    { out: '✔ Database connection tests passed', pos: 5, time: 1700000155, duration: 1 },
    { out: 'Test suite completed successfully.', pos: 6, time: 1700000156, duration: 1 },
    ...Array.from({ length: 46 }, (_, i) => ({
      out: `Run tests log ${i + 5}`,
      pos: i + 5,
      time: 1700000157 + i,
      duration: 1
    }))
  ],
  'build-golang-project': [
    { out: 'Initializing Go build process...', pos: 1, time: 1700000201, duration: 1 },
    { out: 'Compiling main.go...', pos: 2, time: 1700000202, duration: 3 },
    { out: 'Compiling utils.go...', pos: 3, time: 1700000205, duration: 2 },
    { out: 'Linking dependencies...', pos: 4, time: 1700000207, duration: 2 },
    { out: 'Generating executable binary...', pos: 5, time: 1700000209, duration: 2 },
    { out: 'Build completed successfully.', pos: 6, time: 1700000211, duration: 1 },
    ...Array.from({ length: 46 }, (_, i) => ({
      out: `Build Golang project log ${i + 5}`,
      pos: i + 5,
      time: 1700000212 + i,
      duration: 1
    }))
  ],
  'run-golang-tests': [
    { out: 'Initializing Go build process...', pos: 1, time: 1700000201, duration: 1 },
    { out: 'Compiling main.go...', pos: 2, time: 1700000202, duration: 3 },
    { out: 'Compiling utils.go...', pos: 3, time: 1700000205, duration: 2 },
    { out: 'Linking dependencies...', pos: 4, time: 1700000207, duration: 2 },
    { out: 'Running tests...', pos: 5, time: 1700000209, duration: 2 },
    { out: 'Generating test reports...', pos: 6, time: 1700000211, duration: 1 },
    ...Array.from({ length: 46 }, (_, i) => ({
      out: `Build Golang project log ${i + 5}`,
      pos: i + 5,
      time: 1700000212 + i,
      duration: 1
    }))
  ],
  'docker-template-stage': [
    { out: 'Starting Golang test execution...', pos: 1, time: 1700000251, duration: 1 },
    { out: 'Running unit tests...', pos: 2, time: 1700000252, duration: 1 },
    { out: '✔ Database tests passed', pos: 3, time: 1700000253, duration: 1 },
    { out: '✔ API tests passed', pos: 4, time: 1700000254, duration: 1 },
    { out: '✔ Performance benchmarks completed', pos: 5, time: 1700000255, duration: 1 },
    { out: 'Test suite finished with no errors.', pos: 6, time: 1700000256, duration: 1 },
    ...Array.from({ length: 46 }, (_, i) => ({
      out: `Run Golang tests log ${i + 5}`,
      pos: i + 5,
      time: 1700000257 + i,
      duration: 1
    }))
  ],
  'pull-docker-image': [
    { out: 'Connecting to DockerHub...', pos: 1, time: 1700000301, duration: 1 },
    { out: 'Authenticating Docker credentials...', pos: 2, time: 1700000302, duration: 2 },
    { out: 'Pulling image harness/petstore:latest...', pos: 3, time: 1700000304, duration: 3 },
    { out: 'Verifying image integrity...', pos: 4, time: 1700000307, duration: 1 },
    { out: 'Docker image pull complete.', pos: 5, time: 1700000308, duration: 1 },
    ...Array.from({ length: 46 }, (_, i) => ({
      out: `Pull Docker image log ${i + 5}`,
      pos: i + 5,
      time: 1700000309 + i,
      duration: 1
    }))
  ],
  'send-slack-notification': [
    { out: 'Connecting to Slack API...', pos: 1, time: 1700000351, duration: 1 },
    { out: 'Authenticating Slack bot token...', pos: 2, time: 1700000352, duration: 2 },
    { out: 'Sending message to #general...', pos: 3, time: 1700000354, duration: 1 },
    { out: 'Message successfully posted.', pos: 4, time: 1700000355, duration: 1 },
    { out: 'Slack notification process completed.', pos: 5, time: 1700000356, duration: 1 },
    ...Array.from({ length: 46 }, (_, i) => ({
      out: `Send Slack notification log ${i + 5}`,
      pos: i + 5,
      time: 1700000357 + i,
      duration: 1
    }))
  ]
}

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
    status: ExecutionState.FAILURE,
    duration: '--:--',
    isSelectable: true,
    children: [
      {
        id: 'send-slack-notification',
        name: 'Send Slack notification',
        status: ExecutionState.FAILURE,
        duration: '--:--',
        isSelectable: true
      }
    ]
  }
]
