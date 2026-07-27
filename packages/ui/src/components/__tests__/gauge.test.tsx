import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { deriveGaugeStatusLevel, formatGaugeValue, Gauge, getGaugeDescriptor } from '../gauge'

describe('Gauge utilities', () => {
  test('formatGaugeValue percent', () => {
    expect(formatGaugeValue(15, 100, 'percent')).toBe('15%')
  })

  test('formatGaugeValue fraction', () => {
    expect(formatGaugeValue(1.5, 10, 'fraction', 1)).toBe('1.5 / 10.0')
  })

  test('formatGaugeValue score', () => {
    expect(formatGaugeValue(72, 100, 'score')).toBe('72')
  })

  test('deriveGaugeStatusLevel maps thresholds', () => {
    expect(deriveGaugeStatusLevel(15, 'auto')).toBe('poor')
    expect(deriveGaugeStatusLevel(65, 'auto')).toBe('fair')
    expect(deriveGaugeStatusLevel(85, 'auto')).toBe('good')
    expect(deriveGaugeStatusLevel(85, 'none')).toBe('none')
  })

  test('deriveGaugeStatusLevel respects explicit status', () => {
    expect(deriveGaugeStatusLevel(90, 'poor')).toBe('poor')
    expect(deriveGaugeStatusLevel(10, 'good')).toBe('good')
  })

  test('deriveGaugeStatusLevel uses custom thresholds', () => {
    expect(deriveGaugeStatusLevel(40, 'auto', { poor: 50, fair: 80 })).toBe('poor')
    expect(deriveGaugeStatusLevel(60, 'auto', { poor: 50, fair: 80 })).toBe('fair')
    expect(deriveGaugeStatusLevel(90, 'auto', { poor: 50, fair: 80 })).toBe('good')
  })

  test('getGaugeDescriptor returns mapped label', () => {
    expect(getGaugeDescriptor('poor')).toBe('Poor')
    expect(getGaugeDescriptor('none')).toBeUndefined()
    expect(getGaugeDescriptor('fair', { poor: 'At risk', fair: 'Watch', good: 'Healthy' })).toBe('Watch')
  })
})

describe('Gauge', () => {
  test('renders gauge with value', () => {
    render(<Gauge value={15} label="Score" />)

    expect(screen.getByRole('meter')).toBeInTheDocument()
    expect(screen.getByText('15%')).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
    expect(screen.getByText('Poor')).toBeInTheDocument()
  })

  test('renders sizes', () => {
    const { container } = render(<Gauge size="lg" value={85} />)

    expect(container.querySelector('.cn-gauge-size-lg')).toBeInTheDocument()
    expect(screen.getByText('Good')).toBeInTheDocument()
  })

  test('renders fraction format', () => {
    render(<Gauge value={1.5} max={10} valueFormat="fraction" precision={1} />)

    expect(screen.getByText('1.5 / 10.0')).toBeInTheDocument()
  })

  test('renders score format', () => {
    render(<Gauge value={72} valueFormat="score" />)

    expect(screen.getByText('72')).toBeInTheDocument()
  })

  test('clamps value to max', () => {
    render(<Gauge value={150} max={100} />)

    const meter = screen.getByRole('meter')
    expect(meter).toHaveAttribute('aria-valuenow', '100')
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  test('hides value when showValue is false', () => {
    render(<Gauge value={40} showValue={false} />)

    expect(screen.queryByText('40%')).not.toBeInTheDocument()
  })

  test('hides label when showLabel is false', () => {
    render(<Gauge value={40} label="Score" showLabel={false} />)

    expect(screen.queryByText('Score')).not.toBeInTheDocument()
  })

  test('uses neutral status when status is none', () => {
    const { container } = render(<Gauge value={15} status="none" />)

    expect(container.querySelector('.cn-gauge-status-none')).toBeInTheDocument()
    expect(screen.queryByText('Poor')).not.toBeInTheDocument()
  })

  test('forces explicit status regardless of value', () => {
    const { container } = render(<Gauge value={90} status="poor" />)

    expect(container.querySelector('.cn-gauge-status-poor')).toBeInTheDocument()
    expect(screen.getByText('Poor')).toBeInTheDocument()
  })

  test('applies custom thresholds and status labels', () => {
    render(
      <Gauge
        value={40}
        thresholds={{ poor: 50, fair: 80 }}
        statusLabelMap={{ poor: 'At risk', fair: 'Watch', good: 'Healthy' }}
      />
    )

    expect(screen.getByText('At risk')).toBeInTheDocument()
  })

  test('applies custom className', () => {
    const { container } = render(<Gauge value={10} className="custom-gauge" />)

    expect(container.querySelector('.custom-gauge')).toHaveClass('cn-gauge')
  })

  test('exposes meter semantics', () => {
    render(
      <Gauge
        value={42}
        max={100}
        aria-label="Health score"
        aria-describedby="external-desc"
        helperText="Updated 5 minutes ago"
      />
    )

    const meter = screen.getByRole('meter')
    expect(meter).toHaveAttribute('aria-valuenow', '42')
    expect(meter).toHaveAttribute('aria-valuemin', '0')
    expect(meter).toHaveAttribute('aria-valuemax', '100')
    expect(meter).toHaveAttribute('aria-label', 'Health score')
    expect(meter.getAttribute('aria-describedby')).toContain('external-desc')
    expect(screen.getByText('Updated 5 minutes ago')).toBeInTheDocument()
  })

  test('meter attributes win over conflicting rest props', () => {
    render(<Gauge value={42} aria-valuenow={1} aria-label="Health score" />)

    const meter = screen.getByRole('meter')
    expect(meter).toHaveAttribute('aria-valuenow', '42')
    expect(meter).toHaveAttribute('aria-label', 'Health score')
  })
})
