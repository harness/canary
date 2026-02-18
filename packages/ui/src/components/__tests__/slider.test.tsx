import { render, RenderResult, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { SeveritySlider, Slider } from '../slider'

// --- Slider ---

const renderSlider = (props: Partial<React.ComponentProps<typeof Slider>> = {}): RenderResult => {
  return render(<Slider defaultValue={[50]} {...props} />)
}

describe('Slider', () => {
  test('should render slider element', () => {
    renderSlider()

    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
  })

  test('should render with label', () => {
    renderSlider({ label: 'Volume' })

    expect(screen.getByText('Volume')).toBeInTheDocument()
  })

  test('should render with description', () => {
    renderSlider({ description: 'Adjust the volume level' })

    expect(screen.getByText('Adjust the volume level')).toBeInTheDocument()
  })

  test('should render value display when showValue is true', () => {
    renderSlider({ showValue: true, defaultValue: [60] })

    expect(screen.getByText('60')).toBeInTheDocument()
  })

  test('should render range value display', () => {
    renderSlider({ showValue: true, defaultValue: [20, 70] })

    expect(screen.getByText('20 – 70')).toBeInTheDocument()
  })

  test('should use custom formatValue', () => {
    renderSlider({
      showValue: true,
      defaultValue: [50],
      formatValue: (v: number[]) => `${v[0]}%`
    })

    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  test('should render multiple thumbs for range', () => {
    renderSlider({ defaultValue: [20, 80] })

    const sliders = screen.getAllByRole('slider')
    expect(sliders).toHaveLength(2)
  })

  test('should apply custom className', () => {
    const { container } = renderSlider({ className: 'my-custom-class' })

    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('my-custom-class')
  })

  test('should be disabled when disabled prop is true', () => {
    renderSlider({ disabled: true })

    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('data-disabled', 'true')
  })

  test('should render with min and max', () => {
    renderSlider({ min: 10, max: 200, defaultValue: [100] })

    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuemin', '10')
    expect(slider).toHaveAttribute('aria-valuemax', '200')
    expect(slider).toHaveAttribute('aria-valuenow', '100')
  })

  test('should not render description when not provided', () => {
    const { container } = renderSlider()

    const description = container.querySelector('.cn-slider-description')
    expect(description).not.toBeInTheDocument()
  })

  test('should have correct display name', () => {
    expect(Slider.displayName).toBe('Slider')
  })

  test('should forward ref', () => {
    const ref = vi.fn()
    render(<Slider ref={ref} defaultValue={[50]} />)

    expect(ref).toHaveBeenCalled()
  })

  test('should render track and range elements', () => {
    const { container } = renderSlider()

    expect(container.querySelector('.cn-slider-track')).toBeInTheDocument()
    expect(container.querySelector('.cn-slider-range')).toBeInTheDocument()
  })

  test('should render thumb element', () => {
    const { container } = renderSlider()

    expect(container.querySelector('.cn-slider-thumb')).toBeInTheDocument()
  })

  test('should render min-max labels when caption is min-max', () => {
    renderSlider({ caption: 'min-max' })

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  test('should render custom min-max labels', () => {
    renderSlider({ caption: 'min-max', minLabel: '10', maxLabel: '200' })

    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
  })

  test('should not render description when caption is min-max', () => {
    const { container } = renderSlider({ caption: 'min-max', description: 'Some text' })

    expect(container.querySelector('.cn-slider-description')).not.toBeInTheDocument()
    expect(container.querySelector('.cn-slider-minmax')).toBeInTheDocument()
  })

  test('should render tooltip element inside thumb', () => {
    const { container } = renderSlider({ defaultValue: [50] })

    expect(container.querySelector('.cn-slider-thumb')).toBeInTheDocument()
  })
})

// --- SeveritySlider ---

const renderSeverity = (props: Partial<React.ComponentProps<typeof SeveritySlider>> = {}): RenderResult => {
  return render(<SeveritySlider {...props} />)
}

describe('SeveritySlider', () => {
  test('should render two slider thumbs', () => {
    renderSeverity()

    const sliders = screen.getAllByRole('slider')
    expect(sliders).toHaveLength(2)
  })

  test('should render with label', () => {
    renderSeverity({ label: 'Severity' })

    expect(screen.getByText('Severity')).toBeInTheDocument()
  })

  test('should render default severity labels', () => {
    renderSeverity()

    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Critical')).toBeInTheDocument()
  })

  test('should render custom labels', () => {
    renderSeverity({ labels: ['None', 'Minor', 'Major', 'Blocker'] })

    expect(screen.getByText('None')).toBeInTheDocument()
    expect(screen.getByText('Minor')).toBeInTheDocument()
    expect(screen.getByText('Major')).toBeInTheDocument()
    expect(screen.getByText('Blocker')).toBeInTheDocument()
  })

  test('should not render labels when empty array', () => {
    const { container } = renderSeverity({ labels: [] })

    const labelsRow = container.querySelector('.cn-slider-severity-labels')
    expect(labelsRow).not.toBeInTheDocument()
  })

  test('should render gradient track', () => {
    const { container } = renderSeverity()

    const track = container.querySelector('.cn-slider-severity-track')
    expect(track).toBeInTheDocument()
  })

  test('should render range element for masking', () => {
    const { container } = renderSeverity()

    const range = container.querySelector('.cn-slider-severity-range')
    expect(range).toBeInTheDocument()
  })

  test('should have correct aria labels on thumbs', () => {
    renderSeverity()

    expect(screen.getByLabelText('Minimum value')).toBeInTheDocument()
    expect(screen.getByLabelText('Maximum value')).toBeInTheDocument()
  })

  test('should apply custom className', () => {
    const { container } = renderSeverity({ className: 'my-severity' })

    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('my-severity')
  })

  test('should be disabled when disabled prop is true', () => {
    renderSeverity({ disabled: true })

    const sliders = screen.getAllByRole('slider')
    sliders.forEach(slider => {
      expect(slider).toHaveAttribute('data-disabled', 'true')
    })
  })

  test('should have correct display name', () => {
    expect(SeveritySlider.displayName).toBe('SeveritySlider')
  })

  test('should forward ref', () => {
    const ref = vi.fn()
    render(<SeveritySlider ref={ref} />)

    expect(ref).toHaveBeenCalled()
  })

  test('should render with custom min/max', () => {
    renderSeverity({ min: 0, max: 200, defaultValue: [50, 150] })

    const sliders = screen.getAllByRole('slider')
    expect(sliders[0]).toHaveAttribute('aria-valuemin', '0')
    expect(sliders[0]).toHaveAttribute('aria-valuemax', '200')
  })
})
