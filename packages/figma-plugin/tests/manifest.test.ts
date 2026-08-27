import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

type PluginManifest = {
  api?: string;
  capabilities?: string[];
  documentAccess?: string;
  editorType?: string[];
  id?: string;
  main?: string;
  name?: string;
  networkAccess?: { allowedDomains?: string[]; reasoning?: string };
  ui?: string;
};

function readManifest(fileName: string): PluginManifest {
  return JSON.parse(readFileSync(path.join(pluginRoot, fileName), "utf8"));
}

const manifest = readManifest("manifest.json");

describe("plugin manifest", () => {
  it("has one canonical development manifest", () => {
    const rootManifests = readdirSync(pluginRoot)
      .filter((fileName) => /^manifest(?:\..+)?\.json$/.test(fileName))
      .sort();

    expect(rootManifests).toEqual(["manifest.json"]);
    expect(manifest.name).toBe("Canary Copilot");
    expect(manifest.id).toBe("1667522450076109215");
  });

  it("can be imported from Figma Design and Dev Mode", () => {
    expect(manifest.editorType).toEqual(["figma", "dev"]);
  });

  it("points to the production build and uses dynamic page access", () => {
    expect(manifest.api).toBe("1.0.0");
    expect(manifest.main).toBe("dist/main.js");
    expect(manifest.ui).toBe("dist/ui.html");
    expect(manifest.documentAccess).toBe("dynamic-page");
    expect(manifest.capabilities).toBeUndefined();
  });

  it("declares and explains every host the plugin can fetch", () => {
    expect(manifest.networkAccess?.allowedDomains).toEqual([
      "https://harness.atlassian.net",
      "https://github.com",
      "https://*.github.com",
      "https://harness.io",
      "https://*.harness.io",
    ]);
    expect(manifest.networkAccess?.reasoning?.trim()).toBeTruthy();
  });
});
