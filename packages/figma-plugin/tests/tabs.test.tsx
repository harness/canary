/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render } from "preact";
import { useState } from "preact/hooks";
import { Tabs } from "../src/ui/components/Tabs";

type TabId = "check" | "propose" | "catalog";

const items = [
  { id: "check" as TabId, label: "Check" },
  { id: "propose" as TabId, label: "Propose" },
  { id: "catalog" as TabId, label: "Catalog" },
];

function Harness() {
  const [tab, setTab] = useState<TabId>("check");
  return <Tabs items={items} value={tab} onChange={setTab} />;
}

let host: HTMLDivElement;

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  render(<Harness />, host);
});

afterEach(() => {
  render(null, host);
  host.remove();
});

function tabEls(): HTMLButtonElement[] {
  return Array.from(host.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
}

function press(key: string) {
  const target = (document.activeElement as HTMLElement | null) ?? host;
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

/** Preact batches state updates into a microtask. */
async function flush() {
  await Promise.resolve();
  await Promise.resolve();
}

function selectedLabels(): string[] {
  return tabEls()
    .filter((el) => el.getAttribute("aria-selected") === "true")
    .map((el) => el.textContent ?? "");
}

describe("Tabs keyboard interaction", () => {
  it("wires up tablist roles and a roving tabindex", () => {
    expect(host.querySelector('[role="tablist"]')).not.toBeNull();
    const els = tabEls();
    expect(els).toHaveLength(3);
    expect(els.map((el) => el.getAttribute("tabindex"))).toEqual([
      "0",
      "-1",
      "-1",
    ]);
    expect(els[0]!.getAttribute("aria-controls")).toBe("panel-check");
  });

  it("moves DOM focus to the newly selected tab on ArrowRight", async () => {
    const els = tabEls();
    els[0]!.focus();
    expect(document.activeElement).toBe(els[0]);

    press("ArrowRight");

    expect(document.activeElement).toBe(els[1]);
    await flush();
    expect(selectedLabels()).toEqual(["Propose"]);
    expect(tabEls().map((el) => el.getAttribute("tabindex"))).toEqual([
      "-1",
      "0",
      "-1",
    ]);
  });

  it("wraps focus and selection from the first tab to the last on ArrowLeft", async () => {
    const els = tabEls();
    els[0]!.focus();

    press("ArrowLeft");

    expect(document.activeElement).toBe(els[2]);
    await flush();
    expect(selectedLabels()).toEqual(["Catalog"]);
  });

  it("moves focus with Home and End", async () => {
    const els = tabEls();
    els[0]!.focus();

    press("End");
    expect(document.activeElement).toBe(els[2]);
    await flush();
    expect(selectedLabels()).toEqual(["Catalog"]);

    press("Home");
    expect(document.activeElement).toBe(els[0]);
    await flush();
    expect(selectedLabels()).toEqual(["Check"]);
  });

  it("keeps focus and selection in step across several arrow presses", async () => {
    const els = tabEls();
    els[0]!.focus();

    press("ArrowRight");
    await flush();
    press("ArrowRight");
    await flush();

    expect(document.activeElement).toBe(els[2]);
    expect(selectedLabels()).toEqual(["Catalog"]);
  });

  it("activates a tab on click without stealing focus from it", async () => {
    const els = tabEls();
    els[2]!.click();
    await flush();

    expect(selectedLabels()).toEqual(["Catalog"]);
    expect(tabEls().map((el) => el.getAttribute("tabindex"))).toEqual([
      "-1",
      "-1",
      "0",
    ]);
  });

  it("ignores unrelated keys", async () => {
    const els = tabEls();
    els[0]!.focus();

    press("ArrowDown");
    await flush();

    expect(document.activeElement).toBe(els[0]);
    expect(selectedLabels()).toEqual(["Check"]);
  });
});
