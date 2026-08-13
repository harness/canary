import { describe, it, expect } from "vitest";
import { humanizeError, catalogErrorCode } from "../src/ui/lib/errors";
import { CatalogLoadError } from "../src/catalog/loadCatalog";

describe("humanizeError", () => {
  it("maps known codes", () => {
    expect(humanizeError("COLLECT_FAILED")).toMatch(/canvas/i);
    expect(humanizeError("CATALOG_NETWORK")).toMatch(/catalog URL/i);
  });

  it("tells the user what to do when nothing is selected", () => {
    expect(humanizeError("NO_SELECTION", "Nothing is selected.")).toMatch(
      /Nothing is selected/i,
    );
    expect(humanizeError("NO_SELECTION")).toMatch(/Select something/i);
  });

  it("hides technical dumps", () => {
    expect(humanizeError(undefined, "ZodError: at /src/foo")).toMatch(
      /something went wrong/i,
    );
  });

  it("keeps safe fallback messages", () => {
    expect(humanizeError(undefined, "Enter a manifest URL")).toBe(
      "Enter a manifest URL",
    );
  });
});

describe("catalogErrorCode", () => {
  it("reads CatalogLoadError codes", () => {
    expect(
      catalogErrorCode(new CatalogLoadError("CATALOG_INVALID", "bad")),
    ).toBe("CATALOG_INVALID");
  });
});
