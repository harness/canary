import type { FC, PropsWithChildren } from "react";

const ExampleLayout: FC<
  PropsWithChildren<React.HTMLAttributes<HTMLElement>>
> = ({ children }) => (
  <div className="border-cn-3 bg-cn-3 overflow-hidden rounded-3 border px-5 py-2">
    {children}
  </div>
);

export default ExampleLayout;
