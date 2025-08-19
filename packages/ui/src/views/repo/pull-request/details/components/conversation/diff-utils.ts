interface DiffLine {
  type: 'context' | 'add' | 'remove' | 'hunk'
  oldNumber: number | null
  newNumber: number | null
  line: string
  content: string
}

export function parseDiffToLines(lines: string[]): DiffLine[] {
  const parsed: DiffLine[] = []
  let oldNum = 0
  let newNum = 0

  for (const line of lines) {
    if (line.startsWith('@@')) {
      const match = /@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line)
      if (!match) continue

      oldNum = parseInt(match[1], 10)
      newNum = parseInt(match[2], 10)

      parsed.push({ type: 'hunk', oldNumber: oldNum, newNumber: newNum, line, content: line })
    } else if (line.startsWith('+')) {
      parsed.push({ type: 'add', oldNumber: null, newNumber: newNum++, line, content: line.slice(1) })
    } else if (line.startsWith('-')) {
      parsed.push({ type: 'remove', oldNumber: oldNum++, newNumber: null, line, content: line.slice(1) })
    } else if (line.startsWith(' ')) {
      parsed.push({ type: 'context', oldNumber: oldNum++, newNumber: newNum++, line, content: line.slice(1) })
    } else {
      // Skip diff metadata like diff --git, index, --- , +++
    }
  }

  return parsed
}

export function getDiffLinesRange(
  parsed: DiffLine[],
  side: 'old' | 'new',
  from: number,
  to: number,
  ignoreHunk = true
): DiffLine[] {
  return parsed.filter(line => {
    if (ignoreHunk && line.type === 'hunk') return false

    const num = side === 'old' ? line.oldNumber : line.newNumber
    return num !== null && num >= from && num <= to
  })
}
