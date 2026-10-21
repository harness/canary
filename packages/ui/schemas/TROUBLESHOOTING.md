# When `ds-check` Fails

`ds-check` compares each component's manifest against the real component code. When
they disagree it stops and prints why. This page translates the three messages that
are hardest to read.

Most other messages say what to do in the text itself — for example, a stale spec
tells you to run `pnpm ds-check --write`. Follow those literally; they're accurate.

Run the checks with `pnpm assist check-all`, or directly with `pnpm ds-check` from
`packages/ui`.

---

## "must have required property"

**You'll see:**

```
❌ status-badge: Schema validation failed
   /props/shared/4: must have required property 'default' {"missingProperty":"default"}
```

**It means:** One of the props you listed is missing a required field. `/props/shared/4`
is a location, not a name — it means the **5th** entry in the `props.shared` list
(counting from zero, as code does). `default` is the value the component uses when
nobody chooses one.

**Do this:** Open the manifest, count down to that entry in `props.shared`, and add the
missing field. Every prop needs `name`, `type`, and `default`.

A related one from the same check:

```
❌ status-badge: Failed to parse manifest
   Expected ':' after property name in JSON at position 44 (line 4 column 1)
```

That's a typo in the file's punctuation — a missing comma, colon, or quote mark. The
position and line numbers refer to your file, so they'll differ from the example; the
line number is reliable, so start there.

---

## "in the manifest but not <component>.tsx"

**You'll see one of these:**

```
❌ status-badge: source prop validation failed
   props.shared "variant": in the manifest but not status-badge.tsx: notARealVariant
```

```
❌ status-badge: source prop validation failed
   props.shared "variant": in status-badge.tsx but not the manifest: ghost
```

**It means:** The manifest and the component disagree about which options exist. The
first says the manifest lists a `variant` the code doesn't have. The second says the
code has one the manifest never mentions.

**Do this — and think before you fix it.** There are two very different causes, and
the error can't tell them apart:

1. **The docs fell behind.** Someone renamed or added an option in code and didn't
   update the manifest. Fix the manifest to match the code.
2. **The code is wrong.** An option got renamed or dropped by accident and this check
   just caught it. Fix the code, not the manifest.

Check with whoever last touched the component before editing. Silencing this by
editing the manifest will hide a real bug if the answer was #2 — which is the whole
reason the check exists.

---

## "code.path does not exist"

**You'll see:**

```
❌ status-badge: source prop validation failed
   code.path does not exist: packages/ui/src/components/nope/nope.tsx
```

**It means:** The manifest points at a component file that isn't there. The check can't
compare anything, so it stops.

**Do this:** Check `code.path` in the manifest for a typo, or find where the component
actually lives — files get moved and manifests don't follow automatically. The path is
relative to the repo root, not to this folder.

---

See also: [`DESIGNER_GUIDE.md`](./DESIGNER_GUIDE.md) for writing the pattern docs,
[`CONTRIBUTING.md`](./CONTRIBUTING.md) for adding a component,
[`TEMPLATE.manifest.json`](./TEMPLATE.manifest.json) for the required manifest shape.
