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
        <LivePreview className="border-borders-4 bg-background-4 dark-std-std mb-0 rounded-lg border p-6 shadow-md" />

        <h3>Live editor</h3>
        <LiveEditor theme={themes["vsDark"]} />
      </LiveProvider>
    </div>
  );

  // return (
  //   <div className="flex flex-col gap-6 mt-6 items-start">
  //     <LiveProvider
  //       code={`<ExampleLayout>${code}</ExampleLayout>`}
  //       scope={scopeWithLayout}
  //       theme={theme}
  //     >
  //       <div className="flex flex-col justify-start gap-6 w-full mb-6">
  //         <Text size={4} className="text-primary-foreground">
  //           Preview
  //         </Text>
  //         <LivePreview />
  //         <LiveEditor style={{ backgroundColor: "transparent" }} />
  //       </div>
  //     </LiveProvider>
  //   </div>
  // );

  // return (
  //   <div className={css.root}>
  //     <LiveProvider
  //       code={`<ExampleLayout className="mt-6">${code}</ExampleLayout>`}
  //       scope={scopeWithLayout}
  //       theme={theme}
  //     >
  //       <div className={css.preview}>
  //         <LivePreview />
  //         <LiveError />
  //       </div>
  //       <details className={css.editor}>
  //         <summary tabIndex={-1}>Code Editor</summary>
  //         <LiveEditor code={code} />
  //       </details>
  //     </LiveProvider>
  //   </div>
  // );
};

export default Example;

const theme: LiveProviderProps["theme"] = {
  plain: {
    backgroundColor: "#000",
    color: "#1f2937", // ?
    fontWeight: "400",
    fontStyle: "normal",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fontFamily: "Roboto Mono, JetBrains Mono, monospace",
    fontSize: "13px",
    textRendering: "geometricPrecision",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata", "punctuation"],
      style: {
        color: "#374151",
      },
    },
    {
      types: ["namespace"],
      style: {
        opacity: 1,
      },
    },
    {
      types: ["tag", "operator", "number"],
      style: {
        color: "#1d4ed8",
        fontWeight: "500",
      },
    },
    {
      types: ["property", "function"],
      style: {
        color: "#a21caf",
      },
    },
    {
      types: ["tag-id", "selector", "atrule-id"],
      style: {
        color: "#eeebff",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "#a21caf",
      },
    },
    {
      types: [
        "boolean",
        "string",
        "entity",
        "url",
        "attr-value",
        "keyword",
        "control",
        "directive",
        "unit",
        "statement",
        "regex",
        "at-rule",
        "placeholder",
        "variable",
      ],
      style: {
        color: "#06b6d4",
      },
    },
    {
      types: ["deleted"],
      style: {
        textDecorationLine: "line-through",
      },
    },
    {
      types: ["language-javascript", "script"],
      style: {
        color: "#1d4ed8",
      },
    },
    {
      types: ["inserted"],
      style: {
        textDecorationLine: "underline",
      },
    },
    {
      types: ["italic"],
      style: {
        fontStyle: "italic",
      },
    },
    {
      types: ["important", "bold"],
      style: {
        fontWeight: "bold",
      },
    },
    {
      types: ["important"],
      style: {
        color: "#c4b9fe",
      },
    },
  ],
};
