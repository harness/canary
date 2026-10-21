/**
 * esbuild CSS minify collapses `content: "\200B"` into a literal U+200B.
 * Linked stylesheets without a charset are often decoded as Windows-1252, so
 * those bytes (E2 80 8B) render as visible `â€‹` (UUI-3134). Rewrite the
 * character to a CSS escape so the emitted stylesheet stays ASCII-only.
 */
export function preserveCssUnicodeEscapes(css: string): string {
  return css.replace(/\u200B/g, '\\200B')
}
