# Sidebar: designer intake

Fill this in by editing the answers under each question (plain sentences are fine). Skip a question
only by writing `n/a`. Claude turns your answers into `pattern.md` and the `whenToUse` /
`whenToNotUse` text in `props.json`, and a cross-exam step checks every claim against the real
component props before anything is published. Nothing you write goes live unreviewed.

Component: **Sidebar**   Props available: side, direction, className, classNameContent, preserveScrollPosition, storageKey, onScrollTop, onScrollBottom, onScrollLeft, onScrollRight, rootMargin, threshold, contentClassName, label, actionIcon, onActionClick, defaultSubmenuOpen, badge, actionMenuItems, dropdownMenuContent, withRightIndicator, title, description, active, actionButtons, draggable, dragAttributes, dragListeners, subMenuOpen, onSubmenuChange, icon, logo, onHoverIn, onHoverOut, hideIcon, defaultOpen, open, onOpenChange, animate, onClick, theme, asChild, loading, size, variant, rounded

## 1. Purpose
In one or two sentences, what is Sidebar for? What does the person using the product get from it?

**Answer:**

## 2. When to use it, and when not
List the situations where Sidebar is right. For each "do not use", say what to use instead.

**Use when:**
**Do not use when (→ use this instead):**

## 3. Neighbours
Which similar components could someone confuse it with? What single question tells them apart?
Give 2 to 4 real examples where the choice is not obvious (for example "Account tier → Tag").

**Answer:**

## 4. Choosing values
For each prop with a fixed set of values, how should someone choose? Flag any value that is
misleading, deprecated or only for special cases. Props to cover:
- `side`: left, right
- `direction`: ltr, rtl
- `theme`: default, success, danger, warning
- `size`: md, sm, xs, 2xs, 3xs
- `variant`: link, ai, primary, secondary, outline, ghost, transparent

**Answer (one line per value; "any" if no guidance):**

## 5. Rules and limits
What must always be true, or never be true? (for example "only one primary action per view",
"never put it inside a label"). Mark each as **must** or **should**.

**Answer:**

## 6. Accessibility
Anything about contrast, keyboard use, reading order, or meaning that must not rely on colour alone.

**Answer:**

## 7. Known gaps
What do people keep asking Sidebar to do that it can't? What should they do instead?

**Answer:**

## 8. Examples
Paste or describe one correct and one incorrect usage from real product screens. Link to Figma if you have it.

**Correct:**
**Incorrect (and why):**
