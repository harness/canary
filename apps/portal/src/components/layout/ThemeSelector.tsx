import {
  Button,
  Icon,
  ThemeDialog,
  type ThemeDialogProps,
} from "@harnessio/ui/components";
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
    <ThemeDialog
      open={open}
      onOpenChange={setOpen}
      setTheme={setTheme}
      theme={theme}
    >
      <Button iconOnly onClick={() => setOpen(true)}>
        <Icon name="paint" />
      </Button>
    </ThemeDialog>
  );
}

export default function ThemeSelectorWrapper() {
  if (typeof window !== "undefined") {
    return <ThemeSelector />;
  }

  return (
    <Button iconOnly>
      <Icon name="paint" />
    </Button>
  );
}
