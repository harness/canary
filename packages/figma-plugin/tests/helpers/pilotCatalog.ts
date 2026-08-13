import { buildIndex } from "../../src/core/match";
import { parseCatalogEntry, parseCatalogManifest } from "../../src/schema/schema";
import button from "../../catalogs/canary/button.catalog.json";
import manifest from "../../catalogs/canary/manifest.json";
import badge from "../fixtures/badge.catalog.json";

const badgeManifestEntry = {
  id: "canary.badge",
  path: "badge.catalog.json",
  figmaNames: [
    "❖Badge",
    "Badge",
    "❖StatusBadge",
    "StatusBadge",
    "❖Tag",
    "Tag",
    "❖Tag/Default",
    "❖CounterBadge",
  ],
  componentKeys: badge.figma.componentKeys ?? [],
};

export { button, badge, manifest };

export const buttonEntry = parseCatalogEntry(button);
export const badgeEntry = parseCatalogEntry(badge);
export const parsedManifest = parseCatalogManifest(manifest);

/** Generated Canary pack plus the Badge fixture until a StatusBadge contract exists. */
export const pilotManifest = parseCatalogManifest({
  ...manifest,
  components: [...manifest.components, badgeManifestEntry],
});

export function canaryIndex() {
  return buildIndex(parsedManifest, [buttonEntry]);
}

export function pilotIndex() {
  return buildIndex(pilotManifest, [buttonEntry, badgeEntry]);
}
