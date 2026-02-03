export function lchToHex(lch: string): string | undefined {
  const match = lch.match(/lch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/i)
  if (!match) return undefined

  const L = parseFloat(match[1])
  const C = parseFloat(match[2])
  const Hdeg = parseFloat(match[3])

  // LCH → LAB
  const H = (Hdeg * Math.PI) / 180
  const a = Math.cos(H) * C
  const b = Math.sin(H) * C

  // LAB → XYZ (D65)
  let y = (L + 16) / 116
  let x = a / 500 + y
  let z = y - b / 200

  const labToXyz = (n: number) => (n ** 3 > 0.008856 ? n ** 3 : (n - 16 / 116) / 7.787)

  x = labToXyz(x) * 0.95047
  y = labToXyz(y) * 1.0
  z = labToXyz(z) * 1.08883

  // XYZ → linear RGB
  let r = 3.2406 * x - 1.5372 * y - 0.4986 * z
  let g = -0.9689 * x + 1.8758 * y + 0.0415 * z
  let bVal = 0.0557 * x - 0.204 * y + 1.057 * z

  // Gamma correction
  const gamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055)

  r = gamma(r)
  g = gamma(g)
  bVal = gamma(bVal)

  // Clamp + convert to hex
  const toHex = (c: number) =>
    Math.round(Math.min(1, Math.max(0, c)) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(r)}${toHex(g)}${toHex(bVal)}`
}

export function rgbToHex(colorRgb: string): string | undefined {
  const match = colorRgb.match(/\d+/g)
  if (!match || match.length < 3) return undefined

  const [r, g, b] = match.slice(0, 3).map(Number)

  return `#` + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}
