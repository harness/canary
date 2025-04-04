import { type FC, useMemo } from "react";

import * as components from "@harnessio/ui/components";
import Example, { type ExampleProps } from "./example";

export type ComponentExampleProps = Omit<ExampleProps, "scope"> & {
  scope?: ExampleProps["scope"];
  padding?: boolean;
};

const ComponentExample: FC<ComponentExampleProps> = ({
  code,
  scope,
  padding = true,
}) => {
  const combinedScope = useMemo<ExampleProps["scope"]>(
    () => ({ ...components, ...scope }),
    [scope],
  );

  return <Example code={code} scope={combinedScope} padding={padding} />;
};

export default ComponentExample;
