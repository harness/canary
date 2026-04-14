import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Table,
  Text,
  SearchInput,
  Layout,
  Tabs,
  Tooltip,
  TooltipProvider,
} from "@harnessio/ui/components";

interface Variable {
  name: string;
  value: string;
  description: string;
  category: string;
  subcategory: string;
  twClasses: string[];
}

interface CSSVariablesClientProps {
  allVariables: Variable[];
}

const SEMANTIC_COLOR_PREFIXES = [
  "--cn-bg-",
  "--cn-text-",
  "--cn-border-",
  "--cn-state-",
  "--cn-shadow-color-",
  "--cn-ring-",
  "--cn-set-",
  "--cn-disabled",
  "--cn-comp-shadow-",
  "--cn-gradient-",
  "--cn-icon-",
  "--cn-img-",
  "--cn-logo-",
  "--cn-flow-",
];

function isColorVar(name: string): boolean {
  return SEMANTIC_COLOR_PREFIXES.some((p) => name.startsWith(p));
}

type SwatchMode = "fill" | "border" | "ring" | "gradient";

function getSwatchMode(name: string, value: string): SwatchMode {
  if (name.startsWith("--cn-ring-")) return "ring";
  if (
    name.includes("border") &&
    (name.includes("gradient") || value.includes("gradient"))
  )
    return "gradient";
  if (name.includes("border")) return "border";
  return "fill";
}

function ColorSwatch({
  varName,
  mode = "fill",
}: {
  varName: string;
  mode?: SwatchMode;
}) {
  const styles: Record<SwatchMode, React.CSSProperties> = {
    fill: {
      background: `var(${varName})`,
      border: "1px solid var(--cn-border-2)",
    },
    border: {
      border: `2px solid var(${varName})`,
      backgroundColor: "transparent",
    },
    ring: { boxShadow: `var(${varName})`, backgroundColor: "transparent" },
    gradient: {
      border: "2px solid transparent",
      backgroundImage: `var(${varName})`,
      backgroundOrigin: "border-box",
      backgroundClip: "border-box",
      WebkitMask:
        "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
    },
  };
  return (
    <span
      className="inline-block w-cn-4 h-cn-4 rounded-cn-2 shrink-0"
      style={styles[mode]}
    />
  );
}

function LiveValue({
  varName,
  fallback,
}: {
  varName: string;
  fallback: string;
}) {
  const [value, setValue] = useState(fallback);

  const readValue = useCallback(() => {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    if (v) setValue(v);
  }, [varName]);

  useEffect(() => {
    readValue();
    const observer = new MutationObserver(readValue);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });
    return () => observer.disconnect();
  }, [readValue]);

  return <>{value}</>;
}

export const CSSVariablesClient = ({
  allVariables,
}: CSSVariablesClientProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Semantic");

  const filteredVars = useMemo(() => {
    if (!searchQuery) return allVariables;
    const query = searchQuery.toLowerCase();
    return allVariables.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.value.toLowerCase().includes(query) ||
        v.subcategory.toLowerCase().includes(query) ||
        v.twClasses.some((c) => c.toLowerCase().includes(query)),
    );
  }, [allVariables, searchQuery]);

  const { grouped, counts } = useMemo(() => {
    const cats = ["Semantic", "Global", "Typography", "Component"] as const;
    const grouped: Record<string, Record<string, Variable[]>> = {};
    const counts: Record<string, number> = {};
    cats.forEach((c) => {
      grouped[c] = {};
      counts[c] = 0;
    });

    filteredVars.forEach((v) => {
      if (!grouped[v.category]) return;
      if (!grouped[v.category][v.subcategory])
        grouped[v.category][v.subcategory] = [];
      grouped[v.category][v.subcategory].push(v);
      counts[v.category]++;
    });
    return { grouped, counts };
  }, [filteredVars]);

  // Auto-switch tab when search results are only in other tabs
  useEffect(() => {
    if (!searchQuery) return;

    const currentCount = counts[activeTab] || 0;
    if (currentCount > 0) return; // Current tab has results, stay here

    // Find first tab with results
    const tabOrder = ["Semantic", "Global", "Component"];
    const tabWithResults = tabOrder.find((tab) => (counts[tab] || 0) > 0);
    if (tabWithResults && tabWithResults !== activeTab) {
      setActiveTab(tabWithResults);
    }
  }, [searchQuery, counts, activeTab]);

  const renderGroup = (
    groupedData: Record<string, Variable[]>,
    live = false,
  ) => (
    <Layout.Vertical gap="xl">
      {Object.entries(groupedData)
        .sort(([a], [b]) => {
          const order = [
            "Layout",
            "Shell",
            "Page Container",
            "Breakpoints",
            "Headings",
            "Body",
            "Caption",
            "Micro",
            "Background",
            "Text",
            "Border",
            "State",
            "Shadows",
            "Focus Rings",
          ];
          const ai = order.indexOf(a);
          const bi = order.indexOf(b);
          const isSetA = a.startsWith("Set:");
          const isSetB = b.startsWith("Set:");
          if (ai !== -1 && bi !== -1) return ai - bi;
          if (ai !== -1) return -1;
          if (bi !== -1) return 1;
          if (isSetA && isSetB) return a.localeCompare(b);
          if (isSetA) return 1;
          if (isSetB) return -1;
          return a.localeCompare(b);
        })
        .map(([subcategory, vars]) => {
          if (vars.length === 0) return null;
          return (
            <div key={subcategory} className="w-full">
              <div className="flex items-baseline gap-cn-sm mb-cn-md">
                <Text variant="heading-subsection" as="h3">
                  {subcategory}
                </Text>
                <Text variant="body-single-line-light" color="foreground-3">
                  {vars.length}
                </Text>
              </div>
              <Table.Root
                size="normal"
                className="w-full"
                tableClassName="w-full table-fixed"
              >
                <Table.Header>
                  <Table.Row>
                    <Table.Head className="w-[40%]">Variable</Table.Head>
                    <Table.Head className="w-[30%]">Class</Table.Head>
                    <Table.Head className="w-[30%]">Value</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {vars.map((v) => {
                    const showColor = isColorVar(v.name);
                    return (
                      <Table.Row key={v.name}>
                        <Table.Cell>
                          <div className="flex items-center gap-cn-sm">
                            {showColor && (
                              <ColorSwatch
                                varName={v.name}
                                mode={getSwatchMode(v.name, v.value)}
                              />
                            )}
                            {v.description ? (
                              <Tooltip
                                content={v.description.split("\n")[0]}
                                theme="themed"
                              >
                                <span
                                  className="cursor-help"
                                  style={{
                                    textDecoration:
                                      "underline dotted var(--cn-text-3)",
                                    textUnderlineOffset: "4px",
                                  }}
                                >
                                  <Text
                                    variant="body-single-line-code"
                                    className="!border-0 !p-0"
                                  >
                                    {v.name}
                                  </Text>
                                </span>
                              </Tooltip>
                            ) : (
                              <Text
                                variant="body-single-line-code"
                                className="!border-0 !p-0"
                              >
                                {v.name}
                              </Text>
                            )}
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          {v.twClasses.length > 0 ? (
                            <div className="flex flex-wrap gap-cn-3xs">
                              {v.twClasses.map((cls) => (
                                <Text
                                  key={cls}
                                  variant="body-single-line-code"
                                  className="!border-0 !p-0"
                                >
                                  {cls}
                                </Text>
                              ))}
                            </div>
                          ) : (
                            <Text
                              variant="body-single-line-code"
                              className="!border-0 !p-0"
                              color="foreground-3"
                            >
                              —
                            </Text>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <Text
                            variant="body-single-line-code"
                            className="!border-0 !p-0"
                          >
                            {live ? (
                              <LiveValue varName={v.name} fallback={v.value} />
                            ) : (
                              v.value
                            )}
                          </Text>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </div>
          );
        })}
    </Layout.Vertical>
  );

  const tabContent: Record<string, React.ReactNode> = {
    Semantic: renderGroup(grouped["Semantic"], true),
    Global: renderGroup(grouped["Global"]),
    Component: renderGroup(grouped["Component"], true),
  };

  return (
    <TooltipProvider>
      <div className="not-content w-full">
        <div className="my-cn-xl">
          <SearchInput
            placeholder="Search by variable, class, value, or category..."
            value={searchQuery}
            onChange={setSearchQuery}
            debounce={false}
          />
        </div>

        <div className="mb-cn-xl">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List variant="underlined">
              <Tabs.Trigger value="Semantic">
                Semantic ({counts["Semantic"]})
              </Tabs.Trigger>
              <Tabs.Trigger value="Global">
                Global ({counts["Global"]})
              </Tabs.Trigger>
              <Tabs.Trigger value="Component">
                Component ({counts["Component"]})
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </div>

        {tabContent[activeTab]}
      </div>
    </TooltipProvider>
  );
};
