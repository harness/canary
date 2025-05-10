import { SearchInput } from "@harnessio/ui/components";
import { useState } from "react";

export default function SearchInputDoc() {
  // Using useState hook to track search value
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <div className="mb-2 w-full font-bold">Search with State:</div>
      <SearchInput
        placeholder="Type to search..."
        onChange={(value) => setSearchValue(value)}
      />
      <div className="rounded-md border p-3">
        <div className="text-sm font-medium underline underline-offset-2">
          Current Search Value:
        </div>
        <p className="mt-1 font-mono text-sm">{searchValue || "(empty)"}</p>
      </div>
    </>
  );
}
