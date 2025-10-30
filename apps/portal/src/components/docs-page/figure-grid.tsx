import {
  Text,
  Card,
  CopyButton,
  LogoV2,
  LogoNameMapV2,
  IllustrationsNameMap,
  IconNameMapV2,
  Illustration,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import { SearchableArea } from "./searchable-area";

type FigureType = "logo" | "illustration" | "icon";

const typeToFigureDictMap: Record<FigureType, Record<string, unknown>> = {
  logo: LogoNameMapV2,
  illustration: IllustrationsNameMap,
  icon: IconNameMapV2,
} as const;

export const FigureGrid = ({ type }: { type: FigureType }) => {
  return (
    <TooltipProvider>
      <SearchableArea
        containerClassName="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-cn-xs"
        dataAttributeSelector="data-figure-name"
      >
        {Object.keys(typeToFigureDictMap[type]).map((name) => (
          <Card.Root
            key={name}
            className="!mt-0 grid !select-text place-items-center"
            title={name}
            data-figure-name={name.toLowerCase()}
          >
            <Card.Content className="gap-cn-sm grid place-items-center text-center">
              {type === "logo" && (
                <LogoV2 name={name as keyof typeof LogoNameMapV2} />
              )}
              {type === "illustration" && (
                <Illustration
                  name={name as keyof typeof IllustrationsNameMap}
                />
              )}
              {type === "icon" && (
                <IconV2 name={name as keyof typeof IconNameMapV2} />
              )}
              <Text align="center" color="foreground-3" className="!mt-0">
                {name}
              </Text>
              <CopyButton name={name} className="!mt-0" />
            </Card.Content>
          </Card.Root>
        ))}
      </SearchableArea>
    </TooltipProvider>
  );
};
