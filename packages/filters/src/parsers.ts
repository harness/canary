import { Parser } from './types'

export const defaultStringParser: Parser<unknown> = {
  parse: (value: string) => value,
  serialize: (value: unknown) => String(value)
}

export const booleanParser: Parser<boolean> = {
  parse: (value: string) => value === 'true',
  serialize: (value: boolean) => (value ? 'true' : 'false')
}

export const stringArrayParser: Parser<string[]> = {
  parse: (value: string) => {
    if (!value) {
      return []
    }
    return value.split(',').map(item => item.trim())
  },
  serialize: (value: string[]) => {
    if (!Array.isArray(value)) return ''
    return value.join(',')
  }
}

export const booleanArrayParser: Parser<boolean[]> = {
  parse: (value: string) => {
    if (!value) return [] // Return empty array if the string is empty
    return value.split(',').map(item => item.trim().toLowerCase() === 'true') // Convert each value to a boolean
  },
  serialize: (value: boolean[]) => {
    if (!Array.isArray(value)) return '' // Return empty string if the value is not an array
    return value.map(item => item.toString()).join(',') // Convert each boolean to a string and join with commas
  }
}

export const dateTimeParser: Parser<[Date, Date]> = {
  parse: (value: string) => {
    if (!value) {
      const start = new Date()
      start.setHours(0, 0, 0, 0)

      const end = new Date()
      end.setHours(23, 59, 59, 999)

      return [start, end]
    }

    const [startTime, endTime] = value.split(',').map(time => new Date(Number(time)))
    return [startTime, endTime]
  },

  serialize: (value: [Date, Date]) => {
    const [start, end] = value
    return `${start.getTime()},${end.getTime()}`
  }
}
