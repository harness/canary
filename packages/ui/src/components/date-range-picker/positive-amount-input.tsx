import { KeyboardEvent, useEffect, useState } from 'react'

import { Input } from '../input'

const digitsOnly = (raw: string) => raw.replace(/\D/g, '')

const parsePositiveAmount = (raw: string, fallback: number) => {
  const next = Number.parseInt(digitsOnly(raw), 10)
  return Number.isFinite(next) && next >= 1 ? next : fallback
}

export interface PositiveAmountInputProps {
  value: number
  onChange: (amount: number) => void
  'aria-label': string
}

/** Compact integer field: no native spinner; up/down arrows step by one. */
export const PositiveAmountInput = ({ value, onChange, 'aria-label': ariaLabel }: PositiveAmountInputProps) => {
  const [text, setText] = useState(String(value))

  useEffect(() => {
    setText(String(value))
  }, [value])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const current = parsePositiveAmount(text, value)
      onChange(event.key === 'ArrowUp' ? current + 1 : Math.max(1, current - 1))
    }
  }

  return (
    <Input
      aria-label={ariaLabel}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      value={text}
      title="Type an amount, or use the up and down arrow keys"
      onChange={event => {
        const nextText = digitsOnly(event.target.value)
        setText(nextText)
        const next = Number.parseInt(nextText, 10)
        if (Number.isFinite(next) && next >= 1) onChange(next)
      }}
      onKeyDown={handleKeyDown}
      onBlur={() => {
        const next = parsePositiveAmount(text, value)
        setText(String(next))
        if (next !== value) onChange(next)
      }}
      className="px-cn-xs text-center"
      // shrink-0 keeps the digits readable when the row runs out of room.
      wrapperClassName="w-16 shrink-0"
    />
  )
}

PositiveAmountInput.displayName = 'PositiveAmountInput'
