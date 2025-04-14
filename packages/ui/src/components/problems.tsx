import { Icon } from '@components/icon'

export type ProblemSeverity = 'error' | 'warning' | 'info'

export interface Problem<T = unknown> {
  severity: ProblemSeverity
  message: string
  position: {
    row: number
    column: number
  }
  data?: T
  action?: React.ReactNode
}

const getProblemIcon = (severity: ProblemSeverity): React.ReactElement => {
  switch (severity) {
    case 'error':
      return <Icon name="fail-legacy" className="text-error" />
    case 'warning':
      return <Icon name="triangle-warning" className="text-warning" />
    case 'info':
      return <Icon name="info-circle" />
  }
}

export interface ProblemsProps<T = unknown> {
  problems: Problem<T>[]
  onClick: (data: Problem<T>) => void
}

const ProblemsComponent = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <div className="min-h-12 overflow-scroll text-[13px] leading-[15px] text-neutral-400">{children}</div>
  },

  Row: function Root({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        className="width-100 flex flex-1 cursor-pointer items-center justify-between gap-2 text-nowrap px-4 py-0.5 text-cn-foreground-1"
      >
        {children}
      </div>
    )
  },

  Icon: function Root({ severity }: { severity: ProblemSeverity }) {
    return <div>{getProblemIcon(severity)}</div>
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
  },

  Action: function Root({ children }: { children: React.ReactNode }) {
    return <div className="flex items-center">{children}</div>
  }
}

// TODO: remove hardcoded colors - implement proper variables from theme
const Problems = <T,>(props: ProblemsProps<T>): React.ReactElement => {
  const { problems, onClick } = props

  return (
    <ProblemsComponent.Root>
      {/* TODO: don't use idx, compose id from problem data*/}
      {problems.map(problem => {
        const { message, position, severity, action } = problem

        return (
          <ProblemsComponent.Row
            key={`${problem.message}_${problem.position.column}_${problem.position.row}`}
            onClick={() => onClick(problem)}
          >
            <div className="flex items-center gap-2">
              <ProblemsComponent.Icon severity={severity} />
              <ProblemsComponent.Message message={message} />
              <ProblemsComponent.Position position={position} />
            </div>
            {action ? <ProblemsComponent.Action>{action}</ProblemsComponent.Action> : null}
          </ProblemsComponent.Row>
        )
      })}
    </ProblemsComponent.Root>
  )
}

function NoProblemsFound(): JSX.Element {
  return (
    <div className="flex items-center gap-2 pl-4">
      <Icon name="success" className="text-cn-foreground-success" /> No problems found
    </div>
  )
}

export { Problems, NoProblemsFound }
