import {
  type ComponentProps,
  type FC,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LiveEditor, LivePreview, LiveProvider } from "react-live";
import { IconV2, TooltipProvider } from "@harnessio/ui/components";
import { cn } from "@harnessio/ui/utils";
import {
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
        <RouterContextProvider Link={Link} NavLink={NavLink} Outlet={Outlet}>
          <TranslationProvider>
            <TooltipProvider>
              <LivePreview />
            </TooltipProvider>
          </TranslationProvider>
        </RouterContextProvider>
      ),
    },
  ]);

  return (
    <div className="bg-cn-background-1 not-content my-12 overflow-hidden rounded-md border">
      <LiveProvider code={code} scope={scopeWithLayout} enableTypeScript>
        <div className={cn("grid place-items-center p-12", contentClassName)}>
          <RouterProvider router={router} />
        </div>
        {!hideCode && (
          <details className="example-expand bg-cn-background-2 border-t p-3">
            <summary className="flex cursor-pointer select-none items-center gap-1 text-sm">
              <IconV2 name="nav-arrow-right" className="disclosure-icon" />
              Show code
            </summary>
            <LiveEditor
              theme={isLightTheme ? themes.vsLight : themes.vsDark}
              className="p-1 text-sm"
            />
          </details>
        )}
      </LiveProvider>
    </div>
  );
};

export default Example;
