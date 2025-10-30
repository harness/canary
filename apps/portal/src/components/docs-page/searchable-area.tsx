import { type ReactNode, useRef, useState } from "react";
import { Text, Layout, SearchInput } from "@harnessio/ui/components";
import { cn } from "@harnessio/ui/utils";

interface SearchableAreaProps {
  children: ReactNode;
  containerClassName?: string;
  dataAttributeSelector: string;
}

export const SearchableArea = ({
  children,
  containerClassName,
  dataAttributeSelector,
}: SearchableAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasResults, setHasResults] = useState(true);

  const handleSearch = (value: string) => {
    const searchTerm = value.toLowerCase();

    const items = containerRef.current?.querySelectorAll(
      `[${dataAttributeSelector}]`,
    );

    let visibleCount = 0;

    items?.forEach((item) => {
      const searchableText = item.getAttribute(dataAttributeSelector) || "";

      if (
        searchableText.toLowerCase().includes(searchTerm) ||
        searchTerm === ""
      ) {
        (item as HTMLElement).classList.remove("hidden");
        visibleCount++;
      } else {
        (item as HTMLElement).classList.add("hidden");
      }
    });

    setHasResults(visibleCount > 0);
  };

  return (
    <Layout.Vertical className="bg-cn-3 border-cn-2 p-cn-sm rounded border">
      <SearchInput onChange={handleSearch} />
      <div
        className={cn({ hidden: !hasResults }, containerClassName)}
        ref={containerRef}
      >
        {children}
      </div>

      {!hasResults && (
        <Layout.Vertical
          gap="md"
          align="center"
          justify="center"
          className="py-cn-4xl px-cn-2xl !m-0 my-auto size-full grow"
        >
          <Text variant="heading-section" align="center">
            No search results
          </Text>
        </Layout.Vertical>
      )}
    </Layout.Vertical>
  );
};
