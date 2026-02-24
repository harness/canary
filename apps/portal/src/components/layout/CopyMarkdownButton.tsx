import { useState } from "react";

export function CopyMarkdownButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const content = document.querySelector("main");
    if (!content) return;

    const text = content.innerText;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-cn-3xs px-cn-sm py-cn-3xs text-cn-size-4 text-cn-3 bg-cn-2 border border-cn-3/50 rounded-cn-3 hover:bg-cn-3 hover:text-cn-1 transition-all duration-150 cursor-pointer"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {copied ? (
          <polyline points="20 6 9 17 4 12" />
        ) : (
          <>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </>
        )}
      </svg>
      {copied ? "Copied!" : "Copy Markdown"}
    </button>
  );
}

export default CopyMarkdownButton;
