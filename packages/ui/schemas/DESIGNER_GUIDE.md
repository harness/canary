# Pattern Documentation Guide for Designers

**Status:** Ready for crowd-sourced pattern documentation
**Template:** `TEMPLATE.pattern.md` (copy this to start)
**Example:** `status-badge.md` (reference this for style/depth)

---

## What You're Writing

Pattern documentation is **judgment and decision-making** — the parts that only a designer can author:

- ✅ When to use this component/composition (and when NOT to)
- ✅ Decision frameworks: how to choose between similar options
- ✅ Real-world ambiguous cases and the calls made for each
- ✅ Do's and Don'ts that matter in practice
- ✅ Accessibility obligations for consumers
- ✅ Known gaps and limitations

## What You're NOT Writing

The team handles these (you can leave blank or annotate `[TODO: team]`):

- ❌ Prop names, types, enums, defaults
- ❌ Token references or CSS values
- ❌ OpenAPI specifications
- ❌ Component manifests (JSON contracts)
- ❌ Figma bindings or Code Connect mappings

---

## Workflow: From Idea to PR

### 1. Pick a Component or Composition
- **Single component:** Must already exist in `src/components/`
- **Composition:** Multiple sub-components (e.g., Form.Root + Form.Field + Form.Label)
- Check with @design-systems if you're unsure it's ready

### 2. Copy the Template
```bash
cp packages/ui/schemas/TEMPLATE.pattern.md packages/ui/schemas/{component-kebab}.md
```

### 3. Write Your Sections
Follow the template sections in order. Here's what each is for:

#### Composition (optional, only if multiple pieces)
- List the sub-components
- Explain which are required vs. optional
- Show assembly order/pattern

**Optional columns:**
- **Allowed variants** (optional): Which variant or prop options make sense for this slot (e.g., size: sm/md/lg, theme: light/dark). Leave blank if all options are valid.
- **States** (optional): What visual states this slot can display (e.g., default, hover, disabled, loading). Helps designers understand the full lifecycle.

**Example:**
```
| Component | Role | Required? | Allowed variants | States |
| Form.Root | Wrapper | Yes | — | — |
| Form.Field | Repeatable control | Yes | size: sm, md, lg | default, error, disabled |
| Form.Label | Label for field | No (but recommended for a11y) | — | — |

Assembly: Form.Root wraps multiple Form.Field instances; each Field can contain a Label, Control, and Error message.
```

If you don't know the exact variants or states, use `[TODO: team]` and they'll fill in details from the manifest.

#### Overview (required)
- One sentence: what this is and what it represents
- Use when: 2–3 real situations
- Do not use when: alternatives (with links)

#### Decision Framework (required)
- The test a reader applies to choose between this and similar options
- Make a simple decision table if helpful

#### Ambiguous Cases (most valuable)
- Real cases that genuinely sit on the border
- Show the call YOU made and why
- These are the hardest to document and most useful to readers

#### Do's and Don'ts (optional)
- Document choices that matter, not what the compiler catches
- Leave empty if the component's constraints are self-evident

#### Examples (optional)
- 2–3 real-world snippets showing correct usage
- If you don't know exact prop names, use `[TODO: team fill in]`

**Example:**
```tsx
// ✅ Correct: Form with required and optional fields
<Form.Root>
  <Form.Field required>
    <Form.Label>Email</Form.Label>
    [TODO: team fill in Control type]
  </Form.Field>
</Form.Root>
```

#### Accessibility (optional)
- What the consumer (developer) MUST do to use this accessibly
- Leave blank if it's self-contained

**Example:**
- "Always pair Form.Field with Form.Label (screen readers depend on it)"
- "Form.Root requires aria-live=polite to announce async validation errors"

#### Known Gaps (optional)
- Limitations readers discover the hard way
- Workarounds if they exist
- Leave empty if none

### 4. Annotate as Needed
- `[TODO: team]` — something needs technical verification
- `[NEEDS REVIEW]` — you're unsure about this call
- `[OPTIONAL]` — can leave a section blank entirely

### 5. Open a PR
- Add only your `.md` file
- The team will:
  - Create/verify component manifests (one per sub-component)
  - Auto-generate OpenAPI specs
  - Verify your examples compile
  - Review your decision framework

---

## Tips

### Decision Frameworks are Gold
The hardest and most valuable thing to write. Spend time here:
- What distinguishes this from similar options?
- What's the simplest decision test a reader can apply?
- What are the edge cases?

### Ambiguous Cases are the Real Wins
Examples:
- "Use Dialog for destructive actions, but use Popover if it's non-blocking" (when is it non-blocking?)
- "Form.Field for simple forms, but CustomControl if you need complex state" (how complex?)

These show you're thinking like a designer, not just copying props.

### Link to Alternatives
When you say "use X instead," link to it:
- Use [Button] for primary actions, [Link] for navigation
- Use [Dialog] for modal, but [Popover] for...

This helps readers navigate the whole system.

### Keep it Fresh
Remove gaps when they're fixed. A stale gap is worse than no gap.

---

## Examples to Reference

- `status-badge.md` — simple component with clear do's/don'ts
- Ask @design-systems for other completed patterns

---

## Questions?

- **"Can I write about a component that hasn't shipped yet?"** → Ask @design-systems; the component must exist in code first
- **"What if I don't know the exact prop name?"** → Use `[TODO: team]`; they'll verify
- **"Should I include a design token reference?"** → No; that's in the manifest. Just reference which aspect of design it affects (e.g., "uses semantic color tokens")
- **"Can I update an existing pattern?"** → Yes; open a PR with just the `.md` changes

---

## File Locations

```
packages/ui/schemas/
├── TEMPLATE.pattern.md          ← Copy this to start
├── status-badge.md              ← Reference example
├── button.md                    ← Once it exists
└── [your-component].md          ← Your PR
```

---

**Ready to write?** Pick a component and copy `TEMPLATE.pattern.md`. You've got this.
