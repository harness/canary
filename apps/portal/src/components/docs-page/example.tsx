import {
  type ComponentProps,
  type FC,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LiveEditor, LivePreview, LiveProvider } from "react-live";
import {
  CopyButton,
  IconV2,
  Toaster,
  TooltipProvider,
} from "@harnessio/ui/components";
import { cn } from "@harnessio/ui/utils";
import {
  DialogProvider,
  RouterContextProvider,
  TranslationProvider,
} from "@harnessio/ui/context";
import ExampleLayout from "./example-layout";
import { themes } from "prism-react-renderer";
import {
  createMemoryRouter,
  Link,
  NavLink,
  Outlet,
  RouterProvider,
  useMatches,
} from "react-router-dom";

type LiveProviderProps = ComponentProps<typeof LiveProvider>;

export type ExampleProps = Pick<LiveProviderProps, "code" | "scope"> & {
  contentClassName?: string;
  hideCode?: boolean;
};

const Example: FC<ExampleProps> = ({
  code,
  scope,
  contentClassName,
  hideCode = false,
}) => {
  const [isLightTheme, setIsLightTheme] = useState(
    () => document.querySelector("html")?.dataset.theme === "light",
  );
  const [currentCode, setCurrentCode] = useState(code || "");
  const scopeWithLayout = useMemo<ExampleProps["scope"]>(
    () => ({ ...scope, ExampleLayout }),
    [scope],
  );

  useEffect(() => {
    const element = document.querySelector("html");
    if (!element) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName?.startsWith("data-")
        ) {
          setIsLightTheme(
            document.querySelector("html")?.dataset.theme === "light",
          );
        }
      });
    });

    observer.observe(element, {
      attributes: true,
      attributeFilter: Object.keys(element.dataset).map((key) => `data-${key}`),
    });

    return () => observer.disconnect();
  }, []);

  const router = createMemoryRouter([
    {
      path: "*",
      element: (
        <TranslationProvider>
          <LivePreview />
        </TranslationProvider>
      ),
    },
  ]);

  return (
    <RouterContextProvider
      Link={Link}
      NavLink={NavLink}
      Outlet={Outlet}
      useMatches={useMatches}
    >
      <DialogProvider>
        <TooltipProvider>
          <div className="bg-cn-1 not-content my-cn-3xl rounded-3 overflow-hidden border">
            <LiveProvider
              code={currentCode}
              scope={scopeWithLayout}
              enableTypeScript
            >
              <div
                className={cn(
                  "grid place-items-center p-cn-3xl",
                  contentClassName,
                )}
              >
                <RouterProvider router={router} />
              </div>
              {!hideCode && (
                <details className="example-expand bg-cn-2 p-cn-sm relative border-t">
                  <CopyButton
                    buttonVariant="transparent"
                    className="absolute right-cn-sm top-cn-sm"
                    name={currentCode}
                  />
                  <summary className="flex cursor-pointer select-none items-center gap-cn-3xs text-cn-size-2">
                    <IconV2
                      name="nav-arrow-right"
                      className="disclosure-icon"
                    />
                    Show code
                  </summary>
                  <LiveEditor
                    theme={isLightTheme ? themes.vsLight : themes.vsDark}
                    className="font-body-code line-numbers p-cn-3xs text-cn-size-2 leading-6"
                    onChange={setCurrentCode}
                  />
                </details>
              )}
            </LiveProvider>
          </div>
        </TooltipProvider>
        <Toaster className="not-content" />
      </DialogProvider>
    </RouterContextProvider>
  );
};

export default Example;
