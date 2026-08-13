type Props = {
  label?: string;
};

export function Spinner({ label = "Loading" }: Props) {
  return (
    <div class="ds-loading-row" role="status" aria-live="polite">
      <span class="ds-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
