// Shared by build-component-index.cjs and the ai-kit test: the value exports of @harnessio/ui/components.
const fs = require('fs')
const path = require('path')

function readTypes(pkgDir) {
  return fs.readFileSync(path.join(pkgDir, 'dist', 'components.d.ts'), 'utf8')
}

function componentNames(dts) {
  const localValues = new Set([...dts.matchAll(/^(?:export )?declare (?:const|function|class|enum) ([A-Za-z0-9_]+)/gm)].map(m => m[1]))
  const exported = new Set([...dts.matchAll(/^export declare (?:const|function|class|enum) ([A-Za-z0-9_]+)/gm)].map(m => m[1]))

  // `export { Local as Public }` and `export { Name }`
  for (const m of dts.matchAll(/^export \{([^}]*)\}/gm)) {
    for (const part of m[1].split(',').map(s => s.trim()).filter(Boolean)) {
      const [local, , alias] = part.split(/\s+/)
      if (localValues.has(local)) exported.add(alias ?? local)
    }
  }
  return [...exported].filter(n => /^[A-Z]/.test(n) && !/^(use|Use)[A-Z]/.test(n)).sort()
}

module.exports = { readTypes, componentNames }
