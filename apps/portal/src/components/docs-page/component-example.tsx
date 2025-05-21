import { type FC, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as components from "@harnessio/ui/components";
import Example, { type ExampleProps } from "./example";
import { useForm } from "react-hook-form";

export type ComponentExampleProps = Omit<ExampleProps, "scope"> & {
  scope?: ExampleProps["scope"];
};

const ComponentExample: FC<ComponentExampleProps> = ({ code, scope }) => {
  const combinedScope = useMemo<ExampleProps["scope"]>(
    () => ({ ...components, ...scope, zodResolver, z, useForm }),
    [scope],
  );

  return <Example code={code} scope={combinedScope} />;
};

export default ComponentExample;
