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
    <div className="grid rounded-lg border border-borders-4 bg-background-4 px-6 pt-1 pb-6 mt-4 shadow-md h-fit w-[800px]">
      {/* Shades */}
      <div className="flex">
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
      <div>
        {colors.map((colorName) => {
          const colorGroup =
            styles.colors[colorName as keyof typeof styles.colors];

          return (
            <div key={colorName} className="flex items-center gap-1">
              <div className="w-16 font-medium capitalize text-cn-background-primary">
                {colorName}
              </div>
              {shades.map((shade) => {
                const color = colorGroup[shade as keyof typeof colorGroup];
                const colorValue = (color as Color)?.$value || "";

                return (
                  <div key={shade} className="flex-1 pb-2 flex justify-center">
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div
                            className="size-14 rounded-md"
                            style={{
                              backgroundColor: colorValue,
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          />
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          style={{ backgroundColor: "black" }}
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
