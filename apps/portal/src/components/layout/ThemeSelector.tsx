import { Button, IconV2, TooltipProvider } from "@harnessio/ui/components";
import { useThemeCSSLoader } from "@harnessio/ui/hooks";
import themeManifest from "@harnessio/ui/themes/theme-manifest.json";
import { useEffect, useState } from "react";

type Theme = "dark-std-std" | "light-std-std";

export function ThemeSelector() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("canary-theme") as Theme) || "dark-std-std",
  );

  const { loadTheme } = useThemeCSSLoader("/themes", themeManifest);

  const isDark = theme.startsWith("dark");

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Skip DOM updates if ThemeProvider already applied the correct theme
    if (root.classList.contains(theme)) return;

    // Remove only previous theme classes, not all classes
    body.className = body.className.replace(/\b(dark|light)-\S+/g, "").trim();
    root.className = root.className.replace(/\b(dark|light)-\S+/g, "").trim();

    body.classList.add(theme);
    root.classList.add(theme);
    root.dataset.theme = isDark ? "dark" : "light";

    localStorage.setItem("canary-theme", theme);

    // Load theme CSS file
    loadTheme(theme);
  }, [theme, loadTheme, isDark]);

  const toggleTheme = () => {
    setTheme(isDark ? "light-std-std" : "dark-std-std");
  };

  return (
    <Button
      variant="ghost"
      iconOnly
      onClick={toggleTheme}
      tooltipProps={{
        content: isDark ? "Switch to light mode" : "Switch to dark mode",
      }}
    >
      <IconV2 name={isDark ? "half-moon" : "sun-light"} />
    </Button>
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
      <Button variant="ghost" iconOnly ignoreIconOnlyTooltip>
        <IconV2 name="half-moon" />
      </Button>
    </TooltipProvider>
  );
}
