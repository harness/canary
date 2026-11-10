export function Edge(): JSX.Element {
  return (
    <div className="cn-root dark flex min-h-screen w-full items-center justify-between gap-cn-md rounded-cn-2 border border-cn-2 bg-cn-1 p-cn-lg text-cn-1 hover:bg-cn-2 sm:grid md:w-cn-24 truncate [&>svg]:size-cn-4 shadow-cn-none bg-cn-brand-primary">
      x
    </div>
  )
}
export const T = <div className="light-std-std dark-high-contrast-protanopia">y</div>
export function Dynamic({ pct, px }: { pct: number; px: number }): JSX.Element {
  return (
    <div className="cn-page-content cn-page-content-pt" style={{ width: `${pct}%`, height: px }}>
      z
    </div>
  )
}
