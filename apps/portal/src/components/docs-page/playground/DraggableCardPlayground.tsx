import { type FC, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  DraggableCardList,
  IconV2,
  TooltipProvider,
} from "@harnessio/ui/components";
import ControlField from "./ControlField";
import type { PropControl } from "./types";

// DraggableCardList owns a drag-and-drop context and reorders a real array via
// `setCards`, so its state is live and can't be expressed by the generic schema. This
// is a bespoke playground: the controls drive the list-level + per-card props, and a
// local useState holds the cards so dragging actually reorders them.

// ① The base cards — just id + content. The per-card props (size, gripPosition) and
//    whether a description shows are applied from the controls at render time, so
//    toggling a control never loses the base content or the current order.
interface BaseCard {
  id: string;
  title: string;
  description: string;
}

const INITIAL_CARDS: BaseCard[] = [
  {
    id: "1",
    title: "auth-service",
    description: "Handles sign-in and tokens.",
  },
  { id: "2", title: "api-gateway", description: "Routes traffic to services." },
  {
    id: "3",
    title: "billing-service",
    description: "Invoices and subscriptions.",
  },
];

// ② State — one field per control.
interface State {
  gripPosition: "inside" | "outside";
  size: "sm" | "md" | "lg";
  listGap: "xs" | "sm" | "md" | "lg";
  descriptions: boolean;
}

const INITIAL_STATE: State = {
  gripPosition: "inside",
  size: "md",
  listGap: "md",
  descriptions: true,
};

// ③ Mirror exactly what the preview renders — a self-contained snippet, since the
//    cards are stateful.
function generateCode(s: State, cards: BaseCard[]): string {
  const cardLines = cards.flatMap((c) => {
    const fields = [`id: '${c.id}'`, `title: '${c.title}'`];
    if (s.descriptions) fields.push(`description: '${c.description}'`);
    if (s.size !== "md") fields.push(`size: '${s.size}'`);
    if (s.gripPosition !== "inside")
      fields.push(`gripPosition: '${s.gripPosition}'`);
    return [`    { ${fields.join(", ")} },`];
  });

  const listAttrs = ["cards={cards}", "setCards={setCards}"];
  if (s.listGap !== "md") listAttrs.push(`listGap="${s.listGap}"`);

  return [
    "() => {",
    "  const [cards, setCards] = useState([",
    ...cardLines,
    "  ])",
    "  return (",
    `    <DraggableCardList ${listAttrs.join(" ")} />`,
    "  )",
    "}",
  ].join("\n");
}

const DraggableCardPlayground: FC = () => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [cards, setCards] = useState<BaseCard[]>(INITIAL_CARDS);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setState(INITIAL_STATE);
    setCards(INITIAL_CARDS);
  };

  // ④ Curated control set.
  const controls: PropControl[] = [
    {
      name: "gripPosition",
      type: "select",
      options: ["inside", "outside"],
      description: "Where the drag handle sits",
    },
    {
      name: "size",
      type: "select",
      options: ["sm", "md", "lg"],
      description: "Card size",
    },
    { name: "listGap", type: "select", options: ["xs", "sm", "md", "lg"] },
    {
      name: "descriptions",
      type: "boolean",
      description: "Show a description line",
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

  // ⑤ Render the real DraggableCardList from state. Augment each base card with the
  //    current control values, and on reorder map the returned (augmented) cards back
  //    to their base objects by id so content and order survive the round-trip.
  const rendered = cards.map((c) => ({
    id: c.id,
    title: c.title,
    description: state.descriptions ? c.description : undefined,
    size: state.size,
    gripPosition: state.gripPosition,
  }));

  const handleReorder = (next: typeof rendered) => {
    const byId = Object.fromEntries(cards.map((c) => [c.id, c]));
    setCards(next.map((c) => byId[c.id]));
  };

  const preview = (
    <div className="w-[420px] max-w-full">
      <DraggableCardList
        cards={rendered}
        setCards={handleReorder as never}
        listGap={state.listGap}
      />
    </div>
  );

  const code = useMemo(() => generateCode(state, cards), [state, cards]);

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

export default DraggableCardPlayground;
