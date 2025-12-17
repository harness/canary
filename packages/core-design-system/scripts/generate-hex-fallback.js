/**
 * Generate colors_hex_new.json from colors_lch_new.json
 * This provides sRGB hex fallback values for browsers that don't support LCH
 *
 * Run: node scripts/generate-hex-fallback.js
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TOKENS_DIR = path.join(__dirname, '../design-tokens/core')

// LCH to sRGB conversion (simplified, clamped to sRGB gamut)
function lchToRgb(l, c, h) {
  // LCH to Lab
  const hRad = (h * Math.PI) / 180
  const a = c * Math.cos(hRad)
  const b = c * Math.sin(hRad)

  // Lab to XYZ (D65 illuminant)
  const fy = (l + 16) / 116
  const fx = a / 500 + fy
  const fz = fy - b / 200

  const xn = 0.95047
  const yn = 1.0
  const zn = 1.08883

  const x = xn * (fx > 0.206897 ? fx * fx * fx : (fx - 16 / 116) / 7.787)
  const y = yn * (fy > 0.206897 ? fy * fy * fy : (fy - 16 / 116) / 7.787)
  const z = zn * (fz > 0.206897 ? fz * fz * fz : (fz - 16 / 116) / 7.787)

  // XYZ to linear RGB
  let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314
  let g = x * -0.969266 + y * 1.8760108 + z * 0.041556
  let bl = x * 0.0556434 + y * -0.2040259 + z * 1.0572252

  // Linear RGB to sRGB
  const gamma = v => (v > 0.0031308 ? 1.055 * Math.pow(v, 1 / 2.4) - 0.055 : 12.92 * v)
  r = gamma(r)
  g = gamma(g)
  bl = gamma(bl)

  // Clamp to 0-255
  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(bl * 255)))
  }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function parseLCH(value) {
  const match = value?.match(/lch\((\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\)/)
  if (!match) return null
  return { l: parseFloat(match[1]), c: parseFloat(match[2]), h: parseFloat(match[3]) }
}

function lchToHex(lchValue) {
  const lch = parseLCH(lchValue)
  if (!lch) return null
  const rgb = lchToRgb(lch.l, lch.c, lch.h)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

async function generateHexFallback() {
  const lchPath = path.join(TOKENS_DIR, 'colors_lch_new.json')
  const hexPath = path.join(TOKENS_DIR, 'colors_hex_new.json')

  console.log('Reading colors_lch_new.json...')
  const lchContent = await fs.readFile(lchPath, 'utf-8')
  const lchTokens = JSON.parse(lchContent)

  const hexTokens = {}

  for (const [family, familyData] of Object.entries(lchTokens)) {
    if (family === 'pure') {
      // Handle pure.white and pure.black
      hexTokens.pure = {}
      for (const [colorName, colorData] of Object.entries(familyData)) {
        if (colorName.startsWith('$')) continue
        const hex = lchToHex(colorData.$value)
        hexTokens.pure[colorName] = {
          $type: 'color',
          $value: hex
        }
      }
    } else {
      // Handle color families with shades
      hexTokens[family] = { $type: 'color' }
      for (const [shade, shadeData] of Object.entries(familyData)) {
        if (shade.startsWith('$')) continue
        if (shadeData.$value) {
          const hex = lchToHex(shadeData.$value)
          hexTokens[family][shade] = { $value: hex }
        }
      }
    }
  }

  console.log('Writing colors_hex_new.json...')
  await fs.writeFile(hexPath, JSON.stringify(hexTokens, null, 2) + '\n')
  console.log('✓ Generated colors_hex_new.json')
}

generateHexFallback().catch(console.error)
