import type { ComponentChildren } from "preact";

type Props = {
  title: string;
  body: string;
  action?: ComponentChildren;
};

export function EmptyState({ title, body, action }: Props) {
  return (
    <div class="ds-empty">
      <h2>{title}</h2>
      <p>{body}</p>
      {action}
    </div>
  );
}
