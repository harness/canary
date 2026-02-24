import {
  Button,
  IconV2,
  ThemeDialog,
  type ThemeDialogProps,
  TooltipProvider,
} from "@harnessio/ui/components";
import { DialogProvider } from "@harnessio/ui/context";
import { useEffect, useState } from "react";

export function ThemeSelector() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeDialogProps["theme"]>(
    () =>
      (localStorage.getItem("canary-theme") as ThemeDialogProps["theme"]) ||
      "dark-std-std",
  );

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Skip DOM updates if ThemeProvider already applied the correct theme
    // This prevents flash on initial mount after page navigation
    if (root.classList.contains(theme!)) return;

    // Remove only previous theme classes, not all classes
    body.className = body.className.replace(/\b(dark|light)-\S+/g, '').trim();
    root.className = root.className.replace(/\b(dark|light)-\S+/g, '').trim();

    body.classList.add(theme!);
    root.classList.add(theme!);
    root.dataset.theme = theme?.startsWith("dark") ? "dark" : "light";

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
      >
        <Button
          variant="outline"
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
      <Button variant="outline" iconOnly ignoreIconOnlyTooltip>
        <IconV2 name="theme" />
      </Button>
    </TooltipProvider>
  );
}
