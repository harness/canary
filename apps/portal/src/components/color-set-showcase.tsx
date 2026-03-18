import { cn } from "@harnessio/ui/utils";

const SETS = [
  {
    name: "Brand",
    p: "bg-cn-brand-primary [color:var(--cn-set-brand-primary-text)]",
    s: "bg-cn-brand-secondary [color:var(--cn-set-brand-secondary-text)]",
    o: "bg-cn-brand-outline [color:var(--cn-set-brand-outline-text)] [border-color:var(--cn-set-brand-outline-border)] border",
  },
  {
    name: "Success",
    p: "bg-cn-success-primary text-cn-success-primary",
    s: "bg-cn-success-secondary text-cn-success-secondary",
    o: "bg-cn-success-outline text-cn-success-outline border border-cn-success-outline",
  },
  {
    name: "Danger",
    p: "bg-cn-danger-primary text-cn-danger-primary",
    s: "bg-cn-danger-secondary text-cn-danger-secondary",
    o: "bg-cn-danger-outline text-cn-danger-outline border border-cn-danger-outline",
  },
  {
    name: "Warning",
    p: "bg-cn-warning-primary text-cn-warning-primary",
    s: "bg-cn-warning-secondary text-cn-warning-secondary",
    o: "bg-cn-warning-outline text-cn-warning-outline border border-cn-warning-outline",
  },
  {
    name: "Gray",
    p: "bg-cn-gray-primary text-cn-gray-primary",
    s: "bg-cn-gray-secondary text-cn-gray-secondary",
    o: "bg-cn-gray-outline text-cn-gray-outline border border-cn-gray-outline",
  },
  {
    name: "Blue",
    p: "bg-cn-blue-primary text-cn-blue-primary",
    s: "bg-cn-blue-secondary text-cn-blue-secondary",
    o: "bg-cn-blue-outline text-cn-blue-outline border border-cn-blue-outline",
  },
  {
    name: "Purple",
    p: "bg-cn-purple-primary text-cn-purple-primary",
    s: "bg-cn-purple-secondary text-cn-purple-secondary",
    o: "bg-cn-purple-outline text-cn-purple-outline border border-cn-purple-outline",
  },
  {
    name: "Indigo",
    p: "bg-cn-indigo-primary text-cn-indigo-primary",
    s: "bg-cn-indigo-secondary text-cn-indigo-secondary",
    o: "bg-cn-indigo-outline text-cn-indigo-outline border border-cn-indigo-outline",
  },
  {
    name: "Cyan",
    p: "bg-cn-cyan-primary text-cn-cyan-primary",
    s: "bg-cn-cyan-secondary text-cn-cyan-secondary",
    o: "bg-cn-cyan-outline text-cn-cyan-outline border border-cn-cyan-outline",
  },
  {
    name: "Mint",
    p: "bg-cn-mint-primary text-cn-mint-primary",
    s: "bg-cn-mint-secondary text-cn-mint-secondary",
    o: "bg-cn-mint-outline text-cn-mint-outline border border-cn-mint-outline",
  },
  {
    name: "Forest",
    p: "bg-cn-forest-primary text-cn-forest-primary",
    s: "bg-cn-forest-secondary text-cn-forest-secondary",
    o: "bg-cn-forest-outline text-cn-forest-outline border border-cn-forest-outline",
  },
  {
    name: "Orange",
    p: "bg-cn-orange-primary text-cn-orange-primary",
    s: "bg-cn-orange-secondary text-cn-orange-secondary",
    o: "bg-cn-orange-outline text-cn-orange-outline border border-cn-orange-outline",
  },
  {
    name: "Brown",
    p: "bg-cn-brown-primary text-cn-brown-primary",
    s: "bg-cn-brown-secondary text-cn-brown-secondary",
    o: "bg-cn-brown-outline text-cn-brown-outline border border-cn-brown-outline",
  },
  {
    name: "Pink",
    p: "bg-cn-pink-primary text-cn-pink-primary",
    s: "bg-cn-pink-secondary text-cn-pink-secondary",
    o: "bg-cn-pink-outline text-cn-pink-outline border border-cn-pink-outline",
  },
  {
    name: "Violet",
    p: "bg-cn-violet-primary text-cn-violet-primary",
    s: "bg-cn-violet-secondary text-cn-violet-secondary",
    o: "bg-cn-violet-outline text-cn-violet-outline border border-cn-violet-outline",
  },
];

export const BrandSetShowcase: React.FC = () => null;

export const AllSetsShowcase: React.FC = () => (
  <div className="not-content mt-4 flex flex-col" style={{ gap: "8px" }}>
    {SETS.map((set) => (
      <div key={set.name} className="flex items-center" style={{ gap: "12px" }}>
        <div
          style={{
            width: "76px",
            flexShrink: 0,
            textAlign: "right",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            alignSelf: "stretch",
          }}
        >
          <span className="text-cn-size-3 text-cn-2 font-medium">
            {set.name}
          </span>
        </div>
        <div style={{ flex: "1 1 0%", minWidth: 0 }}>
          <div
            className={cn(
              "flex items-center justify-center h-11 rounded-cn-2",
              set.p,
            )}
          >
            <span className="text-cn-size-2 font-mono leading-none">
              Primary
            </span>
          </div>
        </div>
        <div style={{ flex: "1 1 0%", minWidth: 0 }}>
          <div
            className={cn(
              "flex items-center justify-center h-11 rounded-cn-2",
              set.s,
            )}
          >
            <span className="text-cn-size-2 font-mono leading-none">
              Secondary
            </span>
          </div>
        </div>
        <div style={{ flex: "1 1 0%", minWidth: 0 }}>
          <div
            className={cn(
              "flex items-center justify-center h-11 rounded-cn-2",
              set.o,
            )}
          >
            <span className="text-cn-size-2 font-mono leading-none">
              Outline
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);
