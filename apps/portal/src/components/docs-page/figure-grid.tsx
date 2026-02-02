import { useState } from "react";
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
} from "@harnessio/ui/components";
import { SearchableArea } from "./searchable-area";

type FigureType = "logo" | "illustration" | "icon";

const typeToFigureDictMap: Record<FigureType, Record<string, unknown>> = {
  logo: LogoNameMapV2,
  illustration: IllustrationsNameMap,
  icon: IconNameMapV2,
} as const;

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
      <Illustration
        name={name as keyof typeof IllustrationsNameMap}
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
    return (
      <TooltipProvider>
        <SearchableArea
          containerClassName="grid grid-cols-5 gap-cn-md"
          dataAttributeSelector="data-figure-name"
        >
          {Object.keys(IconNameMapV2).map((name) => (
            <IconGridItem key={name} name={name} />
          ))}
        </SearchableArea>
      </TooltipProvider>
    );
  }

  if (type === "illustration") {
    return (
      <TooltipProvider>
        <SearchableArea
          containerClassName="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-cn-md"
          dataAttributeSelector="data-figure-name"
        >
          {Object.keys(IllustrationsNameMap).map((name) => (
            <IllustrationGridItem key={name} name={name} />
          ))}
        </SearchableArea>
      </TooltipProvider>
    );
  }

  return null;
};
