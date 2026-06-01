import { type FC } from "react";
import * as charts from "@harness/dashboard-visualization";
import "@harness/dashboard-visualization/style.css";
import type { ComponentExampleProps } from "./component-example";
import ComponentExample from "./component-example";

const stripImports = (code: string): string =>
  code
    .replace(/^\s*import\s+[^;]+?\s+from\s+["'][^"']+["'];?\s*$/gm, "")
    .replace(/^\s*import\s+["'][^"']+["'];?\s*$/gm, "");

const ChartExample: FC<ComponentExampleProps> = ({ code, contentClassName }) => (
  <ComponentExample
    code={code}
    scope={charts}
    contentClassName={contentClassName}
    noInline
    transformCode={stripImports}
  />
);

export default ChartExample;
