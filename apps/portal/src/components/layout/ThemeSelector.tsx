import {
  Button,
  IconV2,
  ThemeDialog,
  type ThemeDialogProps,
  TooltipProvider,
} from "@harnessio/ui/components";
import { DialogProvider } from "@harnessio/ui/context";
import { themeManifest } from "@harnessio/ui/themes/theme-manifest";
import { useEffect, useState } from "react";

export function ThemeSelector() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeDialogProps["theme"]>(
    () =>
      (localStorage.getItem("canary-theme") as ThemeDialogProps["theme"]) ||
      "dark-std-std",
  );

  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(theme!);
    document.querySelector("html")!.dataset.theme = theme?.startsWith("dark")
      ? "dark"
      : "light";

    localStorage.setItem("canary-theme", theme!);
  }, [theme]);

  return (
    <DialogProvider>
      <ThemeDialog
        open={open}
        onOpenChange={setOpen}
        setTheme={setTheme}
        theme={theme}
        showAccessibilityThemeOptions
        themesBasePath="/themes"
        themeManifest={themeManifest}
      >
        <Button
          iconOnly
          onClick={() => setOpen(true)}
          tooltipProps={{ content: "Appearance settings" }}
        >
          <IconV2 name="theme" />
        </Button>
      </ThemeDialog>
    </DialogProvider>
  );
}

export default function ThemeSelectorWrapper() {
  if (typeof window !== "undefined") {
    return (
      <TooltipProvider>
        <ThemeSelector />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Button iconOnly ignoreIconOnlyTooltip>
        <IconV2 name="theme" />
      </Button>
    </TooltipProvider>
  );
}
