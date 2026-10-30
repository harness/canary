# Design-sync notes: @harnessio/ui (packages/ui)

Shape: `package` (no Storybook). Project: Harness Design System, `d7027915-eb54-4242-83c4-171e2fb6018e`. globalName `HarnessUI`. Vendored React is 17.0.2 (repo constraint).

## How to re-sync
- `node .design-sync/stage-pkg.mjs` first (it is `cfg.buildCmd`'s staging step). It builds `.design-sync/.cache/pkg`, stubbing shiki lazy chunks and the Monaco chunk so `_ds_bundle.js` stays under the 12 MB per-file cap. Real `dist/` is untouched.
- Then `resync.mjs --config .design-sync/config.json --node-modules packages/ui/node_modules --out ./ds-bundle --remote <sidecar>`.
- Full build: `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules packages/ui/node_modules --out ./ds-bundle`. It wipes `ds-bundle/_screenshots/review`. Changing `cfg.overrides` or `cfg.titleMap` makes `preview-rebuild` fail with `[CONFIG_STALE]`; run the full build.
- Foreground commands cap at 120 s; run captures with `run_in_background`. macOS has no `timeout`; use `sed -i ''`.
- Forks in `.design-sync/overrides/` (dts.mjs, emit.mjs) import via `../../.ds-sync/lib/...`. emit.mjs injects a createRoot polyfill because preview cards mount with `ReactDOM.createRoot` on React 17.

## Preview authoring
- Previews are `.design-sync/previews/<Name>.tsx`, one named export per cell. Tailwind classes are not compiled; use inline styles.
- Overlay components use `cfg.overrides.<Name>` `{cardMode:"single", viewport:"WxH"}`. Dialog-type bodies clip if the viewport is short (CommitSuggestionsDialog 720x720, DateRangeV2 900x700).
- Cells render tall with content at the top; cosmetic only.
- Providers with no visual output have no preview: ParentStepProvider, SearchProvider, FlowEngineProvider, TooltipProvider.

## Component gotchas
- Context: Sidebar family needs `Sidebar.Provider` (Sidebar.Root width collapses, pass `style={{width:220}}`, omit Inset); SidebarSearch needs `SearchProvider`; Link needs `to`; Tree children (Folder, File, CollapseButton) need `Tree`; File/Folder controls bars need `Tabs.Root`; DraggableCard needs DnD context, use DraggableCardList.
- `ScopeType` is undefined from the runtime bundle; use string literals cast `as any`.
- Avatar `icon="github"` renders blank; icon/logo/illustration names are kebab-case keys from the name-maps in `packages/ui/src/components/{icon-v2,logo-v2,illustration}`.
- Progress `value` is 0-1. Meter state numbers: Error=1, Warning=2, Success=3, Info=4. Message theme takes strings, cast `as any`.
- Toaster helpers take `{title, description, options:{duration}}`; wrap the cell in `position:relative; transform:translateZ(0)` so sonner anchors to it.
- Chat.Header always shows "Harness AI"; Chat.EmptyState text is fixed; ChatV2 renders only "Chat".
- cmdk: `value` on Command.Input does not filter; set `value` on Command.Root to choose the selection.
- Reasoning: `open={false}` for collapsed. TypingAnimation: `typingSpeed={1}`. StackedList.Field `right` children do not render. SandboxLayout.Header is position:fixed; use SubHeader. TimeAgoCard with an invalid timestamp renders nothing.
- No `open` prop on MoreActionsTooltip, SearchableDropdown, Select, SimpleSort, SplitButton, Sort.MultiSort: previews show closed triggers only. FilterSelect can be opened by dispatching pointerdown/pointerup on the trigger.
- `Folder` and `File` are exported at runtime but missing from the `.d.ts`.

## Known gaps
- 47 `--cn-set-*` tokens are used by components but defined nowhere (upstream gap). `--vscode-*`, `--cn-tw-*`, `--radix-*` are runtime/Monaco variables.
- Monaco and shiki are stubbed: DiffViewer (wrong token colours, split layout), ChatDiffViewer (header only), MarkdownViewer/ChatPreviewWrapper code blocks (unhighlighted), CodeEditor, YamlEditor.
- PromptInput icon-only buttons render blank glyphs. These cells are graded needs-work.
- CheckboxTree props are a stub; ChatV2, NoProblemsFound, SidebarSearch have no props.
- d.ts quirks: `ref?: React.Ref` unparameterized in member interfaces; Button's top-level `CSSProperties` unqualified. `[DTS_STYLE_SYSTEM]` info line is expected.

## Re-sync risks
- Previews and `.design-sync/previews/` depend on upstream prop names (PromptInput.Tags `displayName`, Toaster object API); a component API change breaks them silently.
- `stage-pkg.mjs` hardcodes the Monaco chunk filename `index-tNWUyI8F.js`; the hash changes with upstream builds, so a larger bundle means re-check it.
- Needs-work cells (DiffViewer, ChatDiffViewer, PromptInput) were accepted as documented limits, not fixed.
- Requires `packages/ui/dist` built (`pnpm build` in packages/ui) before staging.
