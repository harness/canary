type Props = {
  message: string;
};

/** Transient confirmation — auto-dismissed by the parent; no Dismiss control. */
export function FlashToast({ message }: Props) {
  return (
    <div class="ds-flash" role="status" aria-live="polite">
      {message}
    </div>
  );
}
