import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const cache = new Map<string, Set<string>>()

const collectJsonFiles = (path: string): string[] => {
  if (!statSync(path).isDirectory()) return path.endsWith('.json') ? [path] : []
  return readdirSync(path)
    .filter(name => !name.startsWith('$'))
    .flatMap(name => collectJsonFiles(join(path, name)))
}

const walk = (node: unknown, prefix: string[], out: Set<string>): void => {
  if (node === null || typeof node !== 'object') return
  if ('$value' in node) {
    out.add(prefix.join('.'))
    return
  }
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue
    walk(child, [...prefix, key], out)
  }
}

/**
 * Every DTCG token path (dot-joined keys down to a node with `$value`) defined
 * in any JSON file under the given absolute paths. A path counts as defined if
 * any mode or theme file defines it.
 */
export const buildTokenIndex = (absolutePaths: string[]): Set<string> => {
  const cacheKey = absolutePaths.join('|')
  const cached = cache.get(cacheKey)
  if (cached) return cached

  const index = new Set<string>()
  for (const file of absolutePaths.flatMap(collectJsonFiles)) {
    walk(JSON.parse(readFileSync(file, 'utf8')), [], index)
  }
  cache.set(cacheKey, index)
  return index
}
