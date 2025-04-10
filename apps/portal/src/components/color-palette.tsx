import * as styles from "@harnessio/core-design-system/styles-esm";
import { Tooltip } from "@harnessio/ui/components";

interface Color {
  name?: string;
  $value?: string;
  [key: string]: unknown;
}

export function ColorPalette() {
  const shades = Object.keys(styles.colors.blue);
  const colors = Object.keys(styles.colors).filter(
    (color) => color !== "pure",
  ); /** Excluding "pure" colors intentionally */

  return (
    <div className="grid rounded-lg border border-borders-4 bg-background-4 px-6 pt-1 pb-6 mt-4 shadow-md h-fit w-fit">
      {/* Shades */}
      <div className="grid grid-flow-col gap-1">
        <div className="w-16"></div>
        {shades.map((shade) => (
          <div
            key={shade}
            className="flex-1 text-center font-medium text-cn-background-primary"
          >
            {shade}
          </div>
        ))}
      </div>

      {/* Colors */}
      <div className="not-content grid grid-flow-row gap-1">
        {colors.map((colorName) => {
          const colorGroup =
            styles.colors[colorName as keyof typeof styles.colors];

          return (
            <div key={colorName} className="flex items-center gap-1">
              <div className="text-right pr-4 w-20 font-medium capitalize text-cn-background-primary">
                {colorName}
              </div>
              {shades.map((shade) => {
                const color = colorGroup[shade as keyof typeof colorGroup];
                const colorValue = (color as Color)?.$value || "";

                return (
                  <div key={shade} className="flex-1 flex justify-center">
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div
                            className="size-14 rounded-md border border-borders-1 border-cn-foreground-primary"
                            style={{
                              backgroundColor: colorValue,
                            }}
                          />
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          style={{ backgroundColor: "black", color: "white" }}
                          side="top"
                          align="center"
                        >
                          --{(color as Color)?.name}: {colorValue}
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
