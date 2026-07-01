interface TerminalOutputProps {
  logs: string[];
  showCursor?: boolean;
}

export function TerminalOutput({
  logs,
  showCursor = false,
}: TerminalOutputProps) {
  return (
    <div className="bg-cn-3 rounded-cn-3 p-cn-3 font-mono text-xs max-h-[200px] overflow-auto">
      {logs.map((log, idx) => (
        <div
          key={idx}
          className={
            log.startsWith("✓")
              ? "text-green-400"
              : log.startsWith("✗")
                ? "text-red-400"
                : "text-cn-2"
          }
        >
          {log}
        </div>
      ))}
      {showCursor && <div className="text-cn-3 animate-pulse">_</div>}
    </div>
  );
}
