export interface RegistryEntry {
  prefix: string
  component: string
  retired: string[]
  /** Retired ID -> the ID that replaced it, written as 'SBD-005 (EXS-001)' in the Retired column. */
  replacedBy: Map<string, string>
  line: number
}

export interface Registry {
  entries: Map<string, RegistryEntry>
  duplicates: RegistryEntry[]
}

const ROW = /^\|\s*([A-Z]{2,5})\s*\|\s*([A-Za-z0-9]+)\s*\|([^|]*)\|\s*$/
const RETIRED = /([A-Z]{2,5}-\d{3})(?:\s*\(([A-Z]{2,5}-\d{3})\))?/g

export const parseRegistry = (source: string): Registry => {
  const entries = new Map<string, RegistryEntry>()
  const duplicates: RegistryEntry[] = []

  source.split('\n').forEach((text, index) => {
    const match = ROW.exec(text)
    if (!match) return
    const retired = [...match[3].matchAll(RETIRED)]
    const entry: RegistryEntry = {
      prefix: match[1],
      component: match[2],
      retired: retired.map(m => m[1]),
      replacedBy: new Map(retired.filter(m => m[2]).map(m => [m[1], m[2]])),
      line: index + 1
    }
    if (entries.has(entry.prefix)) duplicates.push(entry)
    else entries.set(entry.prefix, entry)
  })

  return { entries, duplicates }
}

export const prefixFor = (registry: Registry, component: string): string | undefined =>
  [...registry.entries.values()].find(entry => entry.component === component)?.prefix

/** The registry row that retires an ID, if any. */
export const retiredEntry = (registry: Registry, id: string): RegistryEntry | undefined =>
  registry.entries.get(id.split('-')[0])?.retired.includes(id) ? registry.entries.get(id.split('-')[0]) : undefined
