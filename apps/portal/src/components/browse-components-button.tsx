import { Button } from "@harnessio/ui/components";

/**
 * Home hero secondary CTA. Kept as its own React component so the design-system
 * Button's `asChild` slot receives a real `<a>` element — inside MDX the anchor
 * is remapped and the button classes never merge onto it.
 */
export default function BrowseComponentsButton() {
  return (
    <Button asChild variant="outline">
      <a href="/components/data-display/accordion">Browse components</a>
    </Button>
  );
}
