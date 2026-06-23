import { useState } from "react";
import {
  Button,
  Layout,
  Text,
  IconV2,
  Skeleton,
} from "@harnessio/ui/components";

interface DynamicChoiceProps {
  items: Array<{ id: string; name: string }>;
  suggestedItems?: Array<{ id: string; name: string }>;
  onSelect: (id: string) => void;
  searchLabel?: string;
  helperText?: string;
  onSkip?: () => void;
  skipLabel?: string;
}

export function DynamicChoice({
  items,
  suggestedItems,
  onSelect,
  searchLabel = "Search repositories",
  helperText,
  onSkip,
  skipLabel,
}: DynamicChoiceProps) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelect(id);
  };

  return (
    <Layout.Vertical gap="md">
      <div className="h-[220px] overflow-y-auto">
        {loading ? (
          <Layout.Vertical gap="xs" className="w-full">
            {items.slice(0, 5).map((item) => (
              <Skeleton.Box key={item.id} className="h-[36px] w-full rounded" />
            ))}
          </Layout.Vertical>
        ) : (
          <Layout.Vertical gap="xs" className="w-full">
            {items.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="md"
                className={`w-full shrink-0 min-w-0 justify-start overflow-hidden ${selected === item.id ? "bg-cn-selected" : ""}`}
                onClick={() => handleSelect(item.id)}
              >
                <span className="min-w-0 flex-1 overflow-hidden text-left">
                  <Text
                    truncate
                    variant="body-normal"
                    color="foreground-1"
                    className="block min-w-0 w-full"
                  >
                    {item.name}
                  </Text>
                </span>
              </Button>
            ))}
          </Layout.Vertical>
        )}
      </div>
      {helperText && (
        <Text variant="body-normal" color="foreground-3">
          {helperText}
        </Text>
      )}
      {suggestedItems && suggestedItems.length > 0 && (
        <div className="flex shrink-0 flex-col items-start gap-cn-xs">
          {loading
            ? suggestedItems.map((item) => (
                <Skeleton.Box
                  key={item.id}
                  className="h-[36px] w-full rounded"
                />
              ))
            : suggestedItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="md"
                  className={`w-full shrink-0 min-w-0 justify-start overflow-hidden ${selected === item.id ? "bg-cn-selected" : ""}`}
                  onClick={() => handleSelect(item.id)}
                >
                  <span className="min-w-0 flex-1 overflow-hidden text-left">
                    <Text
                      truncate
                      variant="body-normal"
                      color="foreground-1"
                      className="block min-w-0 w-full"
                    >
                      {item.name}
                    </Text>
                  </span>
                </Button>
              ))}
        </div>
      )}
      <Button
        variant="outline"
        size="md"
        className="w-full justify-center"
        onClick={handleRefresh}
        disabled={loading}
      >
        {loading ? (
          <IconV2 name="loader" size="xs" className="animate-spin" />
        ) : (
          <IconV2 name="search" size="xs" />
        )}
        {loading ? "Refreshing..." : searchLabel}
      </Button>
      {onSkip && (
        <Button variant="ghost" size="sm" onClick={onSkip}>
          {skipLabel || "Skip"}
        </Button>
      )}
    </Layout.Vertical>
  );
}
