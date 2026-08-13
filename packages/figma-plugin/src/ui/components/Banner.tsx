import type { ComponentChildren } from "preact";

export type BannerTone = "info" | "warn" | "fail" | "ok";

const ICONS: Record<BannerTone, string> = {
  info: "i",
  warn: "!",
  fail: "×",
  ok: "✓",
};

type Props = {
  tone?: BannerTone;
  children: ComponentChildren;
  actions?: ComponentChildren;
};

export function Banner({ tone = "info", children, actions }: Props) {
  return (
    <div
      class={`ds-banner ds-banner-${tone}`}
      role={tone === "fail" || tone === "warn" ? "alert" : "status"}
    >
      <span class="ds-banner-icon" aria-hidden="true">
        {ICONS[tone]}
      </span>
      <div class="ds-banner-body">
        {typeof children === "string" ? <p>{children}</p> : children}
        {actions ? <div class="ds-banner-actions">{actions}</div> : null}
      </div>
    </div>
  );
}
