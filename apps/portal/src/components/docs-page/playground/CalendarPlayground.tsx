import { type FC, useMemo, useState } from "react";
import {
  Button,
  Calendar,
  CopyButton,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// Calendar is a thin wrapper around react-day-picker's DayPicker, so its selection
// lives in component state and its shape depends on `mode` (a Date, a Date[], or a
// range). That state can't be expressed by the generic schema-driven controls, so
// this is a bespoke playground: the controls drive the props, a local useState holds
// the current selection, and switching mode resets the selection to a shape that mode
// understands.

// ② State — one field per control.
interface State {
  mode: "single" | "multiple" | "range";
  weekStartsOn: "0" | "1" | "2" | "3" | "4" | "5" | "6";
  showOutsideDays: boolean;
  bounded: boolean;
}

const INITIAL_STATE: State = {
  mode: "single",
  weekStartsOn: "1",
  showOutsideDays: true,
  bounded: false,
};

// A fresh selection value appropriate for the given mode. Called on mount, whenever
// mode changes, and on reset — so the Calendar never receives a selection whose shape
// its current mode can't read.
function initialSelection(mode: State["mode"]) {
  const today = new Date();
  if (mode === "single") return today;
  if (mode === "multiple") return [today];
  const to = new Date();
  to.setDate(to.getDate() + 4);
  return { from: today, to };
}

// ③ Mirror exactly what the preview renders — a self-contained snippet, since the
//    selection is stateful.
function generateCode(s: State): string {
  const stateLine =
    s.mode === "single"
      ? "  const [selected, setSelected] = useState<Date | undefined>(new Date())"
      : s.mode === "multiple"
        ? "  const [selected, setSelected] = useState<Date[]>([new Date()])"
        : "  const [selected, setSelected] = useState<DateRange | undefined>()";

  const bounds: string[] = [];
  if (s.bounded) {
    bounds.push(
      "  const fromDate = new Date()",
      "  fromDate.setDate(fromDate.getDate() - 5)",
      "  const toDate = new Date()",
      "  toDate.setDate(toDate.getDate() + 5)",
    );
  }

  const attrs = [
    `    mode="${s.mode}"`,
    "    selected={selected}",
    "    onSelect={setSelected}",
    `    weekStartsOn={${s.weekStartsOn}}`,
  ];
  if (s.showOutsideDays) attrs.push("    showOutsideDays");
  if (s.bounded) {
    attrs.push("    fromDate={fromDate}", "    toDate={toDate}");
  }

  return [
    "() => {",
    stateLine,
    ...bounds,
    "  return (",
    "    <Calendar",
    ...attrs,
    "    />",
    "  )",
    "}",
  ].join("\n");
}

const CalendarPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [selected, setSelected] = useState<unknown>(() =>
    initialSelection(INITIAL_STATE.mode),
  );

  const set = <K extends keyof State>(key: K, value: State[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
    // Mode changes the selection's shape (Date vs Date[] vs range). Reset it in the
    // same update as the mode so react-day-picker never renders with a selection that
    // mismatches the mode — its multiple mode calls `.some()` on the selection and a
    // leftover single Date would throw.
    if (key === "mode") setSelected(initialSelection(value as State["mode"]));
  };

  const reset = () => {
    setState(INITIAL_STATE);
    setSelected(initialSelection(INITIAL_STATE.mode));
  };

  // ④ Curated control set.
  const controls: PropControl[] = [
    { name: "mode", type: "select", options: ["single", "multiple", "range"] },
    {
      name: "weekStartsOn",
      type: "select",
      options: ["0", "1", "2", "3", "4", "5", "6"],
      description: "0 = Sunday … 6 = Saturday",
    },
    {
      name: "showOutsideDays",
      type: "boolean",
      description: "Show muted adjacent-month days",
    },
    {
      name: "bounded",
      type: "boolean",
      description: "Clamp selectable days to ±5 from today",
    },
  ];

  const inputControls = controls.filter((c) => c.type !== "boolean");
  const booleanControls = controls.filter((c) => c.type === "boolean");

  const renderControl = (prop: PropControl) => (
    <ControlField
      key={prop.name}
      prop={prop}
      value={state[prop.name as keyof State]}
      onChange={(v) => set(prop.name as keyof State, v as never)}
    />
  );

  // ⑤ Render the real Calendar from state, mirroring generateCode exactly. The
  //    mode/selected/onSelect union is a discriminated type in react-day-picker;
  //    collect the props in a loosely-typed object so the dynamic mode doesn't fight
  //    the compiler (the dev server renders regardless).
  const bounds = useMemo(() => {
    if (!state.bounded) return {};
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 5);
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 5);
    return { fromDate, toDate };
  }, [state.bounded]);

  // Guard: always hand react-day-picker a selection whose shape matches the current
  // mode, so a mismatched value can never reach it (even on the first render after a
  // mode switch). Its multiple mode calls `.some()` on the selection, so a single Date
  // there would throw.
  const safeSelected = useMemo(() => {
    if (state.mode === "multiple")
      return Array.isArray(selected) ? selected : [];
    if (state.mode === "range") {
      return selected &&
        typeof selected === "object" &&
        !Array.isArray(selected) &&
        !(selected instanceof Date)
        ? selected
        : undefined;
    }
    return selected instanceof Date ? selected : undefined;
  }, [state.mode, selected]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calendarProps: any = {
    mode: state.mode,
    selected: safeSelected,
    onSelect: setSelected,
    weekStartsOn: Number(state.weekStartsOn),
    showOutsideDays: state.showOutsideDays,
    ...bounds,
  };

  const preview = <Calendar {...calendarProps} />;

  const code = useMemo(() => generateCode(state), [state]);

  return (
    <TooltipProvider>
      <div className="bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border">
        {/* --- Preview stage --- */}
        <div className="bg-cn-2 relative flex justify-center p-cn-3xl">
          <Button
            variant="outline"
            size="sm"
            iconOnly
            onClick={reset}
            className="absolute right-cn-sm top-cn-sm z-10"
            tooltipProps={{ content: "Reset to defaults" }}
          >
            <IconV2 name="refresh" />
          </Button>

          {preview}
        </div>

        {/* --- Control grids: bg-cn-1 surface, max 3 per row --- */}
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {inputControls.map(renderControl)}
        </div>
        <div className="bg-cn-1 grid grid-cols-3 gap-cn-lg border-t p-cn-md">
          {booleanControls.map(renderControl)}
        </div>

        {/* --- Show code --- */}
        <details className="example-expand bg-cn-2 relative border-t p-cn-sm">
          <CopyButton
            buttonVariant="transparent"
            className="absolute right-cn-sm top-cn-sm"
            name={code}
          />
          <summary className="flex cursor-pointer select-none items-center gap-cn-3xs text-cn-size-2">
            Show code
          </summary>
          <pre
            className="font-body-code p-cn-3xs text-cn-size-2 leading-6"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {code}
          </pre>
        </details>
      </div>
    </TooltipProvider>
  );
};

export default CalendarPlayground;
