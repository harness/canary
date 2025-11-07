import React, { createRef } from 'react'

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { Progress } from '../progress'

const iconCalls: Array<{ name: string; className?: string }> = []
const { hashMock } = vi.hoisted(() => ({ hashMock: vi.fn(() => 'hash123') }))

vi.mock('@components/icon-v2', () => ({
  IconV2: ({ name, className, ...props }: any) => {
    iconCalls.push({ name, className })
    return (
      <span data-testid={`progress-icon-${iconCalls.length - 1}`} data-name={name} className={className} {...props} />
    )
  }
}))

vi.mock('@components/text', () => ({
  Text: ({ children, ...props }: any) => (
    <span data-testid="progress-text" data-props={JSON.stringify(props)}>
      {children}
    </span>
  )
}))

vi.mock('@utils/utils', async importOriginal => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    generateAlphaNumericHash: hashMock
  }
})

beforeEach(() => {
  iconCalls.length = 0
  hashMock.mockClear()
})

afterEach(() => {
  cleanup()
})

describe('Progress', () => {
  test('renders determinate progress with label, description, and subtitle', () => {
    render(
      <Progress label="Deploy" description="Deployment in progress" subtitle="ETA 5m" value={0.75} state="completed" />
    )

    const progressElement = screen.getByRole('progressbar') as HTMLProgressElement
    expect(progressElement).toHaveAttribute('value', '75')
    expect(progressElement).toHaveAttribute('max', '100')
    expect(progressElement.id).toBe('progress-hash123')
    expect(hashMock).toHaveBeenCalledTimes(1)

    expect(screen.getByText('Deploy')).toBeInTheDocument()
    expect(screen.getByText('Deployment in progress')).toBeInTheDocument()
    expect(screen.getByText('ETA 5m')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(iconCalls[0]).toMatchObject({ name: 'check-circle' })
  })

  test('clamps value below zero to zero percent', () => {
    render(<Progress value={-1} label="Negative" />)

    const progressElement = screen.getByRole('progressbar')
    expect(progressElement).toHaveAttribute('value', '0')
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  test('clamps value above one to one hundred percent', () => {
    render(<Progress value={2} label="Overflow" />)

    const progressElement = screen.getByRole('progressbar')
    expect(progressElement).toHaveAttribute('value', '100')
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  test('hides icon and percentage when requested', () => {
    render(<Progress label="Hidden" value={0.5} hideIcon hidePercentage />)

    expect(screen.queryByText('50%')).not.toBeInTheDocument()
    expect(iconCalls).toHaveLength(0)
  })

  test('renders processing overlay with correct transform', () => {
    const { container } = render(<Progress label="Processing" value={0.25} state="processing" />)

    const overlay = container.querySelector('.cn-progress-processing-fake') as HTMLElement
    expect(overlay).toBeInTheDocument()
    expect(overlay.style.transform).toBe('translateX(-75%)')
  })

  test('renders indeterminate variant without icon or percentage', () => {
    const { container } = render(<Progress label="Indeterminate" variant="indeterminate" />)

    const indeterminate = container.querySelector('.cn-progress-indeterminate-fake')
    expect(indeterminate).toBeInTheDocument()
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
    expect(iconCalls).toHaveLength(0)
    const progressElement = container.querySelector('progress') as HTMLProgressElement
    expect(progressElement.hasAttribute('value')).toBe(false)
  })

  test('uses provided id and adjusts max when hideContainer is true', () => {
    render(<Progress label="Custom" id="custom-progress" hideContainer value={0.2} />)

    const progressElement = screen.getByRole('progressbar') as HTMLProgressElement
    expect(progressElement.id).toBe('custom-progress')
    expect(progressElement).toHaveAttribute('value', '20')
    expect(progressElement).toHaveAttribute('max', '20')
    expect(hashMock).not.toHaveBeenCalled()
  })

  test('applies size and state classes and renders correct icons', () => {
    const { container: failedContainer } = render(<Progress label="Failed" state="failed" size="lg" value={0.4} />)

    const root = failedContainer.firstElementChild as HTMLElement
    expect(root.className).toContain('cn-progress-lg')
    expect(root.className).toContain('cn-progress-failed')
    expect(iconCalls[0]).toMatchObject({ name: 'xmark-circle' })

    cleanup()

    render(<Progress label="Paused" state="paused" value={0.3} />)
    expect(iconCalls.at(-1)).toMatchObject({ name: 'pause' })
  })

  test('forwards ref to the underlying progress element', () => {
    const ref = createRef<HTMLProgressElement>()
    render(<Progress label="Ref" value={0.1} ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLProgressElement)
  })

  test('renders header when label is absent but percentage is shown', () => {
    const { container } = render(<Progress value={0.4} />)

    const header = container.querySelector('.cn-progress-header') as HTMLElement
    expect(header).toBeInTheDocument()
    expect(screen.getByText('40%')).toBeInTheDocument()
  })

  test('omits header when label, icon, and percentage are hidden', () => {
    const { container } = render(<Progress value={0.4} hideIcon hidePercentage />)

    const header = container.querySelector('.cn-progress-header')
    expect(header).toBeNull()
  })
})
