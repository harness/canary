import type { ReactNode } from "react";
import { Button, Layout, Tag, Text } from "@harnessio/ui/components";
import { TerminalOutput } from "./terminal-output";

interface SummaryAction {
  description: string;
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline";
}

interface SummaryProps {
  logs?: string[];
  filename?: string;
  yaml?: string;
  actions?: SummaryAction[];
  children?: ReactNode;
}

export function Summary({
  logs,
  filename,
  yaml,
  actions,
  children,
}: SummaryProps) {
  return (
    <Layout.Vertical gap="lg">
      {logs && logs.length > 0 && <TerminalOutput logs={logs} />}

      {yaml && (
        <div className="border-cn-3 rounded-cn-3 overflow-hidden border">
          <Layout.Horizontal
            align="center"
            justify="between"
            className="border-cn-3 bg-cn-2 px-cn-4 py-cn-2 border-b"
          >
            <Layout.Horizontal
              align="center"
              gap="xs"
              className="py-cn-xs px-cn-md"
            >
              <Text variant="body-strong" color="foreground-1">
                {filename || "pipeline.yaml"}
              </Text>
              <Tag theme="green" size="sm" value="Generated" />
            </Layout.Horizontal>
            <Layout.Horizontal gap="sm">
              <Button variant="ghost" size="sm">
                Copy code
              </Button>
              <Button variant="ghost" size="sm">
                View YAML
              </Button>
            </Layout.Horizontal>
          </Layout.Horizontal>
          <div className="p-cn-4 max-h-[250px] overflow-auto">
            <pre className="text-cn-2 p-cn-md whitespace-pre-wrap break-words font-mono text-xs">
              {yaml}
            </pre>
          </div>
        </div>
      )}

      {children}

      {actions && actions.length > 0 && (
        <Layout.Vertical gap="sm" className="pt-cn-2">
          {actions.map((action, idx) => (
            <Layout.Horizontal key={idx} align="center" justify="end" gap="sm">
              <Text
                variant="body-normal"
                color="foreground-3"
                align="right"
                className="flex-1"
              >
                {action.description}
              </Text>
              <Button
                onClick={action.onClick}
                variant={action.variant || "outline"}
                size="sm"
              >
                {action.label}
              </Button>
            </Layout.Horizontal>
          ))}
        </Layout.Vertical>
      )}
    </Layout.Vertical>
  );
}
