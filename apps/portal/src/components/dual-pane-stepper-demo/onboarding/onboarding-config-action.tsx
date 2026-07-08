import {
  Button,
  Text,
  Layout,
  DualPaneStepper,
} from "@harnessio/ui/components";

interface ConfigActionProps {
  description: string;
  actionLabel: string;
  onAction: () => void;
  onSkip?: () => void;
  errorState?: "recoverable" | "unrecoverable";
  errorMessage?: string;
  successMessage?: string;
  onRetry?: () => void;
}

export function ConfigAction({
  description,
  actionLabel,
  onAction,
  onSkip,
  errorState,
  errorMessage,
  successMessage,
  onRetry,
}: ConfigActionProps) {
  if (successMessage) {
    return (
      <Layout.Vertical gap="md">
        <DualPaneStepper.CardAction
          variant="success"
          message={successMessage}
        />
      </Layout.Vertical>
    );
  }

  if (errorState === "unrecoverable") {
    return (
      <Layout.Vertical gap="md">
        <DualPaneStepper.CardAction
          variant="danger"
          message={
            errorMessage ||
            "This configuration failed and cannot be retried. Please go back and choose a different option."
          }
          actionLabel="Go Back"
          onAction={onRetry || onAction}
        />
      </Layout.Vertical>
    );
  }

  if (errorState === "recoverable") {
    return (
      <Layout.Vertical gap="md">
        <DualPaneStepper.CardAction
          variant="warning"
          message={errorMessage || "Configuration failed. You can try again."}
          actionLabel="Retry"
          onAction={onRetry || onAction}
          secondaryLabel={onSkip ? "Skip" : undefined}
          onSecondary={onSkip}
        />
      </Layout.Vertical>
    );
  }

  return (
    <Layout.Vertical gap="md">
      <Text variant="body-normal" color="foreground-2">
        {description}
      </Text>
      <Layout.Horizontal justify="end" gap="sm">
        {onSkip && (
          <Button onClick={onSkip} variant="outline" size="sm">
            Skip
          </Button>
        )}
        <Button onClick={onAction} variant="primary" size="sm">
          {actionLabel}
        </Button>
      </Layout.Horizontal>
    </Layout.Vertical>
  );
}
