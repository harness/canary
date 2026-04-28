import { useVirtualizer } from "@tanstack/react-virtual";
import { useMemo, useRef, useState } from "react";
import {
  Text,
  LogoV2,
  LogoNameMapV2,
  LogoSymbol,
  SymbolNameMap,
  IllustrationsNameMap,
  IconNameMapV2,
  Illustration,
  IconV2,
  TooltipProvider,
  Tabs,
  Layout,
  SearchInput,
} from "@harnessio/ui/components";
import { SearchableArea } from "./searchable-area";

/** Sorted once — large list; virtualizer only mounts visible rows. */
const SORTED_ICON_NAMES = Object.keys(IconNameMapV2).sort((a, b) =>
  a.localeCompare(b),
);

const ICON_GRID_COLUMNS = 5;

function chunkIntoRows(names: string[], columns: number): string[][] {
  const rows: string[][] = [];
  for (let i = 0; i < names.length; i += columns) {
    rows.push(names.slice(i, i + columns));
  }
  return rows;
}

type FigureType = "logo" | "illustration" | "icon";

const LogoGridItem = ({
  name,
  showSymbols,
}: {
  name: string;
  showSymbols: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="group relative h-[120px] flex flex-col items-center justify-center gap-cn-sm rounded-cn-3 hover:bg-cn-hover transition-colors cursor-pointer !mt-0"
      title={`Click to copy "${name}"`}
      data-figure-name={name.toLowerCase()}
      onClick={handleCopy}
    >
      <IconV2
        name={copied ? "check" : "copy"}
        size="xs"
        className={`absolute top-cn-2xs right-cn-2xs transition-opacity ${copied ? "opacity-100 text-cn-success" : "opacity-0 group-hover:opacity-100 text-cn-3"}`}
      />
      {showSymbols ? (
        <LogoSymbol
          name={name as keyof typeof SymbolNameMap}
          className="!mt-0"
        />
      ) : (
        <LogoV2 name={name as keyof typeof LogoNameMapV2} className="!mt-0" />
      )}
      <Text
        align="center"
        color="foreground-3"
        className="!mt-0 text-cn-size-1"
      >
        {name}
      </Text>
    </div>
  );
};

const LogoGrid = ({ showSymbols }: { showSymbols: boolean }) => {
  const nameMap = showSymbols ? SymbolNameMap : LogoNameMapV2;

  return (
    <SearchableArea
      containerClassName="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-cn-md"
      dataAttributeSelector="data-figure-name"
    >
      {Object.keys(nameMap).map((name) => (
        <LogoGridItem key={name} name={name} showSymbols={showSymbols} />
      ))}
    </SearchableArea>
  );
};

const IconGridItem = ({ name }: { name: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="group relative h-[100px] flex flex-col items-center justify-center gap-cn-sm rounded-cn-3 hover:bg-cn-hover transition-colors cursor-pointer !mt-0"
      title={`Click to copy "${name}"`}
      data-figure-name={name.toLowerCase()}
      onClick={handleCopy}
    >
      <IconV2
        name={copied ? "check" : "copy"}
        size="xs"
        className={`absolute top-cn-2xs right-cn-2xs transition-opacity ${copied ? "opacity-100 text-cn-success" : "opacity-0 group-hover:opacity-100 text-cn-3"}`}
      />
      <IconV2
        name={name as keyof typeof IconNameMapV2}
        size="lg"
        className="!mt-0"
      />
      <Text
        align="center"
        color="foreground-3"
        className="!mt-0 text-cn-size-1"
      >
        {name}
      </Text>
    </div>
  );
};

const IllustrationGridItem = ({ name }: { name: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="group relative flex flex-col items-center justify-end gap-cn-xs rounded-cn-5 bg-cn-2 p-cn-sm hover:bg-cn-hover transition-colors cursor-pointer !mt-0"
      title={`Click to copy "${name}"`}
      data-figure-name={name.toLowerCase()}
      onClick={handleCopy}
    >
      <IconV2
        name={copied ? "check" : "copy"}
        size="xs"
        className={`absolute top-cn-2xs right-cn-2xs transition-opacity ${copied ? "opacity-100 text-cn-success" : "opacity-0 group-hover:opacity-100 text-cn-3"}`}
      />
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
        <Illustration
          name={name as keyof typeof IllustrationsNameMap}
          className="!mt-0 max-h-[64px] max-w-full object-contain"
        />
      </div>
      <Text
        align="center"
        color="foreground-3"
        className="!mt-0 text-cn-size-1 truncate w-full"
      >
        {name}
      </Text>
    </div>
  );
};

const VirtualizedIconGrid = () => {
  const [query, setQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredNames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return SORTED_ICON_NAMES;
    }
    return SORTED_ICON_NAMES.filter((n) => n.toLowerCase().includes(q));
  }, [query]);

  const rows = useMemo(
    () => chunkIntoRows(filteredNames, ICON_GRID_COLUMNS),
    [filteredNames],
  );

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 112,
    overscan: 6,
  });

  return (
    <TooltipProvider>
      <Layout.Vertical gap="lg">
        <SearchInput
          onChange={setQuery}
          className="max-w-[300px]"
          debounce={200}
        />
        {filteredNames.length === 0 ? (
          <Layout.Vertical
            gap="md"
            align="center"
            justify="center"
            className="py-cn-4xl px-cn-2xl !m-0 my-auto size-full grow"
          >
            <Text variant="heading-section" align="center">
              No search results
            </Text>
          </Layout.Vertical>
        ) : (
          <div
            ref={scrollRef}
            className="max-h-[min(75vh,56rem)] w-full overflow-auto"
          >
            <div
              className="relative w-full"
              style={{ height: virtualizer.getTotalSize() }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => (
                <div
                  key={virtualRow.index}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className="absolute left-0 top-0 grid w-full gap-cn-md pb-cn-md"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                    gridTemplateColumns: `repeat(${ICON_GRID_COLUMNS}, minmax(0, 1fr))`,
                  }}
                >
                  {rows[virtualRow.index]?.map((name) => (
                    <IconGridItem key={name} name={name} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </Layout.Vertical>
    </TooltipProvider>
  );
};

export const FigureGrid = ({ type }: { type: FigureType }) => {
  const [logoView, setLogoView] = useState<"default" | "symbol">("default");

  if (type === "logo") {
    return (
      <TooltipProvider>
        <div className="not-content mb-cn-md">
          <Tabs.Root
            value={logoView}
            onValueChange={(value) =>
              setLogoView(value as "default" | "symbol")
            }
          >
            <Tabs.List variant="underlined">
              <Tabs.Trigger value="default">Default</Tabs.Trigger>
              <Tabs.Trigger value="symbol">Symbol</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </div>
        <LogoGrid showSymbols={logoView === "symbol"} />
      </TooltipProvider>
    );
  }

  if (type === "icon") {
    return <VirtualizedIconGrid />;
  }

  if (type === "illustration") {
    return (
      <TooltipProvider>
        <SearchableArea
          containerClassName="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-cn-sm"
          dataAttributeSelector="data-figure-name"
        >
          {Object.keys(IllustrationsNameMap)
            .sort((a, b) => {
              const aLight = a.endsWith("-light");
              const bLight = b.endsWith("-light");
              if (aLight !== bLight) return aLight ? 1 : -1;
              return a.localeCompare(b);
            })
            .map((name) => (
              <IllustrationGridItem key={name} name={name} />
            ))}
        </SearchableArea>
      </TooltipProvider>
    );
  }

  return null;
};
