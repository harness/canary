import { formatDuration, formatTimestamp, getFormattedDuration } from '../TimeUtils'

describe('getFormattedDuration', () => {
  it('should return "0s" if startTs is greater than or equal to endTs', () => {
    expect(getFormattedDuration(1000, 500)).toBe('0s')
    expect(getFormattedDuration(1000, 1000)).toBe('0s')
  })

  it('should return formatted duration in "1h 2m 3s" format', () => {
    expect(getFormattedDuration(0, 3723000)).toBe('1h 2m 3s')
    expect(getFormattedDuration(0, 7200000)).toBe('2h')
    expect(getFormattedDuration(0, 60000)).toBe('1m')
    expect(getFormattedDuration(0, 1000)).toBe('1s')
  })

  it('should handle durations with only seconds', () => {
    expect(getFormattedDuration(0, 5000)).toBe('5s')
  })

  it('should handle durations with hours, minutes, and seconds', () => {
    expect(getFormattedDuration(0, 3661000)).toBe('1h 1m 1s')
  })
})

describe('formatDuration', () => {
  it('should return "0s" if duration is 0', () => {
    expect(formatDuration(0)).toBe('0s')
  })

  it('should return formatted duration in "1h 2m 3s" format for milliseconds', () => {
    expect(formatDuration(3723000, 'ms')).toBe('1h 2m 3s')
  })

  it('should return formatted duration in "1h 2m 3s" format for nanoseconds', () => {
    expect(formatDuration(3723000000000, 'ns')).toBe('1h 2m 3s')
  })

  it('should handle durations with only milliseconds', () => {
    expect(formatDuration(500, 'ms')).toBe('500ms')
  })

  it('should handle durations with only nanoseconds', () => {
    expect(formatDuration(500000000, 'ns')).toBe('500ms')
  })

  it('should handle durations with hours, minutes, and seconds', () => {
    expect(formatDuration(3661000, 'ms')).toBe('1h 1m 1s')
  })
})

describe('formatTimestamp', () => {
  const fixedDate = new Date('2023-01-01T12:34:56.789Z')

  beforeAll(() => {
    vi.setSystemTime(fixedDate)
  })

  it('should format epoch timestamp into "HH:mm:ss.SSS" format', () => {
    const timestamp = fixedDate.getTime()
    expect(formatTimestamp(timestamp)).toBe('12:34:56.789')
  })

  it('should handle different times of the day', () => {
    const morningTimestamp = new Date('2023-01-01T08:00:00.000Z').getTime()
    const eveningTimestamp = new Date('2023-01-01T20:00:00.000Z').getTime()
    expect(formatTimestamp(morningTimestamp)).toBe('08:00:00.000')
    expect(formatTimestamp(eveningTimestamp)).toBe('20:00:00.000')
  })
})
