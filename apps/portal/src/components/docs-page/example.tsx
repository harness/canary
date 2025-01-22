import { type ComponentProps, type FC, useMemo } from "react";
import { LiveEditor, LivePreview, LiveProvider } from "react-live";

import ExampleLayout from "./example-layout";
import { themes } from "prism-react-renderer";

type LiveProviderProps = ComponentProps<typeof LiveProvider>;

export type ExampleProps = Pick<LiveProviderProps, "code" | "scope">;

const Example: FC<ExampleProps> = ({ code, scope }) => {
  const scopeWithLayout = useMemo<ExampleProps["scope"]>(
    () => ({ ...scope, ExampleLayout }),
    [scope],
  );

  return (
    <div className="my-12 flex flex-col justify-start gap-0 pb-3">
      <LiveProvider code={code} scope={scopeWithLayout}>
        <h2>Preview</h2>
        <LivePreview className="not-content border-borders-4 bg-background-4 dark-std-std mb-0 rounded-lg border p-6 shadow-md" />

        <h3>Live editor</h3>
        <LiveEditor theme={themes["vsDark"]} />
      </LiveProvider>
    </div>
  );
};

export default Example;
