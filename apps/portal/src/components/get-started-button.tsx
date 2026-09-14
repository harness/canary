import { Button } from "@harnessio/ui/components";

/**
 * Home hero primary CTA. Kept as its own React component so the design-system
 * Button's `asChild` slot receives a real `<a>` element — inside MDX the anchor
 * is remapped and the button classes never merge onto it.
 */
export default function GetStartedButton() {
  return (
    <Button asChild variant="primary" theme="default">
      <a href="/design-system/architecture-overview">Get started</a>
    </Button>
  );
}
