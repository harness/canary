import { useEffect, useRef, useState } from 'react'

import { ExecutionState } from '@views/repo/pull-request'

import { ExecutionStatus } from './execution-status'

const PipelineStatus = ({
  status,
  // buildTime,
  // createdTime,
  commit,
  branch
}: {
  status: ExecutionState
  buildTime: string
  createdTime: string
  commit: string
  branch: string
}) => {
  const [elapsedTime, setElapsedTime] = useState('00:00')
  const [createdTimeElapsed, setCreatedTimeElapsed] = useState('00:00')
  const createdStartRef = useRef<number>(Date.now())
  const elapsedStartRef = useRef<number>(Date.now())

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Created timer (always counts up from 0)
  useEffect(() => {
    createdStartRef.current = Date.now()

    const interval = setInterval(() => {
      const now = Date.now()
      const totalDiff = Math.floor((now - createdStartRef.current) / 1000)
      setCreatedTimeElapsed(formatTime(totalDiff))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Elapsed timer (stops when status changes to success)
  useEffect(() => {
    elapsedStartRef.current = Date.now()

    const interval = setInterval(() => {
      if (status === 'success') return

      const now = Date.now()
      const elapsedDiff = Math.floor((now - elapsedStartRef.current) / 1000)
      setElapsedTime(formatTime(elapsedDiff))
    }, 1000)

    return () => clearInterval(interval)
  }, [status])

  return (
    <div className="flex justify-between gap-12">
      <div className="flex flex-col">
        <span className="text-foreground-5">Commit</span>
        <span className="text-primary">{commit}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-foreground-5">Branch</span>
        <span className="text-primary">{branch}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-foreground-5">Status</span>
        <ExecutionStatus.Badge status={status} minimal />
      </div>
      <div className="flex flex-col">
        <span className="text-foreground-5">Build time</span>
        <span className="text-primary">{elapsedTime}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-foreground-5">Created</span>
        <span className="text-primary">{createdTimeElapsed}</span>
      </div>
    </div>
  )
}

export { PipelineStatus }
