import { type ComponentProps, type FC, useMemo } from "react";
import { LiveEditor, LivePreview, LiveProvider } from "react-live";

import ExampleLayout from "./example-layout";
import { themes } from "prism-react-renderer";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { cn } from "@/lib/utils.ts";

type LiveProviderProps = ComponentProps<typeof LiveProvider>;

export type ExampleProps = Pick<LiveProviderProps, "code" | "scope"> & {
  padding?: boolean;
};

const Example: FC<ExampleProps> = ({ code, scope, padding = true }) => {
  const scopeWithLayout = useMemo<ExampleProps["scope"]>(
    () => ({ ...scope, ExampleLayout }),
    [scope],
  );
  const router = createMemoryRouter([
    {
      path: "*",
      element: (
        <LivePreview
          className={cn(
            "not-content border-cn-borders-3 bg-cn-background-hover mb-0 rounded-lg border shadow-md",
            { "p-6": padding },
          )}
        />
      ),
    },
  ]);
  return (
    <div className="my-12 flex flex-col justify-start gap-0 pb-3">
      <LiveProvider code={code} scope={scopeWithLayout}>
        <h2>Preview</h2>
        <RouterProvider router={router} />
        <h3>Live editor</h3>
        <LiveEditor theme={themes["vsDark"]} />
      </LiveProvider>
    </div>
  );
};

export default Example;
