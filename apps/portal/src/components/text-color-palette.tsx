import { Layout, Text } from "@harnessio/ui/components";
import { cn } from "@harnessio/ui/utils";

interface ColorSwatchProps {
  className: string;
  label: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ className, label }) => (
  <Layout.Flex
    className={cn("!m-0 rounded-3 h-20 p-cn-md bg-cn-2", className)}
    align="center"
    justify="center"
  >
    <Text
      variant="caption-normal"
      color="inherit"
      className="text-cn-size-1 font-mono"
    >
      {label}
    </Text>
  </Layout.Flex>
);

interface BaseColorsProps {
  type: "base" | "state" | "brand";
}

const BaseColors: React.FC<BaseColorsProps> = ({ type }) => {
  if (type === "base") {
    return (
      <Layout.Grid className="mt-cn-md" columns={3} gap="md">
        <ColorSwatch className="text-cn-1" label="Base 1" />
        <ColorSwatch className="text-cn-2" label="Base 2" />
        <ColorSwatch className="text-cn-3" label="Base 3" />
      </Layout.Grid>
    );
  }

  if (type === "state") {
    return (
      <Layout.Grid className="mt-cn-md" columns={2} gap="md">
        <ColorSwatch className="text-cn-disabled" label="Disabled" />
        <ColorSwatch className="text-cn-merged" label="Merged" />
      </Layout.Grid>
    );
  }

  if (type === "brand") {
    return (
      <Layout.Grid className="mt-cn-md" columns={2} gap="md">
        <ColorSwatch className="text-cn-brand" label="Brand" />
        <ColorSwatch className="text-cn-brand-hover" label="Brand hover" />
      </Layout.Grid>
    );
  }

  return null;
};

interface CompactColorRow {
  name: string;
  color: string;
  hasDefault?: boolean;
}

const SemanticColors: React.FC = () => {
  const colors: CompactColorRow[] = [
    { name: "Success", color: "success", hasDefault: true },
    { name: "Danger", color: "danger", hasDefault: true },
    { name: "Warning", color: "warning", hasDefault: true },
    { name: "Gray", color: "gray" },
    { name: "Blue", color: "blue" },
    { name: "Purple", color: "purple" },
    { name: "Brown", color: "brown" },
    { name: "Cyan", color: "cyan" },
    { name: "Indigo", color: "indigo" },
    { name: "Lime", color: "lime" },
    { name: "Mint", color: "mint" },
    { name: "Orange", color: "orange" },
    { name: "Pink", color: "pink" },
    { name: "Violet", color: "violet" },
  ];

  return (
    <Layout.Grid className="mt-cn-md" gap="sm">
      {colors.map((item) => {
        const getTextClassName = (variant: string) => {
          return `text-cn-${item.color}${variant ? `-${variant}` : ""}`;
        };

        return (
          <Layout.Grid
            key={item.color}
            gap="sm"
            columns={
              item.hasDefault ? "120px 1fr 1fr 1fr 1fr" : "120px 1fr 1fr 1fr"
            }
            align="center"
          >
            <Text variant="body-normal" className="font-medium">
              {item.name}
            </Text>
            {item.hasDefault && (
              <Layout.Flex
                className={cn(
                  getTextClassName(""),
                  "bg-cn-2 rounded-2 h-12 !mt-0",
                )}
                align="center"
                justify="center"
                title={`.text-cn-${item.color}`}
              >
                <Text
                  variant="caption-normal"
                  color="inherit"
                  className="text-cn-size-2 font-mono"
                >
                  Default
                </Text>
              </Layout.Flex>
            )}
            <Layout.Flex
              className={cn(
                getTextClassName("primary"),
                "bg-cn-gray-secondary rounded-2 h-12 !mt-0",
              )}
              align="center"
              justify="center"
              title={`.text-cn-${item.color}-primary`}
            >
              <Text
                variant="caption-normal"
                color="inherit"
                className="text-cn-size-2 font-mono"
              >
                Primary
              </Text>
            </Layout.Flex>
            <Layout.Flex
              className={cn(
                getTextClassName("secondary"),
                "bg-cn-2 rounded-2 h-12 !mt-0",
              )}
              align="center"
              justify="center"
              title={`.text-cn-${item.color}-secondary`}
            >
              <Text
                variant="caption-normal"
                color="inherit"
                className="text-cn-size-2 font-mono"
              >
                Secondary
              </Text>
            </Layout.Flex>
            <Layout.Flex
              className={cn(
                getTextClassName("outline"),
                "bg-cn-2 rounded-2 h-12 !mt-0",
              )}
              align="center"
              justify="center"
              title={`.text-cn-${item.color}-outline`}
            >
              <Text
                variant="caption-normal"
                color="inherit"
                className="text-cn-size-2 font-mono"
              >
                Outline
              </Text>
            </Layout.Flex>
          </Layout.Grid>
        );
      })}
    </Layout.Grid>
  );
};

interface TextColorPaletteProps {
  type: "base" | "semantic";
  variant?: "primary" | "state" | "brand";
}

export const TextColorPalette: React.FC<TextColorPaletteProps> = ({
  type,
  variant,
}) => {
  if (type === "base") {
    return <BaseColors type={variant as "base" | "state" | "brand"} />;
  }

  if (type === "semantic") {
    return <SemanticColors />;
  }

  return null;
};
