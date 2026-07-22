import { cn } from "@harnessio/ui/utils";

type LogLineKind = "success" | "error" | "progress" | "header" | "default";

interface TerminalOutputProps {
  logs: string[];
  showCursor?: boolean;
}

function parseLogLine(log: string): { kind: LogLineKind; text: string } {
  if (log.startsWith("✓")) {
    return { kind: "success", text: log.slice(1).trimStart() };
  }
  if (log.startsWith("✗")) {
    return { kind: "error", text: log.slice(1).trimStart() };
  }
  if (log.startsWith("→")) {
    return { kind: "progress", text: log.slice(1).trimStart() };
  }
  if (log.endsWith("...") && !log.includes(":")) {
    return { kind: "header", text: log };
  }
  return { kind: "default", text: log };
}

function TerminalLogRow({ kind, text }: { kind: LogLineKind; text: string }) {
  const pipe = (
    <span
      className="text-cn-3 w-3 shrink-0 select-none text-center"
      aria-hidden
    >
      |
    </span>
  );

  if (kind === "header") {
    return (
      <div className="flex items-baseline gap-cn-2xs">
        {pipe}
        <span className="text-cn-warning font-medium">{text}</span>
      </div>
    );
  }

  if (kind === "success") {
    return (
      <div className="flex items-baseline gap-cn-2xs">
        {pipe}
        <span className="text-cn-success shrink-0" aria-hidden>
          ✓
        </span>
        <span className="text-cn-success">{text}</span>
      </div>
    );
  }

  if (kind === "error") {
    return (
      <div className="flex items-baseline gap-cn-2xs">
        {pipe}
        <span className="text-cn-danger shrink-0" aria-hidden>
          ✗
        </span>
        <span className="text-cn-danger">{text}</span>
      </div>
    );
  }

  if (kind === "progress") {
    return (
      <div className="flex items-baseline gap-cn-2xs">
        {pipe}
        <span className="text-cn-2">{text}</span>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-cn-2xs">
      {pipe}
      <span className="text-cn-2">{text}</span>
    </div>
  );
}

export function TerminalOutput({
  logs,
  showCursor = false,
}: TerminalOutputProps) {
  return (
    <div
      className={cn(
        "bg-cn-3 rounded-cn-3 p-cn-3 font-mono text-cn-size-2 max-h-[200px] overflow-auto",
      )}
    >
      <div className="flex flex-col gap-cn-2xs">
        {logs.map((log, idx) => {
          const { kind, text } = parseLogLine(log);

          return <TerminalLogRow key={idx} kind={kind} text={text} />;
        })}
        {showCursor && (
          <div className="text-cn-3 flex items-baseline gap-cn-2xs">
            <span className="text-cn-3 w-3 shrink-0 text-center" aria-hidden>
              |
            </span>
            <span className="animate-pulse">_</span>
          </div>
        )}
      </div>
    </div>
  );
}
