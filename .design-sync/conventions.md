# Harness Design System (@harnessio/ui) - usage conventions

Read this before composing anything. Components are on `window.HarnessUI`; the shared preview wrapper already provides ThemeRoot and TooltipProvider.

**Styling.** Use inline `style={{...}}` or the design tokens (`var(--cn-*)`) in designs. Tailwind utility classes are not compiled in this environment, so classes like `flex gap-2` do nothing.

**Compound components.** Most surfaces are namespaces: `Dialog.Root` / `Dialog.Content` / `Dialog.Header` / `Dialog.Body`, `Sidebar.Provider` > `Sidebar.Root` > `Sidebar.Content`, `Tabs.Root`, `Tree`. Always check the `.d.ts` for the sub-component list.

**Context requirements.**
- `Sidebar.*`, `AppSidebarItem`, `AppSidebarUser`, `SidebarLayout`: wrap in `Sidebar.Provider`.
- `SidebarSearch`: wrap in `SearchProvider`.
- `Link`: needs `to` (use `to="#"`); `external` links use `href`.
- `FileEditorControlBar`, `FileViewerControlBar`: need a `Tabs.Root` ancestor.
- `CollapseButton`, `Folder`, `File`: need a `Tree` ancestor.
- `FormInput.*`: need `name` inside `FormWrapper` with react-hook-form methods.

**Value conventions.**
- `Progress` `value` is a 0-1 fraction.
- Icon, logo and illustration names are kebab-case keys (`circle-ci`, `no-data-pipeline`); an unknown name renders blank.
- `Toaster` helpers take an object: `toast.success({ title, description })`.
- Overlays (Dialog, Sheet, Drawer, Popover, Tooltip) take `open` / `defaultOpen` and need a tall enough container or the body clips.

**Known limits in this bundle.** Syntax highlighting (code blocks, DiffViewer, ChatDiffViewer) and the code/YAML editors are stubbed to keep the bundle under the upload cap; they render unhighlighted or collapsed. Icon-only buttons inside PromptInput render without glyphs. `ChatV2` is a placeholder.
