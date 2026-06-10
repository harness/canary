import type { ComponentProps } from "react";
import { Button, Layout, LogoV2 } from "@harnessio/ui/components";

interface StaticChoiceProps {
  question: string;
  options: Array<{ id: string; label: string; logo?: ComponentProps<typeof LogoV2>["name"] }>;
  onSelect: (id: string) => void;
}

export function StaticChoice({ question, options, onSelect }: StaticChoiceProps) {
  return (
    <Layout.Vertical gap="md">
      <p className="text-sm text-cn-2">{question}</p>
      <Layout.Flex wrap="wrap" gap="sm">
        {options.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            size="sm"
            onClick={() => onSelect(option.id)}
          >
            {option.logo && (
              <LogoV2
                name={option.logo}
                skipSize
                className="size-3.5 shrink-0"
              />
            )}
            {option.label}
          </Button>
        ))}
      </Layout.Flex>
    </Layout.Vertical>
  );
}