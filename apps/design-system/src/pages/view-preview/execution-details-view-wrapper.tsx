import { FC, PropsWithChildren } from 'react'
import { Route, Routes } from 'react-router-dom'

import { ExecutionState, LivelogLine, StageExecution, StageProps } from '@harnessio/ui/views'

const logs: LivelogLine[] = [
  { pos: 1, time: 1707000000, out: 'Initializing pipeline...' },
  { pos: 2, time: 1707000001, out: 'Fetching repository...' },
  { pos: 3, time: 1707000003, out: 'Checking out commit abc123...' },
  { pos: 4, time: 1707000005, out: 'Installing dependencies...' },
  { pos: 5, time: 1707000010, out: 'Running pre-build checks...' },
  { pos: 6, time: 1707000012, out: 'Compiling source files...' },
  { pos: 7, time: 1707000020, out: "Compiler warning: Unused variable 'x' in src/utils.ts" },
  { pos: 8, time: 1707000025, out: 'Build completed successfully.' },
  { pos: 9, time: 1707000027, out: 'Running unit tests...' },
  { pos: 10, time: 1707000035, out: 'Test suite passed: 42 tests executed, 0 failed.' },
  { pos: 11, time: 1707000040, out: 'Deploying artifacts...' },
  { pos: 12, time: 1707000050, out: 'Deployment completed successfully.' },
  { pos: 13, time: 1707000052, out: 'Pipeline execution finished.' }
]

const stages: StageProps[] = [
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

export const ExecutionDetailsViewWrapper: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <StageExecution
            logs={logs}
            onCopy={() => {}}
            onDownload={() => {}}
            onEdit={() => {}}
            onStepNav={() => {}}
            selectedStepIdx={0}
            stage={stages[0]}
          />
        }
      >
        <Route path="*" element={children} />
      </Route>
    </Routes>
  )
}
