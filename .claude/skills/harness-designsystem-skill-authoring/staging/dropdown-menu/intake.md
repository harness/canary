# DropdownMenu: designer intake

Fill this in by editing the answers under each question (plain sentences are fine). Skip a question
only by writing `n/a`. Claude turns your answers into `pattern.md` and the `whenToUse` /
`whenToNotUse` text in `props.json`, and a cross-exam step checks every claim against the real
component props before anything is published. Nothing you write goes live unreviewed.

Component: **DropdownMenu**   Props available: isSubContent, scrollAreaProps, onOpenAutoFocus, prefix, subContentProps, subMenuProps, label, label, title, className, description, shortcut, checkmark, tag, src, name, rounded, isGroup, logo, icon, iconClassName, iconSize, color, color, pulse, asChild, align, as, wrap, variant, truncate, lineClamp

## 1. Purpose
In one or two sentences, what is DropdownMenu for? What does the person using the product get from it?

**Answer:**

## 2. When to use it, and when not
List the situations where DropdownMenu is right. For each "do not use", say what to use instead.

**Use when:**
**Do not use when (→ use this instead):**

## 3. Neighbours
Which similar components could someone confuse it with? What single question tells them apart?
Give 2 to 4 real examples where the choice is not obvious (for example "Account tier → Tag").

**Answer:**

## 4. Choosing values
For each prop with a fixed set of values, how should someone choose? Flag any value that is
misleading, deprecated or only for special cases. Props to cover:
- `iconSize`: 2xs, xs, sm, md, lg, xl
- `color`: gray, green, red, yellow, blue, purple, brown, cyan, indigo, lime, mint, orange, pink, violet
- `color`: disabled, inherit, foreground-1, foreground-2, foreground-3, foreground-4, success, warning, merged, danger, brand
- `align`: left, center, right
- `as`: div, h2, h3, label, li, p, span, abbr, address, blockquote, caption, cite, code, dd, del, dt, em, figcaption, h1, h4, h5, h6, ins, kbd, legend, pre, samp, strong, time, var
- `wrap`: wrap, nowrap, pretty, balance
- `variant`: body-normal, heading-hero, heading-section, heading-default, heading-subsection, heading-base, heading-small, body-single-line-normal, body-strong, body-single-line-strong, body-code, body-code-strong, caption-normal, caption-strong, caption-code, caption-code-strong, caption-single-line-normal
- `lineClamp`: default, 4, 1, 2, 3, 5, 6

**Answer (one line per value; "any" if no guidance):**

## 5. Rules and limits
What must always be true, or never be true? (for example "only one primary action per view",
"never put it inside a label"). Mark each as **must** or **should**.

**Answer:**

## 6. Accessibility
Anything about contrast, keyboard use, reading order, or meaning that must not rely on colour alone.

**Answer:**

## 7. Known gaps
What do people keep asking DropdownMenu to do that it can't? What should they do instead?

**Answer:**

## 8. Examples
Paste or describe one correct and one incorrect usage from real product screens. Link to Figma if you have it.

**Correct:**
**Incorrect (and why):**
