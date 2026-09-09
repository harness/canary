export interface NavCategory {
  /** Stable id used for active-state comparisons. */
  id: string;
  /** Label shown in the top navigation. */
  label: string;
  /** Landing page the tab links to. */
  href: string;
  /** First path segments that belong to this category. */
  segments: string[];
  /** Sidebar group labels (from astro.config sidebar) shown for this category. */
  groups: string[];
}

/**
 * Top-level site sections. Each maps a set of URL prefixes to the sidebar
 * groups that should show while browsing that section. Keep `groups` in sync
 * with the group `label`s defined in `astro.config.ts`.
 */
export const NAV_CATEGORIES: NavCategory[] = [
  {
    id: "docs",
    label: "Docs",
    href: "/design-system/architecture-overview",
    segments: ["getting-started", "design-system", "changelog"],
    groups: ["Getting Started", "Change Log"],
  },
  {
    id: "foundations",
    label: "Foundations",
    href: "/foundations/colors",
    segments: ["foundations"],
    groups: ["Foundations"],
  },
  {
    id: "components",
    label: "Components",
    href: "/components/data-display/accordion",
    segments: ["components"],
    groups: ["Components"],
  },
  {
    id: "patterns",
    label: "Patterns",
    href: "/growth-patterns/overview",
    segments: ["growth-patterns"],
    groups: ["PLG Patterns"],
  },
  {
    id: "data-viz",
    label: "Data Viz",
    href: "/data-viz/overview",
    segments: ["data-viz"],
    groups: ["Data Viz"],
  },
];

/** Extract the first path segment, ignoring leading/trailing slashes. */
export function getFirstSegment(pathname: string): string {
  return pathname.replace(/^\/+/, "").split("/")[0] ?? "";
}

/**
 * Resolve the active category for a pathname, or `undefined` when none matches
 * (e.g. the homepage) so no top-nav tab is highlighted there.
 */
export function getActiveCategory(pathname: string): NavCategory | undefined {
  const segment = getFirstSegment(pathname);
  return NAV_CATEGORIES.find((category) => category.segments.includes(segment));
}
