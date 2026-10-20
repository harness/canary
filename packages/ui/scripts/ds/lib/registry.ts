export interface RegistryEntry {
  prefix: string
  component: string
  retired: string[]
  line: number
}

export interface Registry {
  entries: Map<string, RegistryEntry>
  duplicates: RegistryEntry[]
}

const ROW = /^\|\s*([A-Z]{2,5})\s*\|\s*([A-Za-z0-9]+)\s*\|([^|]*)\|\s*$/

export const parseRegistry = (source: string): Registry => {
  const entries = new Map<string, RegistryEntry>()
  const duplicates: RegistryEntry[] = []

  source.split('\n').forEach((text, index) => {
    const match = ROW.exec(text)
    if (!match) return
    const entry: RegistryEntry = {
      prefix: match[1],
      component: match[2],
      retired: match[3].match(/[A-Z]{2,5}-\d{3}/g) ?? [],
      line: index + 1
    }
    if (entries.has(entry.prefix)) duplicates.push(entry)
    else entries.set(entry.prefix, entry)
  })

  return { entries, duplicates }
}

export const prefixFor = (registry: Registry, component: string): string | undefined =>
  [...registry.entries.values()].find(entry => entry.component === component)?.prefix
