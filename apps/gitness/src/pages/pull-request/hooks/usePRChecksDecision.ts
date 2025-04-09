import { useEffect, useMemo, useState } from 'react'

import pluralize from 'pluralize'

import { TypesPullReq, TypesRepository, useChecksPullReqQuery } from '@harnessio/code-service-client'
import { ExecutionState } from '@harnessio/ui/views'

import { determineStatusMessage, generateStatusSummary } from '../utils'

interface Check {
  check: {
    status: ExecutionState
  }
}

interface Data {
  checks: Check[]
}
export function usePRChecksDecision({
  repoMetadata,
  pullReqMetadata
}: {
  repoMetadata: TypesRepository | undefined
  pullReqMetadata: TypesPullReq | undefined
}) {
  const {
    data: { body: data } = {},
    error,
    refetch
  } = useChecksPullReqQuery({
    repo_ref: `${repoMetadata?.path}/+`,
    pullreq_number: pullReqMetadata?.number ?? 0,
    queryParams: { debounce: 500 }
  })
  const [count, setCount] = useState(DEFAULT_COUNTS)
  const [color, setColor] = useState<string>('GREEN_500')
  const [background, setBackground] = useState<string>('GREEN_50')
  const [message, setMessage] = useState('')
  const [complete, setComplete] = useState(true)
  const [summaryText, setSummaryText] = useState('')
  const [checkInfo, setCheckInfo] = useState<{
    title: string
    content: string
    color: string
    status: string
  }>({ title: '', content: '', color: '', status: '' })

  const status = useMemo(() => {
    let _status: ExecutionState | undefined
    const _count = { ...DEFAULT_COUNTS }
    const total = data?.checks?.length
    // @ts-expect-error remove "@ts-expect-error" once CodeServiceClient Response for useChecksPullReqQuery is fixed
    const { message: summaryMessage } = generateStatusSummary(data?.checks)
    setSummaryText(summaryMessage)
    // @ts-expect-error remove "@ts-expect-error" once CodeServiceClient Response for useChecksPullReqQuery is fixed
    const checkInfoData = determineStatusMessage(data?.checks)
    if (checkInfoData) {
      setCheckInfo(checkInfoData)
    }
    if (total) {
      for (const check of (data as Data).checks) {
        switch (check.check.status) {
          case ExecutionState.ERROR:
          case ExecutionState.FAILURE:
          case ExecutionState.RUNNING:
          case ExecutionState.PENDING:
          case ExecutionState.SUCCESS:
            _count[check.check.status]++
            setCount({ ..._count })
            break
          default:
            console.error('Unrecognized PR check status', check)
            break
        }
      }
      // *******
      // NOTE:
      // Determine the overall status based on the counts of each check type after receiving the final counts of everything after
      // the order of precedence being error, then failure, then killed, followed by running, pending, and finally success.
      //  {
      //   const matrix = {error: 1,
      //   failure: 0,
      //   killed: 0,
      //   running: 0,
      //   pending: 1,
      //   skipped: 0,
      //   success: 1 }
      //   So basically the overall status will be determined by the highest precedence check that has occurred
      //   which is error and it is then set for it to be used in the check tab.
      // *******
      if (_count.error) {
        _status = ExecutionState.ERROR
        setColor('text-cn-foreground-danger')
        setBackground('text-cn-foreground-danger')
        setMessage(`${_count.error}/${total} ${pluralize('check', _count.error)} errored out.`)
      } else if (_count.failure) {
        _status = ExecutionState.FAILURE
        setColor('text-cn-foreground-danger')
        setBackground('text-cn-foreground-danger')
        setMessage(`${_count.failure}/${total} ${pluralize('check', _count.failure)} failed.`)
      } else if (_count.killed) {
        _status = ExecutionState.KILLED
        setColor('text-cn-foreground-danger')
        setBackground('text-cn-foreground-danger')
        setMessage(`${_count.killed}/${total} ${pluralize('check', _count.killed)} killed.`)
      } else if (_count.running) {
        _status = ExecutionState.RUNNING
        setColor('text-warning')
        setBackground('text-warning')
        setMessage(`${_count.running}/${total} ${pluralize('check', _count.running)} running.`)
      } else if (_count.pending) {
        _status = ExecutionState.PENDING
        setColor('text-cn-foreground-3')
        setBackground('text-cn-foreground-3')
        setMessage(`${_count.pending}/${total} ${pluralize('check', _count.pending)} pending.`)
      } else if (_count.skipped) {
        _status = ExecutionState.SKIPPED
        setColor('text-cn-foreground-3')
        setBackground('text-cn-foreground-3')
        setMessage(`${_count.skipped}/${total} ${pluralize('check', _count.skipped)} skipped.`)
      } else if (_count.success) {
        _status = ExecutionState.SUCCESS
        setColor('text-success')
        setBackground('text-success')
        setMessage(`${_count.success}/${total} ${pluralize('check', _count.success)} succeeded.`)
      }

      setComplete(!_count.pending && !_count.running)
    } else {
      setComplete(false)
    }

    return _status
  }, [data])

  useEffect(() => {
    let tornDown = false
    const pollingFn = () => {
      if (repoMetadata?.path && pullReqMetadata?.source_sha && !complete && !tornDown) {
        // TODO: fix racing condition where an ongoing refetch of the old sha overwrites the new one.
        // TEMPORARY SOLUTION: set debounce to 1 second to reduce likelyhood
        // refetch({ debounce: 1 }).then(() => { -- theres no debounce on refetches rn
        refetch().then(() => {
          if (!tornDown) {
            interval = window.setTimeout(pollingFn, POLLING_INTERVAL)
          }
        })
      }
    }
    let interval = window.setTimeout(pollingFn, POLLING_INTERVAL)
    return () => {
      tornDown = true
      window.clearTimeout(interval)
    }
  }, [repoMetadata?.path, pullReqMetadata?.source_sha, complete]) // eslint-disable-line react-hooks/exhaustive-deps
  return {
    overallStatus: status,
    count,
    error,
    data,
    color,
    background,
    message,
    checkInfo,
    summaryText
  }
}

export type PRChecksDecisionResult = ReturnType<typeof usePRChecksDecision>

const POLLING_INTERVAL = 10000

const DEFAULT_COUNTS = {
  error: 0,
  failure: 0,
  pending: 0,
  running: 0,
  success: 0,
  skipped: 0,
  killed: 0
}
