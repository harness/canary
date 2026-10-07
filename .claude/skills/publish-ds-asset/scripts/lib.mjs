/**
 * Shared asset-processing logic for the publish-ds-asset skill.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * WHY THIS FILE EXISTS / WHEN TO CHANGE IT
 *
 * The SVGO pipelines and name-map templates below are a deliberate REPLICA of
 * packages/ui/scripts/icons.js and packages/ui/scripts/logos.js. They are
 * duplicated rather than imported because both of those scripts export nothing
 * and end in a bare top-level `await downloadIcons()` / `await downloadLogos()`
 * — importing either one would trigger a full several-hundred-asset Figma
 * download as an import side effect.
 *
 * Duplication means drift risk. That risk is contained by parity-check.mjs,
 * which re-derives an ALREADY-COMMITTED asset through this file and asserts the
 * result is byte-identical to what is on disk. Run it before trusting any
 * output from here.
 *
 * If you change packages/ui/scripts/{icons,logos}.js, mirror the change here
 * and re-run the parity check.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { promises as fs } from 'fs'
import { createRequire } from 'module'
import path from 'path'
import { pathToFileURL } from 'url'

import { sortFilenames, toAssetKey, toComponentName } from './names.mjs'

/**
 * svgo and liquidjs live in packages/ui/node_modules, but these scripts live in
 * .claude/skills/. Node resolves bare specifiers relative to the IMPORTING
 * file, not the cwd, so a plain `import 'svgo'` fails here. Resolve against the
 * cwd's package.json instead — which also means a wrong cwd produces a useful
 * message rather than a raw ERR_MODULE_NOT_FOUND.
 */
async function loadFromPackagesUi(name) {
  const require = createRequire(path.join(process.cwd(), 'package.json'))
  let resolved
  try {
    resolved = require.resolve(name)
  } catch {
    // This runs during module evaluation, before any main().catch() can help,
    // so print and exit here rather than throwing a stack trace at the user.
    console.error(
      `\n❌ Could not resolve "${name}" from ${process.cwd()}\n\n` +
        `  These scripts must run with packages/ui as the working directory, with its\n` +
        `  dependencies installed:\n\n` +
        `      cd packages/ui && pnpm install\n\n` +
        `  A fresh git worktree has no node_modules at all — that is the usual cause.\n`
    )
    process.exit(1)
  }
  return import(pathToFileURL(resolved).href)
}

const { optimize } = await loadFromPackagesUi('svgo')
const { Liquid } = await loadFromPackagesUi('liquidjs')

const engine = new Liquid()

/** Paths are relative to packages/ui/ — every script here must run from there. */
export const PATHS = {
  icon: {
    svgDir: 'src/components/icon-v2/icons',
    map: 'src/components/icon-v2/icon-name-map.ts'
  },
  logo: {
    svgDir: 'src/components/logo-v2/logos',
    map: 'src/components/logo-v2/logo-name-map.ts'
  },
  symbol: {
    svgDir: 'src/components/logo-v2/symbols',
    map: 'src/components/logo-v2/symbol-name-map.ts'
  }
}

// ─── Shared SVGO preamble (identical in both upstream scripts) ───────────────

const BASE_PLUGINS = [
  {
    name: 'preset-default',
    params: {
      overrides: {
        removeViewBox: false,
        removeUnknownsAndDefaults: {
          keepRoleAttr: true,
          keepAriaAttrs: true
        }
      }
    }
  },
  {
    name: 'removeAttrs',
    params: {
      attrs: ['width', 'height']
    }
  }
]

// ─── Icon pipeline — mirrors icons.js processSvgForTheming() ─────────────────

/** Replaces every fill/stroke (except `none`) with currentColor, incl. inside style="". */
const themifyPlugin = {
  name: 'themify',
  type: 'visitor',
  fn: () => ({
    element: {
      enter: node => {
        if (node.attributes.style) {
          node.attributes.style = node.attributes.style.replace(
            /(fill|stroke)\s*:\s*([^;]+)/g,
            (match, prop, value) => (value.trim() === 'none' ? match : `${prop}:currentColor`)
          )
        }
        if (node.attributes.fill && node.attributes.fill !== 'none') {
          node.attributes.fill = 'currentColor'
        }
        if (node.attributes.stroke && node.attributes.stroke !== 'none') {
          node.attributes.stroke = 'currentColor'
        }
      }
    }
  })
}

export function processIcon(svgContent) {
  return optimize(svgContent, { plugins: [...BASE_PLUGINS, themifyPlugin] }).data
}

// ─── Logo pipeline — mirrors logos.js processSvgForTheming() ─────────────────

/**
 * Wraps the mark in a 0.7-scale centering group, then sandwiches it between a
 * brand-hex background rect and a theme-aware inset stroke overlay.
 */
function makeBackgroundPlugin(fillColor) {
  return {
    name: 'addBackgroundAndCenterLogo',
    type: 'perItem',
    fn: item => {
      if (item.type === 'root' && item.children?.[0]?.name === 'svg') {
        const svgElement = item.children[0]

        svgElement.attributes = {
          ...svgElement.attributes,
          'shape-rendering': 'geometricPrecision'
        }

        if (svgElement.children && svgElement.children.length > 0) {
          const existingChildren = [...svgElement.children]

          const viewBox = svgElement.attributes?.viewBox || '0 0 22 22'
          let [minX, minY, width, height] = viewBox.split(' ').map(Number)

          if (isNaN(width) || isNaN(height)) {
            width = height = 22
            minX = minY = 0
          }

          const centerX = minX + width / 2
          const centerY = minY + height / 2
          const scale = 0.7

          const centeringGroup = {
            type: 'element',
            name: 'g',
            attributes: {
              transform: `translate(${centerX}, ${centerY}) scale(${scale}) translate(${-centerX}, ${-centerY})`
            },
            children: existingChildren
          }

          if (fillColor) {
            const bgRectElement = {
              type: 'element',
              name: 'rect',
              attributes: {
                width: String(width),
                height: String(height),
                rx: '3',
                ry: '3',
                fill: fillColor
              },
              children: []
            }

            const strokeWidth = 0.6
            const strokeRectElement = {
              type: 'element',
              name: 'rect',
              attributes: {
                x: String(minX + strokeWidth / 2),
                y: String(minY + strokeWidth / 2),
                width: String(width - strokeWidth),
                height: String(height - strokeWidth),
                rx: '3',
                ry: '3',
                fill: 'none',
                stroke: 'var(--cn-comp-avatar-shadow)',
                'stroke-width': String(strokeWidth)
              },
              children: []
            }

            svgElement.children = [bgRectElement, centeringGroup, strokeRectElement]
          } else {
            svgElement.children = [centeringGroup]
          }
        }
      }
    }
  }
}

/**
 * @param {string} svgContent raw SVG as exported from Figma
 * @param {string} fillColor brand hex from the Figma component's description field.
 *   Empty string is legal upstream and yields no background and no border — which
 *   renders as a broken-looking LogoV2. Callers should treat empty as an error.
 */
export function processLogo(svgContent, fillColor) {
  return optimize(svgContent, {
    plugins: [...BASE_PLUGINS, makeBackgroundPlugin(fillColor)]
  }).data
}

// ─── Symbol pipeline — mirrors logos.js processSvgForSymbol() ────────────────

/** Note: unlike `themify`, this does NOT touch style="" — matching upstream. */
const replaceWithCurrentColorPlugin = {
  name: 'replaceWithCurrentColor',
  fn: () => ({
    element: {
      enter: node => {
        if (node.attributes?.fill && node.attributes.fill !== 'none') {
          node.attributes.fill = 'currentColor'
        }
        if (node.attributes?.stroke && node.attributes.stroke !== 'none') {
          node.attributes.stroke = 'currentColor'
        }
      }
    }
  })
}

export function processSymbol(svgContent) {
  return optimize(svgContent, {
    plugins: [...BASE_PLUGINS, replaceWithCurrentColorPlugin]
  }).data
}

// ─── Name helpers ──────────────────────────────────────────────────────────

// Defined in names.mjs so the linter can use them without pulling in svgo.
// Re-exported here so existing importers of lib.mjs keep working.
export {
  sanitizeFilename,
  toComponentName,
  toAssetKey,
  sortFilenames,
  VALID_NAME,
  parseArgs
} from './names.mjs'

// ─── Name-map rendering ─────────────────────────────────────────────────────

const MAP_TEMPLATES = {
  icon: {
    label: 'icon',
    exportName: 'IconNameMapV2',
    importDir: './icons/'
  },
  logo: {
    label: 'logo',
    exportName: 'LogoNameMapV2',
    importDir: './logos/'
  },
  symbol: {
    label: 'symbol',
    exportName: 'SymbolNameMap',
    importDir: './symbols/'
  }
}

/**
 * Rendered through liquidjs with the same template string as upstream, so the
 * output is byte-identical rather than merely similar.
 */
function buildTemplate(kind) {
  const { label, exportName, importDir } = MAP_TEMPLATES[kind]
  return `/**
 * Harness Design System
 * Generated ${label} map - DO NOT EDIT DIRECTLY
 */
{% for asset in assets %}
import {{ asset.componentName }} from '${importDir}{{ asset.filename }}'
{%- endfor %}

export const ${exportName} = {
{%- for asset in assets %}
  {% if asset.assetKey contains '-' %}'{{ asset.assetKey }}'{% else %}{{ asset.assetKey }}{% endif %}: {{ asset.componentName }}{%- unless forloop.last %},
{%- endunless %}
{%- endfor %}
}
`
}

/**
 * Pull the ordered filename list back out of an existing generated map.
 *
 * LOAD-BEARING: the asset list is derived from the COMMITTED MAP, never from a
 * readdir of the svg directory. Those two disagree — the repo carries SVGs on
 * disk that are absent from the maps (orphans from assets removed from the
 * Figma export page whose files were never deleted). Scanning the directory
 * would silently fold every orphan into the map and turn a two-line change into
 * a hundred-line one.
 */
export function parseMapFilenames(mapContent, kind) {
  const { importDir } = MAP_TEMPLATES[kind]
  const escaped = importDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`from '${escaped}(.+?)'`, 'g')
  return [...mapContent.matchAll(re)].map(m => m[1])
}

export async function renderMap(filenames, kind) {
  const assets = sortFilenames(filenames).map(filename => ({
    filename,
    componentName: toComponentName(filename),
    assetKey: toAssetKey(filename)
  }))
  return engine.parseAndRender(buildTemplate(kind), { assets })
}

// ─── Small utilities ────────────────────────────────────────────────────────

export async function readIfExists(p) {
  try {
    return await fs.readFile(p, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') return null
    throw err
  }
}

/** Fail loudly and early if a script was launched from the wrong directory. */
export async function assertRunFromPackagesUi() {
  const pkg = await readIfExists(path.resolve('package.json'))
  if (!pkg || !JSON.parse(pkg).name?.includes('@harnessio/ui')) {
    throw new Error(
      'This script must be run from packages/ui (it resolves svgo, liquidjs and ' +
        'the src/components paths relative to it).\n' +
        `  cwd is: ${process.cwd()}`
    )
  }
}

