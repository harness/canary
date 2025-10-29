import { Layout, Text } from "@harnessio/ui/components";
import { cn } from "@harnessio/ui/utils";

interface ColorSwatchProps {
  className: string;
  label: string;
  showBorder?: boolean;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  className,
  label,
  showBorder = false,
}) => (
  <Layout.Flex
    className={cn(
      "!m-0 rounded-3 h-20 p-cn-md",
      { "border-cn-3 border": showBorder },
      className,
    )}
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
  type: "primary" | "state";
}

const BaseColors: React.FC<BaseColorsProps> = ({ type }) => {
  if (type === "primary") {
    return (
      <Layout.Grid className="mt-cn-md" columns={4} gap="md">
        <ColorSwatch className="bg-cn-0 text-cn-1" label="0" showBorder />
        <ColorSwatch className="bg-cn-1 text-cn-1" label="1" showBorder />
        <ColorSwatch className="bg-cn-2 text-cn-1" label="2" showBorder />
        <ColorSwatch className="bg-cn-3 text-cn-1" label="3" showBorder />
      </Layout.Grid>
    );
  }

  return (
    <Layout.Grid className="mt-cn-md" columns={2} gap="md">
      <ColorSwatch className="bg-cn-hover text-cn-1" label="Hover" />
      <ColorSwatch className="bg-cn-selected text-cn-1" label="Selected" />
    </Layout.Grid>
  );
};

interface BrandColorsProps {
  variant: "primary" | "secondary" | "outline";
}

const BrandColors: React.FC<BrandColorsProps> = ({ variant }) => {
  const colors = {
    primary: [
      {
        className: "bg-cn-brand-primary text-cn-1",
        label: "Primary",
      },
      {
        className: "bg-cn-brand-primary-hover text-cn-1",
        label: "Primary hover",
      },
      {
        className: "bg-cn-brand-primary-selected text-cn-1",
        label: "Primary selected",
      },
    ],
    secondary: [
      {
        className: "bg-cn-brand-secondary text-cn-brand",
        label: "Secondary",
      },
      {
        className: "bg-cn-brand-secondary-hover text-cn-brand",
        label: "Secondary hover",
      },
      {
        className: "bg-cn-brand-secondary-selected text-cn-brand",
        label: "Secondary selected",
      },
    ],
    outline: [
      {
        className: "bg-cn-brand-outline text-cn-brand border border-cn-brand",
        label: "Outline",
      },
      {
        className:
          "bg-cn-brand-outline-hover text-cn-brand border border-cn-brand",
        label: "Outline hover",
      },
      {
        className:
          "bg-cn-brand-outline-selected text-cn-brand border border-cn-brand",
        label: "Outline selected",
      },
    ],
  };

  return (
    <Layout.Grid className="mt-cn-md" columns={3} gap="md">
      {colors[variant].map((color) => (
        <ColorSwatch key={color.label} {...color} />
      ))}
    </Layout.Grid>
  );
};
interface CompactColorRow {
  name: string;
  color: string;
}

const SemanticColors: React.FC = () => {
  const colors: CompactColorRow[] = [
    { name: "Success", color: "success" },
    { name: "Danger", color: "danger" },
    { name: "Warning", color: "warning" },
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
        const getBGClassName = (variant: string, withBorder?: boolean) => {
          return `bg-cn-${item.color}-${variant} text-cn-${item.color}-${variant} ${withBorder ? `border border-cn-${item.color}-outline` : ""}`;
        };
        return (
          <Layout.Grid
            key={item.color}
            gap="sm"
            columns="120px 1fr 1fr 1fr"
            align="center"
          >
            <Text variant="body-normal" className="font-medium">
              {item.name}
            </Text>
            <Layout.Flex
              className={cn(getBGClassName("primary"), "rounded-2 h-12 !mt-0")}
              align="center"
              justify="center"
              title={`.bg-cn-${item.color}-primary`}
            >
              <Text
                variant="caption-normal"
                color="inherit"
                className="text-cn-size-0 font-mono"
              >
                Primary
              </Text>
            </Layout.Flex>
            <Layout.Flex
              className={cn(
                getBGClassName("secondary"),
                "rounded-2 h-12 !mt-0",
              )}
              align="center"
              justify="center"
              title={`.bg-cn-${item.color}-secondary`}
            >
              <Text
                variant="caption-normal"
                color="inherit"
                className="text-cn-size-0 font-mono"
              >
                Secondary
              </Text>
            </Layout.Flex>
            <Layout.Flex
              className={cn(
                getBGClassName("outline", true),
                "rounded-2 h-12 !mt-0",
              )}
              align="center"
              justify="center"
              title={`.bg-cn-${item.color}-outline`}
            >
              <Text
                variant="caption-normal"
                color="inherit"
                className="text-cn-size-0 font-mono"
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

interface ColorPaletteProps {
  type: "base" | "brand" | "semantic";
  variant?: "primary" | "state" | "secondary" | "outline";
}

export const BackgroundColorPalette: React.FC<ColorPaletteProps> = ({
  type,
  variant,
}) => {
  if (type === "base") {
    return <BaseColors type={variant as "primary" | "state"} />;
  }

  if (type === "brand") {
    return (
      <BrandColors variant={variant as "primary" | "secondary" | "outline"} />
    );
  }

  if (type === "semantic") {
    return <SemanticColors />;
  }

  return null;
};
