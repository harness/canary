import { useState } from 'react'

import { Icon } from '@harnessio/canary'

export type ProblemSeverity = 'error' | 'warning' | 'info'

export interface Problem<T = unknown> {
  severity: ProblemSeverity
  message: string
  position: {
    row: number
    column: number
  }
  data?: T
}

const getProblemIcon = (severity: ProblemSeverity): React.ReactElement => {
  switch (severity) {
    case 'error':
      return <Icon name="fail" className="text-destructive-foreground" />
    case 'warning':
      return <Icon name="triangle-warning" className="text-orange" />
    case 'info':
      return <Icon name="info-circle" />
  }
}

export interface ProblemsProps<T = unknown> {
  problems: Problem<T>[]
  onClick: (data: Problem<T>) => void
  /** Selected problem idx, for controlled mode*/
  selectedProblemIdx?: number
}

const ProblemsComponent = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <div className="min-h-12 overflow-scroll text-[13px] leading-[15px] text-neutral-400">{children}</div>
  },

  Row: function Root({
    selected,
    onClick,
    children
  }: {
    selected: boolean
    onClick?: () => void
    children: React.ReactNode
  }) {
    const rowClasses = selected ? 'bg-neutral-800 text-neutral-200' : ''
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        className={`width-100 flex flex-1 cursor-pointer items-center gap-2 text-nowrap py-0.5 ${rowClasses}`}
      >
        {children}
      </div>
    )
  },

  Icon: function Root({ severity }: { severity: ProblemSeverity }) {
    return <div className="pl-4">{getProblemIcon(severity)}</div>
  },

  Message: function Root({ message }: { message: string }) {
    return (
      <div className="flex items-center overflow-hidden">
        <span className="truncate">{message}</span>
      </div>
    )
  },

  Position: function Root({
    position
  }: {
    position: {
      row: number
      column: number
    }
  }) {
    return (
      <div className="text-grey-60 text-nowrap pr-2">
        [{position.row}, {position.column}]
      </div>
    )
  }
}

// TODO: remove hardcoded colors - implement proper variables from theme
const Problems = <T,>(props: ProblemsProps<T>): React.ReactElement => {
  const { problems, onClick, selectedProblemIdx } = props
  const [selectedLine, setSelectedLine] = useState<number | undefined>()

  return (
    <ProblemsComponent.Root>
      {/* TODO: don't use idx, compose id from problem data*/}
      {problems.map((problem, idx) => {
        const { message, position, severity } = problem
        const selected = (typeof selectedProblemIdx !== 'undefined' ? selectedProblemIdx : selectedLine) === idx

        return (
          <ProblemsComponent.Row
            key={`${problem.message}_${problem.position.column}_${problem.position.row}`}
            selected={selected}
            onClick={() => {
              if (typeof selectedProblemIdx === 'undefined') {
                setSelectedLine(idx)
              }
              onClick(problem)
            }}
          >
            <ProblemsComponent.Icon severity={severity} />
            <ProblemsComponent.Message message={message} />
            <ProblemsComponent.Position position={position} />
          </ProblemsComponent.Row>
        )
      })}
    </ProblemsComponent.Root>
  )
}

function NoProblemsFound(): JSX.Element {
  return (
    <div className="flex items-center gap-2 pl-4">
      <Icon name="success" className="text-green-600" /> No problems found
    </div>
  )
}

export { Problems, NoProblemsFound }
