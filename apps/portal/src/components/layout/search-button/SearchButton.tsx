import { type KeyboardEvent } from "react";
import { SearchInput, Shortcut } from "@harnessio/ui/components";

export default function SearchButton() {
  const handleClick = () => {
    const run = () => {
      setTimeout(() => {
        const btn =
          document.querySelector<HTMLButtonElement>(
            "site-search button[data-open-modal]",
          ) ??
          document.querySelector<HTMLButtonElement>("button[data-open-modal]");
        if (!btn) return;

        if (btn.disabled) {
          setTimeout(() => !btn.disabled && btn.click(), 50);
          return;
        }
        btn.click();
      }, 0);
    };

    if ("whenDefined" in customElements) {
      customElements.whenDefined("site-search").then(run);
    } else {
      run();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Tab") return;
    handleClick();
  };

  return (
    <button
      className="max-w-full overflow-hidden"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <SearchInput
        size="sm"
        placeholder="Search"
        className="pointer-events-none"
        inputContainerClassName="border-cn-borders-2 [&>.cn-input-prefix]:w-[34px] max-w-full overflow-hidden"
        suffix={
          <Shortcut className="mr-1.5 transition-opacity group-data-[state=collapsed]:opacity-0">
            ⌘K
          </Shortcut>
        }
        readOnly
        aria-hidden="true"
        tabIndex={-1}
      />
    </button>
  );
}
