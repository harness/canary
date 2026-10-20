import { parse as parseYaml } from 'yaml'

export interface GuideHeading {
  level: number
  id: string
  title: string
  line: number
  inKnownGaps: boolean
}

export interface ParsedGuide {
  frontMatter: unknown
  headings: GuideHeading[]
  /** Headings that mention a rule ID but do not match '## ID — title'. */
  malformedHeadings: { text: string; line: number }[]
  /** Body lines that restate rule metadata, which belongs in front matter only. */
  metadataLines: { text: string; line: number }[]
  frontMatterError?: string
}

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/
const RULE_HEADING = /^(#{2,3}) ([A-Z]{2,5}-\d{3}) — (.+)$/
const ANY_HEADING_WITH_ID = /^#{1,6} .*\b[A-Z]{2,5}-\d{3}\b/
const METADATA_LINE = /^\s*[-*]?\s*(\*\*)?(Status|Tier|Check)(\*\*)?\s*:/
const KNOWN_GAPS_HEADING = /^## Known gaps\s*$/

export const parseGuide = (source: string): ParsedGuide => {
  const match = FRONT_MATTER.exec(source)
  if (!match) {
    return {
      frontMatter: undefined,
      headings: [],
      malformedHeadings: [],
      metadataLines: [],
      frontMatterError: 'Guide has no YAML front matter block.'
    }
  }

  let frontMatter: unknown
  let frontMatterError: string | undefined
  try {
    frontMatter = parseYaml(match[1])
  } catch (error) {
    frontMatterError = `Front matter is not valid YAML: ${(error as Error).message}`
  }

  const bodyStartLine = match[0].split('\n').length
  const lines = source.slice(match[0].length).split('\n')
  const headings: GuideHeading[] = []
  const malformedHeadings: ParsedGuide['malformedHeadings'] = []
  const metadataLines: ParsedGuide['metadataLines'] = []
  let inKnownGaps = false
  let inFence = false

  lines.forEach((text, index) => {
    const line = bodyStartLine + index
    if (text.startsWith('```')) inFence = !inFence
    if (inFence) return

    if (text.startsWith('## ')) inKnownGaps = KNOWN_GAPS_HEADING.test(text)

    const heading = RULE_HEADING.exec(text)
    if (heading) {
      headings.push({ level: heading[1].length, id: heading[2], title: heading[3].trim(), line, inKnownGaps })
      return
    }
    if (ANY_HEADING_WITH_ID.test(text)) {
      malformedHeadings.push({ text, line })
      return
    }
    if (METADATA_LINE.test(text)) metadataLines.push({ text: text.trim(), line })
  })

  return { frontMatter, headings, malformedHeadings, metadataLines, frontMatterError }
}
