import type { FC, PropsWithChildren } from "react";

const ExampleLayout: FC<
  PropsWithChildren<React.HTMLAttributes<HTMLElement>>
> = ({ children }) => (
  <div className="border-cn-borders-3 bg-cn-background-hover overflow-hidden rounded-md border px-5 py-2">
    {children}
  </div>
);

export default ExampleLayout;
