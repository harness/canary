import { describe, it, expect } from "vitest";
import { button, manifest } from "./helpers/pilotCatalog";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const buttonContract = JSON.parse(
  readFileSync(
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../ui/catalog/contracts/button.contract.json",
    ),
    "utf8",
  ),
) as {
  id: string;
  figma: { componentKeys: string[]; exampleNodeId: string };
  properties: { designOnly: Array<{ name: string }>; shared: Array<{ name: string }> };
  supportMatrix: Array<{ id: string; status: string }>;
};

const REMOVED_POC_KEYS = [
  "72ddb011a49dad7644013d53bf0ca292fa3d0801",
  "3b8741c1dab53bf70bf58f7999ecea8e81f8d012",
  "07e1e3cd641d5f03f14a0c985b32a98c0d67aa50",
  "18e6ebfc9bda70f0024b8ee64d5ec26c738d6ebc",
];

describe("compiled Button catalog", () => {
  it("matches the in-repo Button contract", () => {
    expect(button.id).toBe(buttonContract.id);
    expect(button.figma.name).toBe("❖Button");
    expect(button.figma.exampleNodeId).toBe(buttonContract.figma.exampleNodeId);
    expect(button.figma.componentKeys).toEqual(buttonContract.figma.componentKeys);
    expect(button.figma.componentKeys).toHaveLength(12);
    expect(button.designOnly.map((prop) => prop.name)).toContain("leadingIcon");
    expect(button.shared.map((prop) => prop.name)).toContain("variant");
    expect(button.supportMatrix).toEqual(buttonContract.supportMatrix);
    expect(button.supportMatrix).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "text-standard-md-sm-link",
          status: "supported",
        }),
        expect.objectContaining({
          id: "legacy-micro-sizes",
          status: "unsupported",
        }),
      ]),
    );
    for (const key of REMOVED_POC_KEYS) {
      expect(button.figma.componentKeys).not.toContain(key);
    }
  });
});

describe("compiled Canary pack", () => {
  it("includes only Figma-governed contracts", () => {
    expect(manifest.system.id).toBe("canary");
    expect(manifest.components.map((component) => component.id)).toEqual(["canary.button"]);
    expect(manifest.components[0]?.figmaNames).toEqual(
      expect.arrayContaining(["Button", "❖Button"]),
    );
  });
});
