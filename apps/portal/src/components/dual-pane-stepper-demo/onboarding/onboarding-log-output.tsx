import { TerminalOutput } from "./terminal-output";

interface LogOutputProps {
  logs: string[];
  done: boolean;
}

export function LogOutput({ logs, done }: LogOutputProps) {
  return <TerminalOutput logs={logs} showCursor={!done} />;
}
