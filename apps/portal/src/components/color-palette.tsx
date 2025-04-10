import * as styles from "@harnessio/core-design-system/styles-esm";
import { Text, Tooltip } from "@harnessio/ui/components";

export function ColorPalette() {
  const colorPalette = {
    shades: Object.keys(styles.colors.blue),
  };

  return (
    <div className="p-8 bg-black text-white max-w-[800px] mx-auto my-6 grid gap-8">
      <div style={{ backgroundColor: "#333" }} className="h-1" />

      <div>
        <Text as="h1" className="text-3xl font-bold mb-2">
          Core color palette
        </Text>
        <Text as="p" className="mb-10 text-gray-400">
          The main color used to define the brand or highlight key elements.
        </Text>

        {/* Shades */}
        <div className="flex mb-4">
          <div className="w-24"></div> {/* Empty space for color name column */}
          {colorPalette.shades.map((shade) => (
            <div key={shade} className="flex-1 text-center font-medium">
              {shade}
            </div>
          ))}
        </div>

        {/* Colors */}
        <div className="space-y-2">
          {Object.keys(styles.colors).map((colorName) => {
            const colorGroup =
              styles.colors[colorName as keyof typeof styles.colors];

            return (
              <div key={colorName} className="flex items-center">
                <div className="w-24 font-medium capitalize text-white">
                  {colorName}
                </div>

                {colorPalette.shades.map((shade) => {
                  const color = colorGroup[shade as keyof typeof colorGroup];
                  const colorValue = color?.$value || "";

                  return (
                    <div key={shade} className="flex-1 flex justify-center">
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
                            --{color?.name}: {colorValue}
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
    </div>
  );
}
