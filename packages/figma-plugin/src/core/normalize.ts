import type { CatalogProp } from "../schema/schema.js";

/**
 * Strip leading emoji / symbol decorators and trim whitespace.
 * Canary Figma enums often look like "⚫ default" or "👁️ disabled".
 */
export function stripFigmaDecorators(raw: string): string {
  let s = raw.trim();
  // Remove leading emoji / symbol clusters + following spaces
  // Covers variation selectors and ZWJ sequences used in Figma labels.
  s = s.replace(
    /^(?:[\p{Extended_Pictographic}\p{Symbol}\p{So}][\uFE0E\uFE0F\u200D]*)+\s*/u,
    "",
  );
  return s.trim();
}

/**
 * Normalize a Figma component property name for catalog matching:
 * - strip `#nodeId` suffixes Figma adds to TEXT/BOOLEAN props
 * - strip leading emoji decorators
 * - case-fold
 */
export function normalizePropName(raw: string): string {
  let s = raw.trim();
  s = s.replace(/#[\d:]+$/u, "");
  s = stripFigmaDecorators(s);
  return s.toLowerCase();
}

/**
 * Normalize a Figma property value against catalog prop rules.
 */
export function normalizeFigmaValue(
  raw: string | boolean | number,
  prop: CatalogProp,
): string | boolean | number {
  if (prop.type === "boolean") {
    if (typeof raw === "boolean") return raw;
    if (typeof raw === "number") return raw !== 0;
    const s = String(raw).trim().toLowerCase();
    if (s === "true" || s === "1" || s === "yes" || s === "on") return true;
    if (s === "false" || s === "0" || s === "no" || s === "off") return false;
    return Boolean(s);
  }

  if (typeof raw === "boolean" || typeof raw === "number") {
    return raw;
  }

  let value = stripFigmaDecorators(raw);

  value = prop.figmaValueAliases?.[value] ?? value;

  if (prop.figmaCaseInsensitive) {
    value = value.toLowerCase();
    // Prefer catalog canonical casing when a case-insensitive match exists
    if (prop.values) {
      const hit = prop.values.find((v) => v.toLowerCase() === value);
      if (hit !== undefined) return hit;
    }
  }

  return value;
}
